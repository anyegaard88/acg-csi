// ── FIREBASE CONFIG ───────────────────────────────────────────
var firebaseConfig = {
  apiKey: "AIzaSyDcopZgXcJ6Q1_ZNZbLJwT3bae8gpzOMyg",
  authDomain: "acg-csi.firebaseapp.com",
  projectId: "acg-csi",
  storageBucket: "acg-csi.firebasestorage.app",
  messagingSenderId: "760000396646",
  appId: "1:760000396646:web:a2a0add6636ac2144bdca7"
};

var fbApp = firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

// ── KEY → COLLECTION MAP ──────────────────────────────────────
// Maps localStorage key suffix to Firestore collection name + storage strategy
var FB_COLLECTIONS = {
  "_brain":     { col: "brain",     type: "array",  idField: "id" },
  "_help":      { col: "help",      type: "array",  idField: "id" },
  "_profiles":  { col: "profiles",  type: "array",  idField: "id" },
  "_grec":      { col: "releases",  type: "array",  idField: "id" },
  "_paths":     { col: "paths",     type: "array",  idField: "id" },
  "_overrides": { col: "overrides", type: "object" },
  "_issues":    { col: "issues",    type: "object" },
  "_audits":    { col: "audits",    type: "object" },
  "_swreviews": { col: "swreviews", type: "object" },
  "_changelog": { col: "changelog", type: "array",  idField: "when" },
  "_cust":      { col: "cust",      type: "array",  idField: "id" },
  "_practices": { col: "practices", type: "array",  idField: "id" },
};

// ── OVERRIDE save() TO AUTO-SYNC ─────────────────────────────
var _origSave = save;
save = function(key, val) {
  _origSave(key, val);  // always write to localStorage first
  // Find matching collection
  var match = null;
  var suffix = null;
  var suffixes = Object.keys(FB_COLLECTIONS);
  for (var i = 0; i < suffixes.length; i++) {
    if (key.indexOf(suffixes[i]) >= 0) {
      match = FB_COLLECTIONS[suffixes[i]];
      suffix = suffixes[i];
      break;
    }
  }
  if (!match || !val) return;

  try {
    if (match.type === "array" && Array.isArray(val)) {
      // Write each item as its own doc — use batch for efficiency
      var batch = db.batch();
      val.forEach(function(item) {
        var id = item[match.idField];
        if (!id) id = item.id || item.when || uid();
        // Firestore doc IDs can't have / . so sanitize
        var docId = String(id).replace(/[.#$/\[\]\/]/g, "_").substring(0, 100);
        var ref = db.collection(match.col).doc(docId);
        batch.set(ref, item, { merge: true });
      });
      batch.commit().catch(function(e) { console.warn("FB batch:", match.col, e); });
    } else if (match.type === "object" && typeof val === "object") {
      // For objects (keyed maps), write the whole thing as one doc
      // Split into chunks if it has sub-keys (like issues by platform, overrides by key)
      var entries = Object.keys(val);
      if (entries.length === 0) return;
      // Write each sub-key as its own doc for better real-time granularity
      var batch2 = db.batch();
      entries.forEach(function(k) {
        var docId = k.replace(/[.#$/\[\]\/]/g, "_").substring(0, 100);
        var ref = db.collection(match.col).doc(docId);
        var data = {};
        data["_key"] = k;
        data["_val"] = typeof val[k] === "object" ? val[k] : { value: val[k] };
        if (typeof val[k] === "object" && !Array.isArray(val[k])) {
          data = Object.assign({ _key: k }, val[k]);
        } else {
          data = { _key: k, _val: val[k] };
        }
        batch2.set(ref, data, { merge: true });
      });
      batch2.commit().catch(function(e) { console.warn("FB batch obj:", match.col, e); });
    }
  } catch(e) {
    console.warn("Firebase save error:", key, e);
  }
};

// ── FIRESTORE DELETE HELPER ───────────────────────────────────
function fbDelete(collection, id) {
  try {
    var docId = String(id).replace(/[.#$/\[\]\/]/g, "_").substring(0, 100);
    db.collection(collection).doc(docId).delete();
  } catch(e) {
    console.warn("Firebase delete failed:", collection, id, e);
  }
}

function fbDeleteBrainEntry(id) { fbDelete("brain", id); }

// ── REALTIME LISTENERS ────────────────────────────────────────
function startFirebaseListeners() {

  // Brain entries — most important, full real-time
  db.collection("brain").orderBy("ts", "desc").onSnapshot(function(snap) {
    if (snap.empty) return;
    brainEntries = snap.docs.map(function(d) { return d.data(); });
    _origSave(SK+"_brain", brainEntries);
    if (typeof render === "function" && view === "brain") render();
  }, function(e) { console.warn("brain listener:", e); });

  // Help articles
  db.collection("help").onSnapshot(function(snap) {
    if (snap.empty) return;
    helpArticles = snap.docs.map(function(d) { return d.data(); });
    _origSave(SK+"_help", helpArticles);
    if (typeof render === "function" && view === "help") render();
  }, function(e) { console.warn("help listener:", e); });

  // Profiles
  db.collection("profiles").onSnapshot(function(snap) {
    if (snap.empty) return;
    profiles = snap.docs.map(function(d) { return d.data(); });
    _origSave(SK+"_profiles", profiles);
    if (typeof render === "function" && view === "profiles") render();
  }, function(e) { console.warn("profiles listener:", e); });

  // Known issues (object keyed by platform)
  db.collection("issues").onSnapshot(function(snap) {
    if (snap.empty) return;
    var merged = {};
    snap.docs.forEach(function(d) {
      var data = d.data();
      var k = data._key || d.id;
      merged[k] = data._val || data.items || [];
    });
    if (Object.keys(merged).length) {
      knownIssues = merged;
      _origSave(SK+"_issues", knownIssues);
      if (typeof render === "function" && (view === "issues" || view === "brain")) render();
    }
  }, function(e) { console.warn("issues listener:", e); });

  // Overrides (object keyed by sheet·feature·platform)
  db.collection("overrides").onSnapshot(function(snap) {
    if (snap.empty) return;
    var merged = {};
    snap.docs.forEach(function(d) {
      var data = d.data();
      var k = data._key || d.id;
      merged[k] = data;
    });
    overrides = merged;
    _origSave(SK+"_overrides", overrides);
    if (typeof render === "function") render();
  }, function(e) { console.warn("overrides listener:", e); });

  // Changelog (read-only listener, no re-render needed)
  db.collection("changelog").orderBy("when", "desc").limit(200).onSnapshot(function(snap) {
    changelog = snap.docs.map(function(d) { return d.data(); });
    _origSave(SK+"_changelog", changelog);
  }, function(e) { console.warn("changelog listener:", e); });
}
