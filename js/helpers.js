// ── HELPERS ──────────────────────────────────────────────────
// Returns proactive watch-out strings for the context platform
function getCtxWarnings(){
  var plat=resolveCtxPlatform();
  if(!plat)return[];
  var W={
    "Nextech w/ P+":[
      {cat:"CONTRACT",feature:"Contract Flexibility",text:"Auto-renewing contracts are a documented pain point. Verify cancellation terms before client signs — get it in writing."},
      {cat:"REPORTING",feature:"Reporting & Analytics",text:"Reporting is significantly limited vs. Nextech Cloud. If analytics matter to this practice, push toward Cloud."},
      {cat:"IMPLEMENTATION",feature:"Procedure Consents",text:"Consent forms require Word doc uploads — plan this as a dedicated implementation project. ASPS integration ($275 one-time) is worth it."},
      {cat:"PRICING",feature:"Pricing Transparency",text:"Custom quotes only. Clients consistently report being charged for unexpected add-ons. Always request a full itemized quote."}
    ],
    "Nextech Cloud":[
      {cat:"CONTRACT",feature:"Contract Flexibility",text:"Auto-renewing contracts — same risk as P+. Get the cancellation process in writing before signing."},
      {cat:"IMPLEMENTATION",feature:"Procedure Consents",text:"Consent form setup is a heavy lift. ASPS integration ($275 one-time) is recommended. Start content project before go-live."},
      {cat:"IMPLEMENTATION",feature:"Implementation Timeline",text:"48-hour switchover downtime needs to be scheduled carefully — coordinate with the practice administrator well in advance."},
      {cat:"WORKFLOW",feature:"Online Booking",text:"Appointment type matrix must be built before online booking works properly. Plan this as a project, not a feature you turn on."}
    ],
    "4D":[
      {cat:"CLINICAL",feature:"Mobile App",text:"No dedicated mobile app — browser-based only. Providers who want to chart from their phone will notice this gap."},
      {cat:"IMPLEMENTATION",feature:"Procedure Consents",text:"Consent forms require Word documents — manual upload required. Budget significant setup time. ASPS integration ($275 one-time) recommended."},
      {cat:"WORKFLOW",feature:"2-Way Text Messaging",text:"Native 2-way texting is limited — no photo support, weak notifications. Most practices pair 4D with Weave. Budget for this add-on."},
      {cat:"CLINICAL",feature:"AI Scribe",text:"4D AI Scribe is $175/provider/month for a basic tool with no template customization. ModMed Scribe or Doximity DoxGPT are better options."},
      {cat:"WORKFLOW",feature:"Injectable Documentation",text:"Units entered on chart notes don’t auto-pull into charges or inventory. Workaround-dependent for high-volume injector practices."}
    ],
    "Symplast":[
      {cat:"CONTRACT",feature:"Contract Flexibility",text:"Sales process can be aggressive on contract terms. Coach client to review carefully and take time before signing."},
      {cat:"IMPLEMENTATION",feature:"Procedure Consents",text:"Consent library requires 7-14 day lead time through Dev Team. Start building content well before go-live — not a same-day feature."},
      {cat:"CLINICAL",feature:"AI Scribe",text:"AI transcript data storage may be a legal liability. Get explicit clarity on Symplast’s data retention policy before recommending."},
      {cat:"CLINICAL",feature:"Surgical & OR Scheduling",text:"OR scheduling is lighter than Nextech or 4D for complex surgical practices. Not ideal for high-volume surgeons as a primary platform."},
      {cat:"WORKFLOW",feature:"Appointment Reminders",text:"Built-in reminder types are limited and hard to configure without deep training. Don’t assume this works out of the box."}
    ],
    "ModMed":[
      {cat:"IMPLEMENTATION",feature:"Procedure Consents",text:"Consent forms via Klara are a HUGE undertaking — 14-21 day lead time. Start this project immediately at kickoff, not after go-live."},
      {cat:"PRICING",feature:"Pricing Transparency",text:"Pricing not disclosed publicly. Push for a fully itemized quote. Some clients report variance between initial quote and final contract."},
      {cat:"IMPLEMENTATION",feature:"Implementation Timeline",text:"6-12 week enterprise-grade implementation. This is not a quick switch — set that expectation with the practice from day one."},
      {cat:"REPORTING",feature:"Reporting & Analytics",text:"Reporting can be clunky to run despite strong underlying data. AI-assisted reporting is improving but not fully there yet."},
      {cat:"WORKFLOW",feature:"Appointment Reminders",text:"Klara reminder integration workflow is not fully clear end-to-end. Get a live demo of the full flow before committing."}
    ],
    "Podium":[
      {cat:"CLINICAL",feature:"EMR Depth",text:"New EMR layer launched Jan 2026 — clinical depth is completely unproven. No independent reviews exist yet. Do not recommend for complex clinical practices."},
      {cat:"CLINICAL",feature:"Injectable Documentation",text:"No injectable tracking, no before/after photos, no surgical scheduling. Not appropriate for surgical or heavy-clinical practices."},
      {cat:"PRICING",feature:"Pricing Transparency",text:"Pricing requires a sales call. Add-on fees and surprise billing flagged in general Podium reviews. Get full itemized pricing before recommending."},
      {cat:"WORKFLOW",feature:"Phone Reliability",text:"Phone reliability and support responsiveness documented as complaints on the main Podium platform. Verify SLA for the aesthetics product."},
      {cat:"CONTRACT",feature:"Contract Flexibility",text:"Long-term contracts and auto-renewals flagged in G2 reviews on the general platform. Verify contract terms for the aesthetics-specific product."}
    ]
  };
  return W[plat]||[];
}

// ── SCRATCH PAD ─────────────────────────────────────────────
function updateScratchPad(){
  var sp=document.getElementById("scratch-pad");
  var st=document.getElementById("scratch-text");
  var sp2=document.getElementById("scratch-practice");
  if(!sp||!st)return;
  var key=practiceCtx.name||"general";
  if(sp2)sp2.textContent=practiceCtx.name?"— "+practiceCtx.name:"";
  // Load text for this practice
  if(!st.dataset.loaded||st.dataset.loadedKey!==key){
    st.value=scratchPads[key]||"";
    st.dataset.loaded="1";
    st.dataset.loadedKey=key;
  }
  sp.style.display=scratchVisible?"flex":"none";
}
function initScratch(){
  var st=document.getElementById("scratch-text");
  var saveBtn=document.getElementById("scratch-save-btn");
  var closeBtn=document.getElementById("scratch-close-btn");
  if(st){
    st.addEventListener("input",function(){
      var key=practiceCtx.name||"general";
      scratchPads[key]=st.value;
      save(SK+"_scratch",scratchPads);
    });
  }
  if(saveBtn){
    saveBtn.addEventListener("click",function(){
      var key=practiceCtx.name||"general";
      scratchPads[key]=st?st.value:"";
      save(SK+"_scratch",scratchPads);
      saveBtn.textContent="✓ Saved";
      setTimeout(function(){saveBtn.textContent="Save";},1500);
    });
  }
  if(closeBtn){
    closeBtn.addEventListener("click",function(){
      scratchVisible=false;
      var sp=document.getElementById("scratch-pad");
      if(sp)sp.style.display="none";
    });
  }
}

function getStatusClass(v){var s=String(v||"").toLowerCase();if(s==="yes"||s.indexOf("\u2705")===0)return"vyes";if(s==="partial"||s==="tbd"||s==="add-on"||s.indexOf("\u26a0")===0)return"vpart";if(s==="no"||s.indexOf("\u274c")===0)return"vno";return"";}
function getBadgeClass(v){var s=String(v||"").toLowerCase();if(s==="yes"||s.indexOf("\u2705")===0)return"sc-yes";if(s==="partial"||s==="tbd"||s==="add-on"||s.indexOf("\u26a0")===0)return"sc-partial";if(s==="no"||s.indexOf("\u274c")===0)return"sc-no";return"sc-plain";}
function resolveCtxPlatform(){
  if(!practiceCtx.emr)return null;
  var emrl=practiceCtx.emr.toLowerCase().trim();
  for(var i=0;i<PLATS.length;i++){
    for(var j=0;j<PLATS[i].keys.length;j++){
      if(emrl.indexOf(PLATS[i].keys[j].toLowerCase())>=0||PLATS[i].keys[j].toLowerCase().indexOf(emrl)>=0){
        return PLATS[i].label;
      }
    }
  }
  return null;
}

function findPlatKey(entry,platLabel){
  var keys=Object.keys(entry.c);
  for(var i=0;i<keys.length;i++){if(keys[i]===platLabel)return keys[i];}
  var p=PLATS.filter(function(pl){return pl.label===platLabel;})[0];
  if(p){for(var j=0;j<keys.length;j++){for(var k=0;k<p.keys.length;k++){if(keys[j]===p.keys[k])return keys[j];}}}
  var ll=platLabel.toLowerCase();
  for(var m=0;m<keys.length;m++){if(keys[m].toLowerCase().indexOf(ll)>=0||ll.indexOf(keys[m].toLowerCase())>=0)return keys[m];}
  return null;
}
function esc(s){return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
function hl(text,words){
  if(!words||!words.length||!text)return esc(String(text||""));
  var s=esc(String(text));
  words.forEach(function(w){if(w.length<3)return;try{var re=new RegExp("("+w.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+")","gi");s=s.replace(re,"<mark>$1</mark>");}catch(e){}});
  return s;
}
function timeAgo(ts){
  var d=Date.now()-ts;var m=Math.floor(d/60000);var h=Math.floor(m/60);var dy=Math.floor(h/24);
  if(m<1)return"just now";if(m<60)return m+"m ago";if(h<24)return h+"h ago";if(dy<7)return dy+"d ago";
  return new Date(ts).toLocaleDateString();
}
function isFav(q){return favorites.some(function(f){return f.query===q;});}
function toggleFav(q,label){
  var wasIn=isFav(q);
  if(wasIn){favorites=favorites.filter(function(f){return f.query!==q;});}
  else{favorites.unshift({query:q,label:label||q});}
  save(SK+"_favs",favorites);
  pushFavorite({query:q,label:label||q},wasIn);
}
function updateCtxBar(){
  var bar=document.getElementById("ctx-bar");
  var disp=document.getElementById("ctx-display");
  var notesPreview=document.getElementById("ctx-notes-preview");
  if(practiceCtx.name||practiceCtx.emr){
    bar.classList.remove("empty");
    var parts=[];
    if(practiceCtx.name)parts.push("<b style='color:var(--gold)'>"+esc(practiceCtx.name)+"</b>");
    if(practiceCtx.emr)parts.push("<span style='color:rgba(255,255,255,.5)'>on</span> <b style='color:#A8D4F5'>"+esc(practiceCtx.emr)+"</b>");
    if(practiceCtx.size)parts.push("<span style='color:rgba(255,255,255,.4)'>"+esc(practiceCtx.size)+"</span>");
    disp.innerHTML=parts.join(" ");
    if(notesPreview){
      if(practiceCtx.notes){notesPreview.style.display="inline";notesPreview.textContent="\u2014 "+practiceCtx.notes.slice(0,80)+(practiceCtx.notes.length>80?"\u2026":"");}
      else{notesPreview.style.display="none";}
    }
    var warnings=getCtxWarnings();
    var existingBadge=bar.querySelector(".ctx-warn-badge");
    if(existingBadge)existingBadge.remove();
    if(warnings.length){
      var wb=document.createElement("button");
      wb.className="ctx-warn-badge";
      wb.style.cssText="background:rgba(255,193,7,.2);color:#FFC107;border:1px solid rgba(255,193,7,.3);border-radius:10px;padding:2px 10px;font-size:10px;font-weight:700;margin-left:4px;cursor:pointer;font-family:Inter,sans-serif;";
      wb.textContent="\u26a0 "+warnings.length+" watch-out"+(warnings.length>1?"s":"");
      wb.addEventListener("click",function(e){e.stopPropagation();openWarnPopout();});
      var editBtn=document.getElementById("ctx-edit-btn");
      if(editBtn)bar.insertBefore(wb,editBtn);
    }
  } else {
    bar.classList.add("empty");
    disp.textContent="Not set \u2014 tap to set practice context for this call";
    if(notesPreview)notesPreview.style.display="none";
    var existingBadge=bar.querySelector(".ctx-warn-badge");
    if(existingBadge)existingBadge.remove();
  }
  updateSbCtx();
}

function SV(v){
  view=v;
  // Map view to nav section
  var sectionMap={home:"home",ask:"call",platform:"call",compare:"call",issues:"call",help:"knowledge",brain:"knowledge",releases:"knowledge",profiles:"work",audit:"work",browse:"work",fav:"work",settings:"work",fieldguides:"work"};
  navSection=sectionMap[v]||"call";
  updateNavSections();
  updateSbCtx();
  // Mark old nt- elements (hidden, kept for JS compat)
  ["ask","platform","compare","browse","fav","issues","audit","brain","help","settings","profiles","training","releases","postcall"].forEach(function(id){
    var el=document.getElementById("nt-"+id);if(el)el.classList.toggle("on",id===v);
  });
  // Mark main sidebar items active
  var callViews2=["ask","platform","compare","issues","postcall","home"];
  var knowViews=["knowledge","help","brain","releases","training"];
  var clientViews=["profiles","audit","browse","fav","fieldguides"];
  var isCall=callViews2.indexOf(v)>=0;
  var isKnow=knowViews.indexOf(v)>=0;
  var isClients=clientViews.indexOf(v)>=0;
  var callBtn=document.getElementById("sbi-call");
  var knowBtn=document.getElementById("sbi-knowledge");
  var profBtn=document.getElementById("sbi-profiles");
  var settBtn=document.getElementById("sb-settings-btn");
  if(callBtn){callBtn.classList.toggle("on",isCall||v==="home");}
  if(knowBtn){knowBtn.classList.toggle("on",isKnow);knowBtn.classList.toggle("know-active",isKnow);}
  if(profBtn){profBtn.classList.toggle("on",isClients);profBtn.classList.toggle("clients-active",isClients);}
  var fgBtn=document.getElementById("sbi-fieldguides");if(fgBtn){fgBtn.classList.toggle("on",v==="fieldguides");}
  // Call sub-nav active item
  ["ask","platform","compare","issues","postcall"].forEach(function(id){
    var btn=document.getElementById("csn-"+id);
    if(btn)btn.classList.toggle("on",id===v);
  });
  // Show/hide call sub-nav
  var csnav=document.getElementById("call-subnav");
  if(csnav)csnav.className=isCall?"active":"";
  // Update Post-Call badge
  var pcb=document.getElementById("pc-badge");
  if(pcb){var upc=brainEntries.filter(function(e){return !e.processed&&e.ts>Date.now()-604800000;}).length;pcb.style.display=upc?"":"none";pcb.textContent=upc;}
  // Update context in sidebar
  updateSbCtx();
  document.getElementById("ask-ui").style.display=v==="ask"?"block":"none";
  document.getElementById("pick-ui").style.display=v==="platform"||v==="issues"?"block":"none";
  document.getElementById("subb").style.display=v==="browse"?"block":"none";
  document.getElementById("subch").style.display=v==="fav"?"block":"none";
  document.getElementById("subs").style.display=v==="settings"?"block":"none";
  var suba=document.getElementById("suba");if(suba)suba.style.display=v==="audit"?"block":"none";
  var subbr=document.getElementById("subbr");if(subbr)subbr.style.display=v==="brain"?"block":"none";
  var subco=document.getElementById("subco");if(subco)subco.style.display=v==="compare"?"block":"none";
  var subi=document.getElementById("subi");if(subi)subi.style.display=v==="issues"?"block":"none";
  // Reset comparePlats when leaving compare
  if(v!=="compare")comparePlats=[];
  // Auto-select platform from context when switching to platform view
  if(v==="platform"&&practiceCtx.emr&&!activePlat){
    var ctxPlat=resolveCtxPlatform();
    if(ctxPlat){
      activePlat=ctxPlat;
      setTimeout(function(){
        var btns=document.querySelectorAll(".plat-btn");
        for(var i=0;i<btns.length;i++){btns[i].classList.toggle("on",btns[i].getAttribute("data-label")===ctxPlat);}
      },50);
    }
  }
  render();
  if(v==="ask")document.getElementById("ask-inp").focus();
}

function updateSbCtx(){
  var ctx=document.getElementById("sb-ctx-value");
  var uname=document.getElementById("sb-username");
  if(ctx){
    var hasCtx=practiceCtx.name||practiceCtx.emr;
    ctx.textContent=hasCtx?(practiceCtx.name||practiceCtx.emr)+(practiceCtx.name&&practiceCtx.emr?" · "+practiceCtx.emr:""):"Tap to set practice";
    ctx.className=hasCtx?"":"empty";
  }
  if(uname)uname.textContent=settings.name||"ACG";
}
function openCtx(){
  // Trigger the existing context modal
  var ctxBtn=document.getElementById("ctx-edit-btn");
  if(ctxBtn)ctxBtn.click(); else SV("settings");
}
function updateNavSections(){
  // Section buttons
  ["call","knowledge","work"].forEach(function(s){
    var el=document.getElementById("ns-"+s);
    if(el)el.classList.toggle("on",s===navSection&&navSection!=="home");
  });
  // Show/hide tab groups
  // Legacy nav tabs hidden — sidebar drives nav now
  var upc2=brainEntries.filter(function(e){return !e.processed&&e.ts>Date.now()-604800000;}).length;
  var pcb2=document.getElementById("pc-badge");
  if(pcb2){pcb2.style.display=upc2?"":"none";pcb2.textContent=upc2;}
}

// ── EDIT MODAL ──────────────────────────────────────────────
var editCtx=null;
function openEdit(sheet,feature,platform,currentVal,currentNote,currentTake){
  editCtx={sheet:sheet,feature:feature,platform:platform,oldVal:currentVal};
  var ov=getOverride(sheet,feature,platform)||{};
  document.getElementById("eov").style.display="block";
  var mo=document.getElementById("emo");mo.style.display="flex";
  document.getElementById("emtag").textContent=(SL[sheet]||sheet).toUpperCase()+" \u00b7 "+esc(platform);
  document.getElementById("emttl").textContent=feature;
  var bd=document.getElementById("embd");
  var hist=editHistory[overrideKey(sheet,feature,platform)]||[];
  var confKey=sheet+"|"+feature+"|"+platform;
  var currentConf=confidence[confKey]||"unverified";
  var confColors={"verified":"#059669","unverified":"#6B7280","tbd":"#D97706"};
  var histHtml=hist.length?'<div class="em-field"><label class="em-lbl">Version History <span style="font-weight:400;color:var(--text3)">(click to restore)</span></label>'
    +hist.map(function(h,i){
      return'<div style="border:1px solid var(--tan2);border-radius:6px;padding:8px 11px;margin-bottom:6px;cursor:pointer;transition:background .1s" class="hist-row" data-i="'+i+'">'
        +'<div style="font-size:10px;color:var(--text3);margin-bottom:3px">'+timeAgo(h.ts)+(h.by?' · '+esc(h.by):'')+'</div>'
        +(h.val?'<div style="font-size:12px;color:var(--navy);font-weight:600">'+esc(h.val)+'</div>':'' )
        +(h.note?'<div style="font-size:11px;color:var(--text2);margin-top:2px">'+esc(h.note.slice(0,80))+(h.note.length>80?'…':'')+'</div>':'' )
        +(h.acgTake?'<div style="font-size:11px;color:var(--blue);margin-top:2px;font-style:italic">'+esc(h.acgTake.slice(0,80))+(h.acgTake.length>80?'…':'')+'</div>':'' )
        +'</div>';
    }).join("")
    +'</div>':'' ;
  bd.innerHTML='<div class="em-field"><label class="em-lbl">Data Confidence</label>'
    +'<div style="display:flex;gap:8px;margin-bottom:4px">'
    +['verified','unverified','tbd'].map(function(cv){
      return'<button class="conf-btn" data-cv="'+cv+'" style="padding:4px 12px;border-radius:14px;font-size:11px;font-weight:700;border:2px solid;cursor:pointer;font-family:Inter,sans-serif;background:'+(currentConf===cv?confColors[cv]:'transparent')+';border-color:'+confColors[cv]+';color:'+(currentConf===cv?'#fff':confColors[cv])+'">'+cv.toUpperCase()+'</button>';
    }).join("")
    +'</div></div>'
    +'<div class="em-field"><label class="em-lbl">Status / Value</label>'
    +'<input id="em-val" class="em-inp" type="text" value="'+esc(ov.val||currentVal||"")+'" placeholder="Yes / No / Partial / TBD...">'
    +(currentVal&&(ov.val||currentVal)!==currentVal?'<div class="em-old">Original: '+esc(String(currentVal))+'</div>':"")
    +'</div>'
    +'<div class="em-field"><label class="em-lbl">ACG Detail Note</label>'
    +'<textarea id="em-note" class="em-ta" placeholder="Your notes from calls, demos, or client experience...">'+esc(ov.note||currentNote||"")+'</textarea></div>'
    +'<div class="em-field"><label class="em-lbl">ACG Take <span style="font-weight:400;color:var(--text3)">(your recommendation)</span></label>'
    +'<textarea id="em-take" class="em-ta" placeholder="e.g. Recommend for high-volume injector practices. Verify lot tracking before committing.">'+esc(ov.acgTake||currentTake||"")+'</textarea></div>'
    +'<div class="em-field"><label class="em-lbl">Screenshot / Reference Link</label>'
    +'<input id="em-screenshot" class="em-inp" type="text" value="'+esc(ov.screenshot||"")+'" placeholder="Paste SharePoint, OneDrive, or any image URL...">'
    +'</div><div class="fg"><label class="fl">Video Recording URL <span style="font-weight:400;color:var(--text3);font-size:10px">(Loom, SharePoint, Teams)</span></label>'
    +'<input id="em-video" class="em-inp" type="text" value="'+esc(ov.video||"")+'" placeholder="Paste video recording URL...">'
    +(ov.screenshot?'<div style="margin-top:6px"><img src="'+esc(ov.screenshot)+'" style="max-width:100%;max-height:160px;border-radius:6px;border:1px solid var(--tan2)" onerror="this.style.display=\'none\'"><a href="'+esc(ov.screenshot)+'" target="_blank" style="font-size:11px;color:var(--blue);display:block;margin-top:4px">Open link ↗</a></div>':'' )
    +'</div>'
    +'<div class="em-field"><label class="em-lbl">Verified By / Source</label>'
    +'<input id="em-verified" class="em-inp" type="text" value="'+esc(ov.verifiedBy||"")+'" placeholder="e.g. Confirmed on vendor demo 6/15, or Client reported..."></div>'
    +'<div class="em-field"><label class="em-lbl">Reason for change <span style="font-weight:400;color:var(--text3)">(optional)</span></label>'
    +'<input id="em-reason" class="em-inp" type="text" value="" placeholder="e.g. Updated after ModMed demo call"></div>'
    +histHtml
    +'<button id="em-save" class="em-save">Save Changes</button>';
  // Confidence buttons
  var selectedConf=currentConf;
  bd.querySelectorAll(".conf-btn").forEach(function(btn){
    btn.addEventListener("click",function(){
      selectedConf=btn.getAttribute("data-cv");
      bd.querySelectorAll(".conf-btn").forEach(function(b){
        var cv2=b.getAttribute("data-cv");
        b.style.background=cv2===selectedConf?confColors[cv2]:"transparent";
        b.style.color=cv2===selectedConf?"#fff":confColors[cv2];
      });
    });
  });
  // History restore
  bd.querySelectorAll(".hist-row").forEach(function(row){
    row.addEventListener("mouseenter",function(){row.style.background="var(--cream)";});
    row.addEventListener("mouseleave",function(){row.style.background="";});
    row.addEventListener("click",function(){
      var i=parseInt(row.getAttribute("data-i"));
      var h=hist[i];
      if(h.val)document.getElementById("em-val").value=h.val;
      if(h.note)document.getElementById("em-note").value=h.note;
      if(h.acgTake)document.getElementById("em-take").value=h.acgTake;
      row.style.background="var(--green-bg)";
      setTimeout(function(){row.style.background="";},800);
    });
  });
  document.getElementById("em-save").addEventListener("click",function(){
    var val=document.getElementById("em-val").value.trim();
    var note=document.getElementById("em-note").value.trim();
    var take=document.getElementById("em-take").value.trim();
    var verified=document.getElementById("em-verified").value.trim();
    var reason=document.getElementById("em-reason").value.trim();
    var screenshot=document.getElementById("em-screenshot")?document.getElementById("em-screenshot").value.trim():"";
    // Save confidence
    var confKey2=sheet+"|"+feature+"|"+platform;
    confidence[confKey2]=selectedConf;
    save(SK+"_conf",confidence);
    var video=document.getElementById("em-video")?document.getElementById("em-video").value.trim():"";
    setOverride(sheet,feature,platform,{val:val||undefined,note:note||undefined,acgTake:take||undefined,verifiedBy:verified||undefined,verifiedDate:Date.now(),screenshot:screenshot||undefined,video:video||undefined},currentVal,reason);
    var btn=document.getElementById("em-save");if(btn){btn.textContent="\u2713 Saved";btn.classList.add("sv");}
    render();
  });
}
function closeEdit(){document.getElementById("eov").style.display="none";document.getElementById("emo").style.display="none";}

// ── PRACTICE CONTEXT MODAL ──────────────────────────────────
function openCtx(){
  document.getElementById("pov").style.display="block";
  document.getElementById("pmo").style.display="block";
  var bd=document.getElementById("pmbd");
  bd.innerHTML='<div class="fg" style="margin-bottom:12px"><label class="fl">Practice Name</label>'
    +'<input id="pc-name" class="fi" type="text" value="'+esc(practiceCtx.name||"")+'" placeholder="e.g. Aesthetics at Oak Park"></div>'
    +'<div class="fg" style="margin-bottom:12px"><label class="fl">Current EMR</label>'
    +'<input id="pc-emr" class="fi" type="text" value="'+esc(practiceCtx.emr||"")+'" placeholder="e.g. 4D, Nextech, none"></div>'
    +'<div class="fg" style="margin-bottom:12px"><label class="fl">Practice Size / Type</label>'
    +'<input id="pc-size" class="fi" type="text" value="'+esc(practiceCtx.size||"")+'" placeholder="e.g. Solo surgeon, 3-provider medspa"></div>'
    +'<div class="fg" style="margin-bottom:16px"><label class="fl">Call Notes / Pain Points</label>'
    +'<textarea id="pc-notes" class="em-ta" placeholder="What are they looking for? What pain points came up?">'+esc(practiceCtx.notes||"")+'</textarea></div>'
    +'<div style="display:flex;gap:8px">'
    +'<button id="pc-save" style="flex:1;padding:11px;border-radius:8px;border:none;background:var(--navy);color:#fff;font-size:14px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif">Set Context</button>'
    +'<button id="pc-clear" style="padding:11px 16px;border-radius:8px;border:1px solid var(--tan2);background:transparent;font-size:13px;cursor:pointer;font-family:Inter,sans-serif;color:var(--text2)">Clear</button>'
    +'</div>';
  document.getElementById("pc-save").addEventListener("click",function(){
    practiceCtx={name:document.getElementById("pc-name").value.trim(),emr:document.getElementById("pc-emr").value.trim(),size:document.getElementById("pc-size").value.trim(),notes:document.getElementById("pc-notes").value.trim()};
    save(SK+"_ctx",practiceCtx);
    // Reload scratch pad for new practice
    var st2=document.getElementById("scratch-text");
    if(st2){st2.dataset.loaded="";updateScratchPad();}
    // Auto-select platform when context EMR is set
    var cp=resolveCtxPlatform();
    if(cp){
      activePlat=cp;
      var btns=document.querySelectorAll(".plat-btn");
      for(var i=0;i<btns.length;i++){btns[i].classList.toggle("on",btns[i].getAttribute("data-label")===cp);}
    }
    updateCtxBar();closeCtx();
    render();
  });
  document.getElementById("pc-clear").addEventListener("click",function(){
    practiceCtx={name:"",emr:"",size:"",notes:""};save(SK+"_ctx",practiceCtx);updateCtxBar();closeCtx();
  });
}
function closeCtx(){document.getElementById("pov").style.display="none";document.getElementById("pmo").style.display="none";}
