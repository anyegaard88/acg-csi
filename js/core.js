// ── RENDER ──────────────────────────────────────────────────
function render(){
  var body=document.getElementById("body");
  if(view==="browse")rBrowse(body);
  else if(view==="platform")rPlatform(body);
  else if(view==="compare")rCompare(body);
  else if(view==="issues")rIssuesSearch(body);
  else if(view==="fav")rFavorites(body);
  else if(view==="settings")rSettings(body);
  else if(view==="audit")rAudit(body);
  else if(view==="brain")rBrain(body);
  else if(view==="help")rHelp(body);
  else if(view==="training")rTraining(body);
  else if(view==="profiles")rProfiles(body);
  else if(view==="releases")rReleases(body);
  else if(view==="home")rHome(body);
  else if(view==="postcall")rPostCall(body);
  else if(view==="knowledge")rKnowledge(body);
  else if(view==="fieldguides")rFieldGuides(body);
  else rAsk(body);
  // Show/hide topbar (ask bar) based on view
  var topbar=document.getElementById("topbar");
  var callVs=["ask","platform","compare","issues","postcall"];if(topbar)topbar.className=callVs.indexOf(view)>=0?"active":"";
  // Scratch pad state
  updateScratchPad();
  // Update favorites badge
  var favBtn=document.getElementById("nt-fav");
  if(favBtn){
    var existingF=favBtn.querySelector(".badge");if(existingF)existingF.remove();
    if(favorites.length){var bf=document.createElement("span");bf.className="badge";bf.textContent=favorites.length;favBtn.appendChild(bf);}
  }
}

// ── INIT ────────────────────────────────────────────────────
// ── LOGIN GATE ────────────────────────────────────────────────
function checkLoginGate(){
  // Always require login on every page load — clear the flag so gate always shows
  save(SK+"_login_done",false);
  showLoginGate();
  return false;
}
function showLoginGate(){
  var gate=document.getElementById("login-gate");
  gate.style.display="flex";
  document.getElementById("hdr").style.visibility="hidden";
  document.getElementById("body").style.visibility="hidden";
  var inp=document.getElementById("login-name-inp");
  setTimeout(function(){inp.focus();},100);
  function submit(){
    var name=inp.value.trim();
    if(!name){
      document.getElementById("login-error").style.display="block";
      return;
    }
    settings.name=name;
    save(SK+"_settings",settings);
    save(SK+"_login_done",true);
    gate.style.display="none";
    document.getElementById("hdr").style.visibility="visible";
    document.getElementById("body").style.visibility="visible";
    updateCtxBar();
    render();
  }
  document.getElementById("login-continue-btn").addEventListener("click",submit);
  inp.addEventListener("keydown",function(e){if(e.key==="Enter")submit();});
  inp.addEventListener("input",function(){document.getElementById("login-error").style.display="none";});
}

function init(){
  checkLoginGate();
  // Nav tabs
  ["ask","platform","compare","browse","fav","issues","audit","brain","help","settings","profiles"].forEach(function(id){
    var el=document.getElementById("nt-"+id);
    if(el)el.addEventListener("click",function(){SV(id);});
  });
  // Section buttons
  ["call","knowledge","work"].forEach(function(s){
    var el=document.getElementById("ns-"+s);
    if(el)el.addEventListener("click",function(){
      // If already in this section, stay — otherwise go to home-like first tab
      var firstTabs={call:"ask",knowledge:"help",work:"profiles"};
      navSection=s;
      SV(firstTabs[s]||"ask");
    });
  });
  updateNavSections();
  // Quick Answers FAB
  // Scratch pad toggle button
  var spBtn=document.getElementById("scratch-btn");
  if(spBtn)spBtn.addEventListener("click",function(){
    scratchVisible=!scratchVisible;
    var sp=document.getElementById("scratch-pad");
    if(sp){sp.style.display=scratchVisible?"flex":"none";}
  });
  // Ask
  var inp=document.getElementById("ask-inp");
  inp.addEventListener("keydown",function(e){if(e.key==="Enter")doAsk();});
  inp.addEventListener("input",function(){if(!this.value.trim())render();});
  document.getElementById("ask-btn").addEventListener("click",doAsk);
  // Platform grid
  var pg=document.getElementById("plat-grid");
  PLATS.forEach(function(p){
    var b=document.createElement("button");b.className="plat-btn";b.textContent=p.label;b.setAttribute("data-label",p.label);
    b.addEventListener("click",function(){selectPlat(p.label);});
    pg.appendChild(b);
  });
  // Context bar
  document.getElementById("ctx-edit-btn").addEventListener("click",openCtx);
  document.getElementById("ctx-bar").addEventListener("click",function(e){if(e.target===this||e.target.id==="ctx-display")openCtx();});
  // Modals
  document.getElementById("eov").addEventListener("click",closeEdit);
  document.getElementById("emcl").addEventListener("click",closeEdit);
  document.getElementById("pov").addEventListener("click",closeCtx);
  document.getElementById("pmcl").addEventListener("click",closeCtx);
  document.addEventListener("keydown",function(e){if(e.key==="Escape"){closeEdit();closeCtx();}});
  // Scratch pad init
  initScratch();
  // Load sheet if saved
  if(settings.sheetUrl){SHEET_URL=settings.sheetUrl;setTimeout(loadFromSheet,600);}
  // Pre-populate ACG Takes (only if not already overridden by user)
  
  var takeKeys=Object.keys(ACG_TAKES);
  for(var ti=0;ti<takeKeys.length;ti++){
    var tk=takeKeys[ti];
    var parts=tk.split("·");
    if(parts.length===3){
      var sheet=parts[0],feature=parts[1],platform=parts[2];
      var existing=overrides[overrideKey(sheet,feature,platform)];
      // Only set if no user override exists yet (don't overwrite user edits)
      if(!existing||!existing.acgTake){
        if(!overrides[overrideKey(sheet,feature,platform)])overrides[overrideKey(sheet,feature,platform)]={};
        overrides[overrideKey(sheet,feature,platform)].acgTake=ACG_TAKES[tk];
        overrides[overrideKey(sheet,feature,platform)]._acgDefault=true;
      }
    }
  }
  updateCtxBar();
  render();
  inp.focus();
}

// ═══════════════════════════════════════════════════════════
// ACG TECH STACK AUDIT ENGINE
// ═══════════════════════════════════════════════════════════

var STACK_CATS={
  emr:{label:"Current EMR",plats:["4D","Nextech w/ P+","Nextech Cloud","Symplast","ModMed","AestheticsPro","Podium AI OS","PatientNow","drchrono","None"]},
  crm:{label:"CRM / Marketing",plats:["Nextech CRM","SymplastCRM","Zone DM","Dewy","Aesthetix CRM","GoHighLevel","Mailchimp","None"]},
  phone:{label:"Phone System",plats:["Weave","Podium Phones","RingCentral","Dialpad","Zoom Phone","Vonage","Nextiva","Basic landline","None"]},
  financing:{label:"Patient Financing",plats:["Cherry","CareCredit","Alphaeon Credit","PatientFi","None"]},
  imaging:{label:"Imaging",plats:["Canfield VECTRA","Canfield Mirror","Touch MD","Image Assist","VISIA Complexion","None"]},
  ai:{label:"AI / Scribe",plats:["ModMed Scribe","Doximity DoxGPT","Knowtex","4D AI","None"]}
};
