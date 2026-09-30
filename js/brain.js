// ── BRAIN GLOBALS ─────────────────────────────────────────────
var brainFilter="all";
var brainQ="";

// ── BRAIN LIST VIEW ──────────────────────────────────────────
function rBrain(body){
  var statusColors={answered:"#059669",research:"#D97706",resolved:"#6B7280"};
  var statusBg={answered:"#D1FAE5",research:"#FEF3C7",resolved:"#F3F4F6"};
  var statusLabel={answered:"Answered",research:"Need to Research",resolved:"Resolved"};

  var filtered=brainEntries.filter(function(e){
    if(brainFilter!=="all"&&e.status!==brainFilter)return false;
    if(brainQ){
      var hay=(e.text+" "+e.from+" "+e.tag+" "+e.by).toLowerCase();
      if(hay.indexOf(brainQ.toLowerCase())<0)return false;
    }
    return true;
  });

  var counts={all:brainEntries.length,answered:0,research:0,resolved:0};
  brainEntries.forEach(function(e){if(counts[e.status]!==undefined)counts[e.status]++;});

  var h='<div style="max-width:720px;margin:0 auto">'
    +'<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:10px">'
    +'<div><div style="font-family:Playfair Display,serif;font-size:22px;font-weight:700;color:var(--navy)">MyAnna</div>'
    +'<div style="font-size:12px;color:var(--text2)">Your captured intelligence \u2014 questions, answers, screenshots, in the moment</div></div>'
    +'<button id="capture-btn" style="padding:11px 18px;border-radius:8px;border:none;background:var(--gold);color:var(--navy);font-size:13px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif;white-space:nowrap">\u2295 Capture</button>'
    +'</div>'

    +'<div style="margin-bottom:14px"><input id="brain-search" type="text" value="'+esc(brainQ)+'" placeholder="Search captures..." style="width:100%;padding:10px 14px;border-radius:8px;border:1.5px solid var(--tan2);font-size:13px;font-family:Inter,sans-serif;outline:none"></div>'

    +'<div style="display:flex;gap:6px;margin-bottom:18px;flex-wrap:wrap">'
    +['all','answered','research','resolved'].map(function(f){
      var isOn=brainFilter===f;
      var lbl=f==="all"?"All":statusLabel[f];
      return'<button class="brain-filter" data-f="'+f+'" style="padding:5px 13px;border-radius:16px;font-size:12px;font-weight:600;border:1.5px solid '+(isOn?"var(--navy)":"var(--tan2)")+';background:'+(isOn?"var(--navy)":"transparent")+';color:'+(isOn?"#fff":"var(--text2)")+';cursor:pointer;font-family:Inter,sans-serif">'+lbl+' ('+(counts[f]||0)+')</button>';
    }).join("")
    +'</div>';

  if(!filtered.length){
    h+='<div class="empty" style="padding-top:30px"><div class="empty-icon">\uD83E\uDD77</div><div class="empty-title">'+(brainEntries.length?"No matches":"Nothing captured yet")+'</div>'
      +'<div class="empty-sub">'+(brainEntries.length?"Try a different search or filter.":"Tap + Capture to log a question, screenshot, or quick note the moment it happens.")+'</div></div>';
  } else {
    filtered.forEach(function(e){
      var promotedHtml=e.promoted?'<div style="margin-top:8px;padding:6px 10px;background:var(--blue-bg);border-radius:5px;font-size:11px;color:var(--blue);font-weight:600">\u2192 Promoted to '+esc(e.promoted)+'</div>':"";
      h+='<div style="background:var(--white);border-radius:10px;padding:14px 16px;margin-bottom:10px;box-shadow:0 1px 6px rgba(28,43,58,.07),0 0 0 1px rgba(28,43,58,.04)">'
        +'<div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:8px">'
        +'<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">'
        +'<span style="background:'+statusBg[e.status]+';color:'+statusColors[e.status]+';border-radius:4px;padding:2px 8px;font-size:10px;font-weight:700">'+statusLabel[e.status]+'</span>'
        +(e.tag?'<span style="background:var(--tan);color:var(--text3);border-radius:4px;padding:2px 8px;font-size:10px;font-weight:600">'+esc(e.tag)+'</span>':"")
        +'<span style="font-size:11px;color:var(--text3)">'+esc(e.by)+(e.from?' \u00b7 from '+esc(e.from):"")+' \u00b7 '+timeAgo(e.ts)+'</span>'
        +'</div>'
        +'<button class="brain-del" data-id="'+e.id+'" style="background:none;border:none;color:var(--tan2);cursor:pointer;font-size:16px;line-height:1">\u00d7</button>'
        +'</div>'
        +'<div style="font-size:13px;color:var(--text);line-height:1.6;margin-bottom:'+(e.image?"8px":"10px")+'">'+esc(e.text)+'</div>'
        +(e.image?'<img src="'+esc(e.image)+'" style="max-width:100%;max-height:200px;border-radius:7px;border:1px solid var(--tan2);margin-bottom:10px;display:block" onerror="this.style.display=\'none\'">':"")
        +promotedHtml
        +'<div style="display:flex;gap:6px;margin-top:10px;flex-wrap:wrap">'
        +(e.status!=="resolved"?'<button class="brain-status s-btn" data-id="'+e.id+'" data-status="resolved">Mark Resolved</button>':"")
        +(e.status==="research"?'<button class="brain-status s-btn" data-id="'+e.id+'" data-status="answered">Mark Answered</button>':"")
        +(!e.promoted?'<button class="brain-promote s-btn" data-id="'+e.id+'" style="background:var(--gold);color:var(--navy)">\u2192 Promote</button>':"")
        +'<button class="brain-faq s-btn" data-id="'+e.id+'" style="'+(e.faq?"background:var(--blue);color:#fff;border-color:var(--blue)":"")+'">'+(e.faq?"\u2605 In Quick Answers":"\u2606 Add to Quick Answers")+'</button>'
        +'<button class="brain-draft-article s-btn" data-id="'+e.id+'" style="background:var(--navy);color:#fff;border-color:var(--navy)">&#x1F4DA; Draft as Article</button>'
        +'</div>'
        +'</div>';
    });
  }
  h+='</div>';
  body.innerHTML=h;

  body.querySelector("#capture-btn").addEventListener("click",openCaptureModal);
  body.querySelector("#brain-search").addEventListener("input",function(){brainQ=this.value;render();});
  body.querySelectorAll(".brain-filter").forEach(function(b){b.addEventListener("click",function(){brainFilter=b.getAttribute("data-f");render();});});
  body.querySelectorAll(".brain-del").forEach(function(b){
    b.addEventListener("click",function(){
      var id=b.getAttribute("data-id");
      deleteBrainEntry(id);
      if(typeof fbDeleteBrainEntry==="function")fbDeleteBrainEntry(id);
      render();
    });
  });
  body.querySelectorAll(".brain-status").forEach(function(b){
    b.addEventListener("click",function(){updateBrainEntry(b.getAttribute("data-id"),{status:b.getAttribute("data-status")});render();});
  });
  body.querySelectorAll(".brain-promote").forEach(function(b){
    b.addEventListener("click",function(){openPromoteModal(b.getAttribute("data-id"));});
  });
  body.querySelectorAll(".brain-faq").forEach(function(b){
    b.addEventListener("click",function(){toggleFaqTag(b.getAttribute("data-id"));});
  });
  body.querySelectorAll(".brain-draft-article").forEach(function(b){
    b.addEventListener("click",function(){
      var entry=brainEntries.filter(function(e){return e.id===b.getAttribute("data-id");})[0];
      if(!entry)return;
      // Pre-populate a new Help Center article from this capture
      var newArt={
        id:uid(),
        title:"Draft: "+entry.text.slice(0,60)+(entry.text.length>60?"...":""),
        category:entry.tag||"General",
        tags:[entry.from||""].filter(Boolean),
        body:"## Overview\n\n"+entry.text+"\n\n## ACG Notes\n\n",
        author:entry.by||settings.name||"ACG",
        clientReady:false,published:false,
        created:Date.now(),updated:Date.now()
      };
      helpArticles.unshift(newArt);
      saveHelp();
      // Navigate to edit the new article
      helpSelectedId=newArt.id;
      helpView="edit";
      helpSubView="articles";
      navSection="knowledge";
      updateNavSections();
      SV("help");
      alert("Draft article created in Help Center. Edit it to refine before marking Client-Ready.");
    });
  });
}

// ── PROMOTE FLOW ─────────────────────────────────────────────
function openPromoteModal(id){
  var entry=brainEntries.filter(function(e){return e.id===id;})[0];
  if(!entry)return;
  document.getElementById("eov").style.display="block";
  var mo=document.getElementById("emo");mo.style.display="flex";
  document.getElementById("emtag").textContent="PROMOTE CAPTURE";
  document.getElementById("emttl").textContent="Turn this into structured data";
  var bd=document.getElementById("embd");
  bd.innerHTML='<div style="padding:12px 14px;background:var(--cream);border-radius:7px;margin-bottom:16px;font-size:12px;color:var(--text2);font-style:italic">"'+esc(entry.text.slice(0,140))+(entry.text.length>140?"\u2026":"")+'"</div>'
    +'<div class="em-field"><label class="em-lbl">Promote as</label>'
    +'<select id="pm-type" class="fsel"><option value="take">ACG Take (on existing feature)</option><option value="issue">Known Issue</option></select></div>'
    +'<div id="pm-take-fields">'
    +'<div class="em-field"><label class="em-lbl">Sheet</label><select id="pm-sheet" class="fsel">'+Object.keys(SL).map(function(k){return'<option value="'+k+'">'+SL[k]+'</option>';}).join("")+'</select></div>'
    +'<div class="em-field"><label class="em-lbl">Feature</label><input id="pm-feature" class="em-inp" type="text" placeholder="e.g. Injectable Documentation"></div>'
    +'<div class="em-field"><label class="em-lbl">Platform</label><input id="pm-platform" class="em-inp" type="text" value="'+esc(entry.tag||"")+'" placeholder="e.g. 4D"></div>'
    +'</div>'
    +'<div id="pm-issue-fields" style="display:none">'
    +'<div class="em-field"><label class="em-lbl">Platform</label><input id="pm-issue-plat" class="em-inp" type="text" value="'+esc(entry.tag||"")+'" placeholder="e.g. Symplast"></div>'
    +'<div class="em-field"><label class="em-lbl">Category</label><select id="pm-issue-cat" class="fsel"><option>WORKFLOW</option><option>CLINICAL</option><option>CONTRACT</option><option>INTEGRATION</option><option>REPORTING</option><option>PRICING</option><option>SUPPORT</option><option>MATURITY</option><option>SCOPE</option></select></div>'
    +'<div class="em-field"><label class="em-lbl">Severity</label><select id="pm-issue-sev" class="fsel"><option>Watch</option><option>Significant</option><option>Critical</option></select></div>'
    +'</div>'
    +'<button id="pm-save" class="em-save">Promote</button>';

  document.getElementById("pm-type").addEventListener("change",function(){
    var isIssue=this.value==="issue";
    document.getElementById("pm-take-fields").style.display=isIssue?"none":"block";
    document.getElementById("pm-issue-fields").style.display=isIssue?"block":"none";
  });

  document.getElementById("pm-save").addEventListener("click",function(){
    var type=document.getElementById("pm-type").value;
    if(type==="take"){
      var sheet=document.getElementById("pm-sheet").value;
      var feature=document.getElementById("pm-feature").value.trim();
      var platform=document.getElementById("pm-platform").value.trim();
      if(!feature||!platform){alert("Feature and platform required.");return;}
      setOverride(sheet,feature,platform,{acgTake:entry.text},"","Promoted from MyAnna capture");
      updateBrainEntry(id,{promoted:"ACG Take: "+feature+" \u00b7 "+platform});
    } else {
      var plat=document.getElementById("pm-issue-plat").value.trim();
      if(!plat){alert("Platform required.");return;}
      if(!knownIssues[plat])knownIssues[plat]=[];
      knownIssues[plat].push({cat:document.getElementById("pm-issue-cat").value,sev:document.getElementById("pm-issue-sev").value,status:"Active",issue:entry.text,workaround:"",ts:Date.now(),by:settings.name});
      save(SK+"_issues",knownIssues);
      updateBrainEntry(id,{promoted:"Known Issue: "+plat});
    }
    closeEdit();
    render();
  });
}

// ── CAPTURE MODAL ────────────────────────────────────────────
function openCaptureModal(){
  var platforms=["4D","Nextech w/ P+","Nextech Cloud","Symplast","Podium","ModMed","AestheticsPro","Weave","General"];
  var ov=document.getElementById("eov");
  var mo=document.getElementById("emo");
  document.getElementById("emtag").textContent="CAPTURE";
  document.getElementById("emttl").textContent="New Capture";
  var bd=document.getElementById("embd");
  bd.innerHTML='<div style="display:flex;flex-direction:column;gap:14px;padding:4px 0">'
    +'<div><label style="font-size:11px;font-weight:700;color:var(--text3);letter-spacing:.5px;display:block;margin-bottom:5px">NOTE / QUESTION</label>'
    +'<textarea id="cap-text" rows="4" style="width:100%;padding:10px 12px;border-radius:8px;border:1.5px solid var(--tan2);font-size:13px;font-family:Inter,sans-serif;outline:none;resize:vertical;box-sizing:border-box" placeholder="What happened, what was asked, what you noticed..."></textarea></div>'
    +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">'
    +'<div><label style="font-size:11px;font-weight:700;color:var(--text3);letter-spacing:.5px;display:block;margin-bottom:5px">PLATFORM TAG</label>'
    +'<select id="cap-tag" style="width:100%;padding:9px 12px;border-radius:8px;border:1.5px solid var(--tan2);font-size:13px;font-family:Inter,sans-serif;outline:none;background:var(--white)"><option value="">None</option>'
    +platforms.map(function(p){return'<option value="'+p+'">'+p+'</option>';}).join("")
    +'</select></div>'
    +'<div><label style="font-size:11px;font-weight:700;color:var(--text3);letter-spacing:.5px;display:block;margin-bottom:5px">STATUS</label>'
    +'<select id="cap-status" style="width:100%;padding:9px 12px;border-radius:8px;border:1.5px solid var(--tan2);font-size:13px;font-family:Inter,sans-serif;outline:none;background:var(--white)">'
    +'<option value="research">Need to Research</option><option value="answered">Answered</option><option value="resolved">Resolved</option>'
    +'</select></div></div>'
    +'<div><label style="font-size:11px;font-weight:700;color:var(--text3);letter-spacing:.5px;display:block;margin-bottom:5px">SOURCE (optional)</label>'
    +'<input id="cap-from" type="text" placeholder="e.g. client name, call, meeting..." style="width:100%;padding:9px 12px;border-radius:8px;border:1.5px solid var(--tan2);font-size:13px;font-family:Inter,sans-serif;outline:none;box-sizing:border-box"></div>'
    +'<button id="cap-save" style="width:100%;padding:12px;border-radius:8px;border:none;background:var(--gold);color:var(--navy);font-size:14px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif">Save Capture</button>'
    +'</div>';
  ov.style.display="block";
  mo.style.display="flex";
  document.getElementById("cap-text").focus();
  document.getElementById("cap-save").addEventListener("click",function(){
    var txt=document.getElementById("cap-text").value.trim();
    if(!txt)return;
    var entry={id:uid(),ts:Date.now(),by:currentUser||"ACG",from:document.getElementById("cap-from").value.trim(),text:txt,tag:document.getElementById("cap-tag").value,status:document.getElementById("cap-status").value,image:"",promoted:"",faq:false,faqTitle:""};
    brainEntries.unshift(entry);
    save(SK+"_brain",brainEntries);
    closeEdit();
    render();
  });
}

// ── BRAIN SHEET SYNC ─────────────────────────────────────────
function pushBrain(entry){
  syncToSheet({action:"brain",id:entry.id,ts:entry.ts,by:entry.by,from:entry.from,text:entry.text,image:entry.image,tag:entry.tag,status:entry.status,promoted:entry.promoted||"",faq:entry.faq?1:0,faqTitle:entry.faqTitle||""});
}


// ══════════════════════════════════════════════════════════════════════════════
// HELP CENTER
// ══════════════════════════════════════════════════════════════════════════════

var navSection="call"; // call | knowledge | work
var helpView="list"; // list | read | edit
var helpSubView="articles"; // articles | paths
var helpPathView="list"; // list | edit
var helpPathSelectedId=null;
var helpSelectedId=null;
var helpSearchQ="";
var helpFilterCat="All";

function saveHelp(){
  save(SK+"_help",helpArticles);
  // Sync to Azure — truncate body to avoid 64KB Azure Table Storage limit
  helpArticles.forEach(function(a){
    syncToSheet({
      action:"help",
      id:a.id,
      title:a.title||"",
      category:a.category||"",
      tags:JSON.stringify(a.tags||[]),
      body:(a.body||"").slice(0,30000),
      author:a.author||"",
      clientReady:a.clientReady?1:0,
      published:a.published?1:0,
      created:a.created||Date.now(),
      updated:a.updated||Date.now()
    });
  });
}
function savePaths(){
  save(SK+"_paths",helpPaths);
  helpPaths.forEach(function(p){
    syncToSheet(Object.assign({action:"path"},p));
  });
}
function saveProfiles(){
  save(SK+"_profiles",profiles);
  // Sync each profile to Azure
  profiles.forEach(function(p){
    syncToSheet(Object.assign({action:"profile"},p));
  });
}
function saveAuditCurrent(){save(SK+"_audit_current",{data:auditData,step:auditStep});}
