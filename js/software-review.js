// ── SOFTWARE REVIEW MODE ──────────────────────────────────────────────────────
function rSWRHome(body){ rAuditHome(body); } // Home is shared

function rSWRIntake(body){
  var emrOpts=["4D","Nextech w/ P+","Nextech Cloud","Symplast","ModMed","AestheticsPro","Podium AI OS"];
  var h='<div style="max-width:800px;margin:0 auto;padding:16px">';
  h+='<button id="swr-back" style="background:none;border:none;color:var(--navy);font-size:12px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif;padding:0;margin-bottom:14px">\u2190 Back</button>';
  h+='<div style="background:#fff;border:1px solid var(--tan2);border-radius:12px;padding:22px">';
  h+='<h2 style="font-family:Playfair Display,serif;font-size:18px;color:var(--navy);margin:0 0 18px">Software Review</h2>';
  h+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">';
  h+='<div style="grid-column:span 2"><label style="font-size:10px;font-weight:700;color:var(--navy);display:block;margin-bottom:3px;text-transform:uppercase;letter-spacing:.4px">Practice Name *</label>';
  h+='<input id="swr-name" type="text" value="'+esc(swReviewData.name||"")+'" placeholder="e.g. Kirby Plastic Surgery" style="width:100%;padding:8px 11px;border:1px solid var(--tan2);border-radius:6px;font-size:13px;font-family:Inter,sans-serif;color:var(--navy);box-sizing:border-box"></div>';
  h+='<div style="grid-column:span 2"><label style="font-size:10px;font-weight:700;color:var(--navy);display:block;margin-bottom:3px;text-transform:uppercase;letter-spacing:.4px">Platform *</label>';
  h+='<select id="swr-emr" style="width:100%;padding:8px 11px;border:1px solid var(--tan2);border-radius:6px;font-size:13px;font-family:Inter,sans-serif;color:var(--navy)">';
  emrOpts.forEach(function(o){
    var tpl=SOFTWARE_REVIEW_TEMPLATES[o];
    h+='<option value="'+esc(o)+'"'+(o===swReviewData.emr?' selected':'')+'>'+esc(o)+(tpl&&!tpl.ready?' \u26a0 (data exercise pending)':'')+'</option>';
  });
  h+='</select></div></div>';
  h+='<div style="margin-bottom:18px"><label style="font-size:10px;font-weight:700;color:var(--navy);display:block;margin-bottom:4px;text-transform:uppercase;letter-spacing:.4px">Consultant Notes (paste from Loop, Teams, or your own notes)</label>';
  h+='<textarea id="swr-notes" style="width:100%;height:120px;padding:8px 11px;border:1px solid var(--tan2);border-radius:6px;font-size:12px;font-family:Inter,sans-serif;color:var(--navy);resize:vertical;box-sizing:border-box" placeholder="Paste notes from your pre-call Loop page, Teams, or any prep notes here...">'+esc(swReviewData.notes||"")+'</textarea></div>';
  h+='<button id="swr-start" style="background:var(--navy);color:#fff;border:none;border-radius:8px;padding:10px 22px;font-size:13px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif">Start Review \u2192</button>';
  h+='</div></div>';
  body.innerHTML=h;

  document.getElementById("swr-back").addEventListener("click",function(){swReviewStep=0;auditMode="full";render();});
  document.getElementById("swr-start").addEventListener("click",function(){
    var name=document.getElementById("swr-name").value.trim();
    if(!name){alert("Practice name is required.");return;}
    swReviewData.name=name;
    swReviewData.emr=document.getElementById("swr-emr").value;
    swReviewData.notes=document.getElementById("swr-notes").value.trim();
    if(!swReviewData.checklist)swReviewData.checklist={};
    softwareReviews[swReviewData.id]=JSON.parse(JSON.stringify(swReviewData));
    save(SK+"_swreviews",softwareReviews);
    swReviewStep=2;render();
  });
}

function rSWRChecklist(body){
  var tpl=SOFTWARE_REVIEW_TEMPLATES[swReviewData.emr]||SOFTWARE_REVIEW_TEMPLATES["4D"];
  var cl=swReviewData.checklist||{};

  var h='<div style="max-width:900px;margin:0 auto;padding:16px">';
  h+='<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">';
  h+='<div><h2 style="font-family:Playfair Display,serif;font-size:20px;color:var(--navy);margin:0">'+esc(swReviewData.name)+'</h2>';
  h+='<p style="font-size:11px;color:var(--text3);margin:3px 0 0">'+esc(swReviewData.emr)+' \u00b7 Software Review</p></div>';
  h+='<div style="display:flex;gap:8px">';
  h+='<button id="swr-save" style="background:none;border:1.5px solid var(--tan2);color:var(--navy);border-radius:8px;padding:8px 14px;font-size:12px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif">Save</button>';
  h+='<button id="swr-report-btn" style="background:var(--gold);color:var(--navy);border:none;border-radius:8px;padding:8px 14px;font-size:12px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif">Generate Report \u2192</button>';
  h+='</div></div>';

  if(swReviewData.notes){
    h+='<div style="background:#fff;border:1px solid var(--tan2);border-radius:10px;padding:14px;margin-bottom:12px">';
    h+='<div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">Consultant Notes</div>';
    h+='<div style="font-size:12px;color:var(--text2);white-space:pre-wrap;line-height:1.6">'+esc(swReviewData.notes)+'</div></div>';
  }

  // What's Working
  h+='<div style="background:#fff;border:1px solid var(--tan2);border-radius:12px;margin-bottom:10px;overflow:hidden">';
  h+='<div style="padding:12px 16px;background:var(--navy)">';
  h+='<div style="font-size:13px;font-weight:700;color:#fff">\u2705 What\'s Configured Well</div>';
  h+='<div style="font-size:11px;color:rgba(255,255,255,.5);margin-top:2px">Check items that are in place and working correctly</div></div>';
  h+='<div style="padding:12px 16px">';
  tpl.workingItems.forEach(function(item,i){
    var checked=cl["working"]&&cl["working"][i];
    h+='<label style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--tan);cursor:pointer">';
    h+='<input type="checkbox" class="swr-working" data-idx="'+i+'" '+(checked?"checked":"")+' style="margin:0">';
    h+='<span style="font-size:12px;color:var(--navy)">'+esc(item)+'</span></label>';
  });
  h+='</div></div>';

  // Gaps
  h+='<div style="background:#fff;border:1px solid var(--tan2);border-radius:12px;margin-bottom:10px;overflow:hidden">';
  h+='<div style="padding:12px 16px;background:#FFF5F5;border-bottom:1px solid #FEE2E2">';
  h+='<div style="font-size:13px;font-weight:700;color:#DC2626">\u26a0\ufe0f Configuration Gaps</div>';
  h+='<div style="font-size:11px;color:#ef4444;margin-top:2px">Document current state and recommended action for each gap found</div></div>';
  h+='<div style="padding:12px 16px">';
  tpl.gapItems.forEach(function(item){
    var itemData=cl["gaps"]&&cl["gaps"][item.id]||{};
    h+='<div style="padding:12px 0;border-bottom:1px solid var(--tan)">';
    h+='<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">';
    h+='<input type="checkbox" class="swr-gap-active" data-id="'+esc(item.id)+'" '+(itemData.active?"checked":"")+' style="margin:0">';
    h+='<span style="font-size:12px;font-weight:700;color:var(--navy)">'+esc(item.label)+'</span></div>';
    h+='<div style="font-size:11px;color:var(--text3);margin-bottom:8px;padding-left:20px">'+esc(item.desc)+'</div>';
    if(itemData.active){
      h+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;padding-left:20px">';
      h+='<div><label style="font-size:9px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;display:block;margin-bottom:3px">Current State</label>';
      h+='<textarea class="swr-gap-state" data-id="'+esc(item.id)+'" rows="2" style="width:100%;padding:6px 8px;border:1px solid var(--tan2);border-radius:5px;font-size:11px;font-family:Inter,sans-serif;resize:vertical;box-sizing:border-box">'+esc(itemData.currentState||"")+'</textarea></div>';
      h+='<div><label style="font-size:9px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;display:block;margin-bottom:3px">Recommended Action</label>';
      h+='<textarea class="swr-gap-rec" data-id="'+esc(item.id)+'" rows="2" style="width:100%;padding:6px 8px;border:1px solid var(--tan2);border-radius:5px;font-size:11px;font-family:Inter,sans-serif;resize:vertical;box-sizing:border-box">'+esc(itemData.recommendation||"")+'</textarea></div>';
      h+='</div>';
    }
    h+='</div>';
  });
  h+='</div></div>';

  // OPM section (if applicable)
  if(tpl.opmItems&&tpl.opmItems.length){
    h+='<div style="background:#fff;border:1px solid var(--tan2);border-radius:12px;margin-bottom:10px;overflow:hidden">';
    h+='<div style="padding:12px 16px;background:#EFF6FF;border-bottom:1px solid #DBEAFE">';
    h+='<div style="font-size:13px;font-weight:700;color:#1D4ED8">\ud83d\udcca OPM Database Review</div>';
    h+='<div style="font-size:11px;color:#3B82F6;margin-top:2px">Via Practice Analysis \u2192 Go Box IA</div></div>';
    h+='<div style="padding:12px 16px">';
    tpl.opmItems.forEach(function(item){
      var itemData=cl["opm"]&&cl["opm"][item.id]||{};
      h+='<div style="padding:10px 0;border-bottom:1px solid var(--tan)">';
      h+='<div style="font-size:12px;font-weight:700;color:var(--navy);margin-bottom:4px">'+esc(item.label)+'</div>';
      h+='<div style="font-size:11px;color:var(--text3);margin-bottom:6px">'+esc(item.desc)+'</div>';
      h+='<div style="display:grid;grid-template-columns:120px 1fr;gap:8px;align-items:center">';
      h+='<select class="swr-opm-status" data-id="'+esc(item.id)+'" style="padding:5px 8px;border:1px solid var(--tan2);border-radius:5px;font-size:12px;font-family:Inter,sans-serif">';
      [["","— Status —"],["\ud83d\udfe2","🟢 Good"],["\ud83d\udfe1","🟡 Watch"],["\ud83d\udd34","🔴 Red Flag"]].forEach(function(o){
        h+='<option value="'+o[0]+'"'+(itemData.status===o[0]?" selected":"")+'>'+o[1]+'</option>';
      });
      h+='</select>';
      h+='<textarea class="swr-opm-notes" data-id="'+esc(item.id)+'" rows="2" placeholder="Findings and notes..." style="width:100%;padding:6px 8px;border:1px solid var(--tan2);border-radius:5px;font-size:11px;font-family:Inter,sans-serif;resize:vertical;box-sizing:border-box">'+esc(itemData.notes||"")+'</textarea>';
      h+='</div></div>';
    });
    h+='</div></div>';
  }

  // Reports section
  if(tpl.reports&&(tpl.reports.daily.length||tpl.reports.weekly.length||tpl.reports.monthly.length)){
    h+='<div style="background:#fff;border:1px solid var(--tan2);border-radius:12px;margin-bottom:10px;overflow:hidden">';
    h+='<div style="padding:12px 16px;background:#F0FDF4;border-bottom:1px solid #BBF7D0">';
    h+='<div style="font-size:13px;font-weight:700;color:#15803D">\ud83d\udcc8 Recommended Reports</div></div>';
    h+='<div style="padding:12px 16px">';
    [["daily","Daily",tpl.reports.daily],["weekly","Weekly",tpl.reports.weekly],["monthly","Monthly",tpl.reports.monthly]].forEach(function(freq){
      if(!freq[2].length)return;
      h+='<div style="font-size:10px;font-weight:700;color:var(--gold);text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px;margin-top:12px">'+freq[1]+'</div>';
      freq[2].forEach(function(rpt){
        var rptData=cl["reports"]&&cl["reports"][freq[0]+"_"+rpt]||{};
        h+='<div style="padding:8px 0;border-bottom:1px solid var(--tan)">';
        h+='<div style="font-size:12px;font-weight:700;color:var(--navy);margin-bottom:4px">\u2192 '+esc(rpt)+'</div>';
        h+='<div><label style="font-size:9px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;display:block;margin-bottom:2px">How to access:</label>';
        h+='<textarea class="swr-rpt-notes" data-freq="'+freq[0]+'" data-rpt="'+esc(rpt)+'" rows="2" placeholder="Add access instructions here during onsite..." style="width:100%;padding:5px 8px;border:1px solid var(--tan2);border-radius:5px;font-size:11px;font-family:Inter,sans-serif;resize:vertical;box-sizing:border-box">'+esc(rptData.notes||"")+'</textarea></div></div>';
      });
    });
    h+='</div></div>';
  }

  // Known Platform Issues
  if(tpl.platformIssues&&tpl.platformIssues.length){
    h+='<div style="background:#fff;border:1px solid var(--tan2);border-radius:12px;margin-bottom:10px;overflow:hidden">';
    h+='<div style="padding:12px 16px;background:#F8FAFC;border-bottom:1px solid var(--tan2)">';
    h+='<div style="font-size:13px;font-weight:700;color:var(--navy)">\ud83d\udd35 Known Platform Issues</div>';
    h+='<div style="font-size:11px;color:var(--text3);margin-top:2px">In development — not configuration gaps</div></div>';
    h+='<div style="padding:12px 16px">';
    tpl.platformIssues.forEach(function(issue){
      h+='<div style="font-size:12px;color:var(--text2);padding:6px 0;border-bottom:1px solid var(--tan)">\u2192 '+esc(issue)+'</div>';
    });
    h+='</div></div>';
  }

  // Onsite Questions
  if(tpl.onsiteQuestions&&tpl.onsiteQuestions.length){
    h+='<div style="background:#fff;border:1px solid var(--tan2);border-radius:12px;margin-bottom:10px;overflow:hidden">';
    h+='<div style="padding:12px 16px;background:#FDF6E3;border-bottom:1px solid var(--tan2)">';
    h+='<div style="font-size:13px;font-weight:700;color:var(--navy)">\u2753 Questions for the Onsite Visit</div></div>';
    h+='<div style="padding:12px 16px">';
    var swrCl=cl["onsiteQ"]||{};
    tpl.onsiteQuestions.forEach(function(q,i){
      h+='<div style="padding:8px 0;border-bottom:1px solid var(--tan)">';
      h+='<div style="font-size:12px;color:var(--navy);font-weight:600;margin-bottom:4px">'+(i+1)+'. '+esc(q)+'</div>';
      h+='<textarea class="swr-onsite-q" data-idx="'+i+'" rows="2" placeholder="Notes from the visit..." style="width:100%;padding:5px 8px;border:1px solid var(--tan2);border-radius:5px;font-size:11px;font-family:Inter,sans-serif;resize:vertical;box-sizing:border-box">'+esc(swrCl[i]||"")+'</textarea></div>';
    });
    h+='</div></div>';
  }

  h+='<div style="display:flex;gap:10px;margin-bottom:40px">';
  h+='<button id="swr-save2" style="flex:1;padding:12px;border-radius:8px;border:1.5px solid var(--navy);background:none;color:var(--navy);font-size:13px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif">Save Progress</button>';
  h+='<button id="swr-report2" style="flex:1;padding:12px;border-radius:8px;border:none;background:var(--gold);color:var(--navy);font-size:13px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif">Generate Report \u2192</button>';
  h+='</div></div>';
  body.innerHTML=h;

  function saveSWR(){
    softwareReviews[swReviewData.id]=JSON.parse(JSON.stringify(swReviewData));
    save(SK+"_swreviews",softwareReviews);
  }

  // Working checkboxes
  body.querySelectorAll(".swr-working").forEach(function(cb){
    cb.addEventListener("change",function(){
      if(!swReviewData.checklist.working)swReviewData.checklist.working={};
      swReviewData.checklist.working[cb.dataset.idx]=cb.checked;
      saveSWR();
    });
  });

  // Gap checkboxes
  body.querySelectorAll(".swr-gap-active").forEach(function(cb){
    cb.addEventListener("change",function(){
      if(!swReviewData.checklist.gaps)swReviewData.checklist.gaps={};
      if(!swReviewData.checklist.gaps[cb.dataset.id])swReviewData.checklist.gaps[cb.dataset.id]={};
      swReviewData.checklist.gaps[cb.dataset.id].active=cb.checked;
      saveSWR();render();
    });
  });
  body.querySelectorAll(".swr-gap-state").forEach(function(ta){
    ta.addEventListener("blur",function(){
      if(!swReviewData.checklist.gaps)swReviewData.checklist.gaps={};
      if(!swReviewData.checklist.gaps[ta.dataset.id])swReviewData.checklist.gaps[ta.dataset.id]={};
      swReviewData.checklist.gaps[ta.dataset.id].currentState=ta.value.trim();
      saveSWR();
    });
  });
  body.querySelectorAll(".swr-gap-rec").forEach(function(ta){
    ta.addEventListener("blur",function(){
      if(!swReviewData.checklist.gaps)swReviewData.checklist.gaps={};
      if(!swReviewData.checklist.gaps[ta.dataset.id])swReviewData.checklist.gaps[ta.dataset.id]={};
      swReviewData.checklist.gaps[ta.dataset.id].recommendation=ta.value.trim();
      saveSWR();
    });
  });

  // OPM
  body.querySelectorAll(".swr-opm-status").forEach(function(sel){
    sel.addEventListener("change",function(){
      if(!swReviewData.checklist.opm)swReviewData.checklist.opm={};
      if(!swReviewData.checklist.opm[sel.dataset.id])swReviewData.checklist.opm[sel.dataset.id]={};
      swReviewData.checklist.opm[sel.dataset.id].status=sel.value;
      saveSWR();
    });
  });
  body.querySelectorAll(".swr-opm-notes").forEach(function(ta){
    ta.addEventListener("blur",function(){
      if(!swReviewData.checklist.opm)swReviewData.checklist.opm={};
      if(!swReviewData.checklist.opm[ta.dataset.id])swReviewData.checklist.opm[ta.dataset.id]={};
      swReviewData.checklist.opm[ta.dataset.id].notes=ta.value.trim();
      saveSWR();
    });
  });

  // Reports
  body.querySelectorAll(".swr-rpt-notes").forEach(function(ta){
    ta.addEventListener("blur",function(){
      var key=ta.dataset.freq+"_"+ta.dataset.rpt;
      if(!swReviewData.checklist.reports)swReviewData.checklist.reports={};
      if(!swReviewData.checklist.reports[key])swReviewData.checklist.reports[key]={};
      swReviewData.checklist.reports[key].notes=ta.value.trim();
      saveSWR();
    });
  });

  // Onsite questions
  body.querySelectorAll(".swr-onsite-q").forEach(function(ta){
    ta.addEventListener("blur",function(){
      if(!swReviewData.checklist.onsiteQ)swReviewData.checklist.onsiteQ={};
      swReviewData.checklist.onsiteQ[ta.dataset.idx]=ta.value.trim();
      saveSWR();
    });
  });

  // Save / report buttons
  ["swr-save","swr-save2"].forEach(function(id){
    var btn=document.getElementById(id);
    if(btn)btn.addEventListener("click",function(){saveSWR();btn.textContent="\u2713 Saved";setTimeout(function(){btn.textContent="Save";},2000);});
  });
  ["swr-report-btn","swr-report2"].forEach(function(id){
    var btn=document.getElementById(id);
    if(btn)btn.addEventListener("click",function(){saveSWR();swReviewStep=3;render();});
  });
}

function rSWRReport(body){
  var tpl=SOFTWARE_REVIEW_TEMPLATES[swReviewData.emr]||SOFTWARE_REVIEW_TEMPLATES["4D"];
  var cl=swReviewData.checklist||{};
  var workingItems=tpl.workingItems.filter(function(item,i){return cl.working&&cl.working[i];});
  var gapItems=tpl.gapItems.filter(function(item){return cl.gaps&&cl.gaps[item.id]&&cl.gaps[item.id].active;});

  var h='<div style="max-width:860px;margin:0 auto;padding:16px">';
  h+='<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">';
  h+='<button id="swr-back-checklist" style="background:none;border:none;color:var(--navy);font-size:12px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif;padding:0">\u2190 Back</button>';
  h+='<button id="swr-gen-doc" style="background:var(--navy);color:#fff;border:none;border-radius:8px;padding:9px 16px;font-size:12px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif">\u2193 Export Word Doc</button></div>';

  // Preview
  h+='<div style="background:#fff;border:1px solid var(--tan2);border-radius:12px;overflow:hidden;margin-bottom:16px">';
  h+='<div style="background:var(--navy);padding:24px 28px">';
  h+='<div style="font-size:10px;font-weight:700;color:var(--gold);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">ACG Practice Partners \u2014 '+esc(swReviewData.emr)+' Systems Review</div>';
  h+='<div style="font-family:Playfair Display,serif;font-size:24px;color:#fff;margin-bottom:6px">'+esc(swReviewData.name)+'</div>';
  h+='<div style="font-size:12px;color:rgba(255,255,255,.5)">Pre-Onsite Technology Assessment \u00b7 '+new Date().toLocaleDateString()+' \u00b7 ACG Practice Partners</div></div>';

  // Summary counts
  h+='<div style="padding:16px 28px;border-bottom:1px solid var(--tan2)">';
  h+='<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px">';
  h+='<div style="background:#D1FAE5;border-radius:8px;padding:12px;text-align:center"><div style="font-size:24px;font-weight:800;color:#059669">'+workingItems.length+'</div><div style="font-size:11px;font-weight:700;color:#059669">Configured Well</div></div>';
  h+='<div style="background:#FEE2E2;border-radius:8px;padding:12px;text-align:center"><div style="font-size:24px;font-weight:800;color:#DC2626">'+gapItems.length+'</div><div style="font-size:11px;font-weight:700;color:#DC2626">Gaps Found</div></div>';
  h+='<div style="background:#DBEAFE;border-radius:8px;padding:12px;text-align:center"><div style="font-size:24px;font-weight:800;color:#1D4ED8">'+(tpl.onsiteQuestions?tpl.onsiteQuestions.length:0)+'</div><div style="font-size:11px;font-weight:700;color:#1D4ED8">Onsite Questions</div></div>';
  h+='</div></div>';

  if(swReviewData.notes){
    h+='<div style="padding:14px 28px;border-bottom:1px solid var(--tan2)">';
    h+='<div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">Consultant Notes</div>';
    h+='<div style="font-size:12px;color:var(--text2);white-space:pre-wrap;line-height:1.6">'+esc(swReviewData.notes)+'</div></div>';
  }

  if(workingItems.length){
    h+='<div style="padding:16px 28px;border-bottom:1px solid var(--tan2)">';
    h+='<div style="font-size:10px;font-weight:800;color:var(--text3);text-transform:uppercase;letter-spacing:.8px;margin-bottom:10px">\u2705 What\'s Configured Well</div>';
    workingItems.forEach(function(item){
      h+='<div style="font-size:12px;color:#059669;padding:4px 0">\u2713 '+esc(item)+'</div>';
    });
    h+='</div>';
  }

  if(gapItems.length){
    h+='<div style="padding:16px 28px;border-bottom:1px solid var(--tan2)">';
    h+='<div style="font-size:10px;font-weight:800;color:var(--text3);text-transform:uppercase;letter-spacing:.8px;margin-bottom:10px">\u26a0\ufe0f Gaps & Recommended Actions</div>';
    gapItems.forEach(function(item){
      var d=cl.gaps&&cl.gaps[item.id]||{};
      h+='<div style="background:#FFF5F5;border-left:3px solid #DC2626;border-radius:0 8px 8px 0;padding:12px 14px;margin-bottom:8px">';
      h+='<div style="font-size:12px;font-weight:700;color:var(--navy);margin-bottom:4px">'+esc(item.label)+'</div>';
      if(d.currentState)h+='<div style="font-size:11px;color:var(--text2);margin-bottom:3px"><strong>Current state:</strong> '+esc(d.currentState)+'</div>';
      if(d.recommendation)h+='<div style="font-size:11px;color:var(--text2)"><strong>Recommended action:</strong> '+esc(d.recommendation)+'</div>';
      h+='</div>';
    });
    h+='</div>';
  }

  h+='<div style="padding:14px 28px;text-align:center"><div style="font-size:10px;color:var(--text3)">Confidential \u00b7 ACG Practice Partners \u00b7 Internal Use Only</div></div>';
  h+='</div></div>';
  body.innerHTML=h;

  document.getElementById("swr-back-checklist").addEventListener("click",function(){swReviewStep=2;render();});
  document.getElementById("swr-gen-doc").addEventListener("click",function(){generateSWRDoc(tpl,cl,workingItems,gapItems);});
}

function generateSWRDoc(tpl,cl,workingItems,gapItems){
  var win=window.open("","_blank");
  if(!win){alert("Allow pop-ups to generate document.");return;}
  var css='@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Playfair+Display:wght@600&display=swap");*{box-sizing:border-box;margin:0;padding:0}body{font-family:Inter,sans-serif;color:#1c2b3a;font-size:12px;line-height:1.6;background:#fff}.page{max-width:760px;margin:0 auto;padding:40px}.cover{background:#1c2b3a;border-radius:12px;padding:32px;margin-bottom:28px}.cover-tag{font-size:9px;font-weight:700;color:#c9a84c;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:10px}.cover-title{font-family:"Playfair Display",serif;font-size:26px;color:#fff;margin-bottom:6px}.cover-sub{font-size:12px;color:rgba(255,255,255,.5)}.section-hdr{font-size:9px;font-weight:800;color:#888;text-transform:uppercase;letter-spacing:1px;margin:22px 0 10px;padding-bottom:5px;border-bottom:1px solid #e5dcc8}.check-item{font-size:12px;color:#059669;padding:3px 0}.gap-card{border-left:3px solid #dc2626;background:#fff5f5;border-radius:0 8px 8px 0;padding:12px 14px;margin-bottom:8px}.gap-title{font-size:12px;font-weight:700;color:#1c2b3a;margin-bottom:4px}.gap-state{font-size:11px;color:#555;margin-bottom:3px}.gap-rec{font-size:11px;color:#555}.opm-row{display:grid;grid-template-columns:180px 60px 1fr;gap:8px;padding:8px 0;border-bottom:1px solid #e5dcc8;font-size:11px}.rpt-item{padding:8px 0;border-bottom:1px solid #e5dcc8}.rpt-name{font-size:12px;font-weight:700;color:#1c2b3a;margin-bottom:4px}.rpt-how{font-size:11px;color:#555}.q-item{padding:8px 0;border-bottom:1px solid #e5dcc8}.q-text{font-size:12px;font-weight:600;color:#1c2b3a;margin-bottom:4px}.q-notes{font-size:11px;color:#555;min-height:20px}.footer{margin-top:40px;padding-top:14px;border-top:1px solid #e5dcc8;font-size:9px;color:#aaa;display:flex;justify-content:space-between}.no-print{position:fixed;bottom:20px;right:20px}@media print{.no-print{display:none}.cover,.gap-card{-webkit-print-color-adjust:exact;print-color-adjust:exact}}';
  win.document.write('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>'+esc(swReviewData.name)+' \u2014 Software Review</title><style>'+css+'</style></head><body><div class="page">');
  win.document.write('<div class="cover"><div class="cover-tag">ACG Practice Partners \u2014 '+esc(swReviewData.emr)+' Systems Review</div>');
  win.document.write('<div class="cover-title">'+esc(swReviewData.name)+'</div>');
  win.document.write('<div class="cover-sub">Pre-Onsite Technology Assessment \u00b7 '+new Date().toLocaleDateString()+' \u00b7 ACG Practice Partners</div></div>');

  if(swReviewData.notes){
    win.document.write('<div class="section-hdr">Consultant Notes</div>');
    win.document.write('<p style="font-size:12px;color:#555;white-space:pre-wrap;margin-bottom:12px">'+esc(swReviewData.notes)+'</p>');
  }
  if(workingItems.length){
    win.document.write('<div class="section-hdr">\u2705 What\'s Configured Well</div>');
    workingItems.forEach(function(item){win.document.write('<div class="check-item">\u2713 '+esc(item)+'</div>');});
  }
  if(gapItems.length){
    win.document.write('<div class="section-hdr">\u26a0\ufe0f Configuration Gaps & Recommended Actions</div>');
    gapItems.forEach(function(item){
      var d=cl.gaps&&cl.gaps[item.id]||{};
      win.document.write('<div class="gap-card"><div class="gap-title">'+esc(item.label)+'</div>');
      if(d.currentState)win.document.write('<div class="gap-state"><strong>Current state:</strong> '+esc(d.currentState)+'</div>');
      if(d.recommendation)win.document.write('<div class="gap-rec"><strong>Recommended action:</strong> '+esc(d.recommendation)+'</div>');
      win.document.write('</div>');
    });
  }
  if(tpl.opmItems&&tpl.opmItems.length){
    win.document.write('<div class="section-hdr">\ud83d\udcca OPM Database Review</div>');
    win.document.write('<div style="display:grid;grid-template-columns:180px 60px 1fr;gap:8px;font-size:9px;font-weight:700;color:#888;text-transform:uppercase;padding-bottom:4px;border-bottom:1px solid #e5dcc8">Item / Status / Findings</div>');
    tpl.opmItems.forEach(function(item){
      var d=cl.opm&&cl.opm[item.id]||{};
      win.document.write('<div class="opm-row"><div style="font-weight:700">'+esc(item.label)+'</div><div>'+(d.status||'\u2014')+'</div><div>'+esc(d.notes||"Add findings here")+'</div></div>');
    });
    // Statement automation
    win.document.write('<div style="margin-top:12px;padding:10px;background:#FDF6E3;border-left:3px solid #c9a84c;border-radius:0 6px 6px 0"><div style="font-size:11px;font-weight:700;color:#1c2b3a;margin-bottom:3px">Statement Automation Opportunity</div><div style="font-size:11px;color:#555">Statements can be automated through OPM. How to set up: _______________________________________________</div></div>');
  }
  if(tpl.reports){
    win.document.write('<div class="section-hdr">\ud83d\udcc8 Recommended Reports</div>');
    [["daily","Daily",tpl.reports.daily],["weekly","Weekly",tpl.reports.weekly],["monthly","Monthly",tpl.reports.monthly]].forEach(function(freq){
      if(!freq[2].length)return;
      win.document.write('<div style="font-size:9px;font-weight:700;color:#c9a84c;text-transform:uppercase;margin:10px 0 4px">'+freq[1]+'</div>');
      freq[2].forEach(function(rpt){
        var key=freq[0]+"_"+rpt;
        var d=cl.reports&&cl.reports[key]||{};
        win.document.write('<div class="rpt-item"><div class="rpt-name">\u2192 '+esc(rpt)+'</div><div class="rpt-how">How to access: '+esc(d.notes||"_______________________________________________")+'</div></div>');
      });
    });
  }
  if(tpl.platformIssues&&tpl.platformIssues.length){
    win.document.write('<div class="section-hdr">\ud83d\udd35 Known Platform Issues \u2014 In Development</div>');
    tpl.platformIssues.forEach(function(issue){win.document.write('<div style="font-size:11px;color:#555;padding:4px 0;border-bottom:1px solid #e5dcc8">\u2192 '+esc(issue)+'</div>');});
  }
  if(tpl.onsiteQuestions&&tpl.onsiteQuestions.length){
    win.document.write('<div class="section-hdr">\u2753 Questions for the Onsite Visit</div>');
    tpl.onsiteQuestions.forEach(function(q,i){
      var d=cl.onsiteQ&&cl.onsiteQ[i]||"";
      win.document.write('<div class="q-item"><div class="q-text">'+(i+1)+'. '+esc(q)+'</div><div class="q-notes">'+esc(d||"_______________________________________________")+'</div></div>');
    });
  }
  win.document.write('<div class="footer"><span>ACG Practice Partners \u00a9 '+new Date().getFullYear()+'</span><span>Confidential \u00b7 Internal Use Only \u00b7 Not for client distribution without review</span></div>');
  win.document.write('<div class="no-print"><button onclick="window.print()" style="background:#1c2b3a;color:#fff;border:none;border-radius:8px;padding:10px 22px;font-size:13px;font-weight:700;cursor:pointer">Print / Save as PDF</button></div>');
  win.document.write('</div></body></html>');
  win.document.close();
}

function rAuditIntake(body){
  var emrOpts=["None","4D","Nextech w/ P+","Nextech Cloud","Symplast","ModMed","AestheticsPro","Podium AI OS","Other"];
  var phoneOpts=["None","Weave","Dialpad","Podium Phones","RingCentral","Zoom Phone","Other"];
  var finOpts=["None","CareCredit","PatientFi","Cherry","All Three","Other"];
  var imgOpts=["None","TouchMD","Image Assist","Canfield VECTRA","Canfield Mirror","VISIA","Other"];
  var crmOpts=["None","Podium","Nextech CRM","SymplastCRM","Zone DM","Dewy","Aesthetix CRM","Other"];
  var aiOpts=["None","4D AI / Knowtex","Nextech AI","ModMed Scribe","Podium Avery","Doximity","Other"];

  function mkSel(id,label,opts,val){
    return '<div><label style="font-size:10px;font-weight:700;color:var(--navy);display:block;margin-bottom:3px;text-transform:uppercase;letter-spacing:.4px">'+label+'</label>'
      +'<select id="'+id+'" style="width:100%;padding:7px 10px;border:1px solid var(--tan2);border-radius:6px;font-size:12px;font-family:Inter,sans-serif;color:var(--navy)">'
      +opts.map(function(o){return'<option'+(o===val?' selected':'')+'>'+o+'</option>';}).join('')
      +'</select></div>';
  }
  function yn(id,label,val){
    return '<div><label style="font-size:10px;font-weight:700;color:var(--navy);display:block;margin-bottom:3px;text-transform:uppercase;letter-spacing:.4px">'+label+'</label>'
      +'<select id="'+id+'" style="width:100%;padding:7px 10px;border:1px solid var(--tan2);border-radius:6px;font-size:12px;font-family:Inter,sans-serif;color:var(--navy)">'
      +'<option value="no"'+(val==="no"?' selected':'')+'>No</option>'
      +'<option value="yes"'+(val==="yes"?' selected':'')+'>Yes</option>'
      +'</select></div>';
  }

  var h='<div style="max-width:800px;margin:0 auto;padding:16px">';
  h+='<button id="back-home" style="background:none;border:none;color:var(--navy);font-size:12px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif;padding:0;margin-bottom:14px">\u2190 Back</button>';
  h+='<div style="background:#fff;border:1px solid var(--tan2);border-radius:12px;padding:22px">';
  h+='<h2 style="font-family:Playfair Display,serif;font-size:18px;color:var(--navy);margin:0 0 18px">Practice Intake</h2>';

  // Practice info
  h+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">';
  h+='<div style="grid-column:span 2"><label style="font-size:10px;font-weight:700;color:var(--navy);display:block;margin-bottom:3px;text-transform:uppercase;letter-spacing:.4px">Practice Name *</label>';
  h+='<input id="ai-name" type="text" value="'+esc(auditData.name)+'" placeholder="e.g. ALDA Aesthetics" style="width:100%;padding:8px 11px;border:1px solid var(--tan2);border-radius:6px;font-size:13px;font-family:Inter,sans-serif;color:var(--navy);box-sizing:border-box"></div>';
  h+=mkSel("ai-type","Practice Type",[["surgical","Surgical"],["medspa","Med Spa"],["hybrid","Hybrid (Surgical + Med Spa)"]].map(function(o){return o[1];}),auditData.type==="surgical"?"Surgical":auditData.type==="medspa"?"Med Spa":"Hybrid (Surgical + Med Spa)");
  h+=mkSel("ai-providers","Number of Providers",["1","2","3","4","5","6+"],auditData.providers||"1");
  h+=mkSel("ai-budget","Budget Range",["Low (startup/budget-conscious)","Medium","High (enterprise)"],auditData.budget==="low"?"Low (startup/budget-conscious)":auditData.budget==="high"?"High (enterprise)":"Medium");
  h+=yn("ai-startup","New Practice / Startup?",auditData.startup||"no");
  h+=yn("ai-insurance","Heavy Insurance Volume?",auditData.insurance||"no");
  h+='</div>';

  // Current Stack
  h+='<div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px;margin-top:4px">Current Tech Stack</div>';
  h+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px">';
  h+=mkSel("ai-emr","EMR",emrOpts,auditData.currentStack.emr||"None");
  h+=mkSel("ai-phone","Phone System",phoneOpts,auditData.currentStack.phone||"None");
  h+=mkSel("ai-financing","Patient Financing",finOpts,auditData.currentStack.financing||"None");
  h+=mkSel("ai-imaging","Imaging",imgOpts,auditData.currentStack.imaging||"None");
  h+=mkSel("ai-crm","CRM",crmOpts,auditData.currentStack.crm||"None");
  h+=mkSel("ai-ai","AI Tool",aiOpts,auditData.currentStack.ai||"None");
  h+='</div>';

  // Pain Points
  h+='<div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">Pain Points (check all that apply)</div>';
  h+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px">';
  [{id:"scheduling",label:"Scheduling & double booking"},{id:"communication",label:"Internal communication"},{id:"billing",label:"Billing / check-out issues"},{id:"documentation",label:"Documentation & charting"},{id:"inventory",label:"Inventory management"},{id:"training",label:"Staff training & adoption"},{id:"marketing",label:"Lead management & marketing"},{id:"reporting",label:"Reporting & analytics"}].forEach(function(pp){
    var checked=auditData.painPoints&&auditData.painPoints[pp.id];
    h+='<label style="display:flex;align-items:center;gap:8px;padding:8px 10px;border:1px solid var(--tan2);border-radius:7px;cursor:pointer;font-size:12px;color:var(--navy);font-family:Inter,sans-serif">';
    h+='<input type="checkbox" id="pp-'+pp.id+'" '+(checked?'checked':'')+' style="margin:0"><span>'+pp.label+'</span></label>';
  });
  h+='</div>';

  // Notes
  h+='<div style="margin-bottom:18px"><label style="font-size:10px;font-weight:700;color:var(--navy);display:block;margin-bottom:4px;text-transform:uppercase;letter-spacing:.4px">Initial Notes / Context</label>';
  h+='<textarea id="ai-notes" style="width:100%;height:70px;padding:8px 11px;border:1px solid var(--tan2);border-radius:6px;font-size:12px;font-family:Inter,sans-serif;color:var(--navy);resize:vertical;box-sizing:border-box" placeholder="What did the client say? What are you walking into?">'+esc(auditData.notes||"")+'</textarea></div>';

  h+='<button id="run-audit" style="background:var(--navy);color:#fff;border:none;border-radius:8px;padding:10px 22px;font-size:13px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif">Continue: Interview & Questionnaire \u2192</button>';
  h+='</div></div>';
  body.innerHTML=h;

  document.getElementById("back-home").addEventListener("click",function(){auditStep=0;render();});
  document.getElementById("run-audit").addEventListener("click",function(){
    var name=document.getElementById("ai-name").value.trim();
    if(!name){alert("Practice name is required.");return;}
    var typeVal=document.getElementById("ai-type").value;
    auditData.name=name;
    auditData.type=typeVal==="Surgical"?"surgical":typeVal==="Med Spa"?"medspa":"hybrid";
    auditData.providers=document.getElementById("ai-providers").value;
    auditData.budget=document.getElementById("ai-budget").value.indexOf("Low")>=0?"low":document.getElementById("ai-budget").value.indexOf("High")>=0?"high":"medium";
    auditData.startup=document.getElementById("ai-startup").value;
    auditData.insurance=document.getElementById("ai-insurance").value;
    auditData.currentStack={
      emr:document.getElementById("ai-emr").value,
      phone:document.getElementById("ai-phone").value,
      financing:document.getElementById("ai-financing").value,
      imaging:document.getElementById("ai-imaging").value,
      crm:document.getElementById("ai-crm").value,
      ai:document.getElementById("ai-ai").value
    };
    auditData.painPoints={};
    ["scheduling","communication","billing","documentation","inventory","training","marketing","reporting"].forEach(function(id){
      auditData.painPoints[id]=document.getElementById("pp-"+id).checked;
    });
    auditData.notes=document.getElementById("ai-notes").value.trim();
    if(!auditData.checklist)auditData.checklist={};
    if(!auditData.interviews)auditData.interviews=[];
    if(!auditData.staffQuestionnaire)auditData.staffQuestionnaire=[];
    if(!auditData.utilization)auditData.utilization={};
    if(!auditData.utilizationNotes)auditData.utilizationNotes={};
    if(!auditData.customAuditItems)auditData.customAuditItems=[];
    auditStep=2;saveAuditCurrent();render();
  });
}

// ── INTERVIEW, UTILIZATION & STAFF QUESTIONNAIRE ────────────
// Step 2 of the wizard. Provider/practice-manager interview notes and
// feature-utilization questions are captured live by ACG; staff questionnaire
// responses are collected outside the tool (email, paper, a separate form)
// and transcribed in here manually — CSI stays internal-only, no client-facing
// submission surface.
function rAuditInterview(body){
  if(!auditData.interviews)auditData.interviews=[];
  if(!auditData.staffQuestionnaire)auditData.staffQuestionnaire=[];
  if(!auditData.utilization)auditData.utilization={};
  if(!auditData.utilizationNotes)auditData.utilizationNotes={};
  if(!auditData.customAuditItems)auditData.customAuditItems=[];
  if(auditData.vendorAuditSource===undefined)auditData.vendorAuditSource="";
  if(!auditData.vendorAuditFindings)auditData.vendorAuditFindings=[];
  // First time through: pre-fill from the platform's own audit template, if one exists
  if(!auditData.vendorAuditFindings.length){
    var vTpl=VENDOR_AUDIT_TEMPLATES[auditData.currentStack.emr];
    if(vTpl){
      if(!auditData.vendorAuditSource)auditData.vendorAuditSource=vTpl.source;
      auditData.vendorAuditFindings=vTpl.categories.map(function(c){return{category:c,status:"",notes:""};});
    }
  }

  var h='<div style="max-width:900px;margin:0 auto;padding:16px">';
  h+='<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">';
  h+='<div><h2 style="font-family:Playfair Display,serif;font-size:20px;color:var(--navy);margin:0">'+esc(auditData.name)+'</h2>';
  h+='<p style="font-size:11px;color:var(--text3);margin:3px 0 0">Interview & Questionnaire — captured before the system walkthrough</p></div>';
  h+='<button id="back-intake" style="background:none;border:none;color:var(--navy);font-size:12px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif;padding:0">← Back</button>';
  h+='</div>';

  // Live interviews (provider / practice manager)
  h+='<div style="background:#fff;border:1px solid var(--tan2);border-radius:12px;padding:16px;margin-bottom:14px">';
  h+='<div style="font-size:13px;font-weight:700;color:var(--navy);margin-bottom:4px">Live Interviews (Provider / Practice Manager)</div>';
  h+='<div style="font-size:11px;color:var(--text3);margin-bottom:12px">One entry per person interviewed. No live staff interviews — see the questionnaire section below for staff.</div>';
  auditData.interviews.forEach(function(iv,idx){
    h+='<div style="border:1px solid var(--tan2);border-radius:8px;padding:12px;margin-bottom:10px;background:var(--tan-bg,#FAF8F3)">';
    h+='<div style="display:grid;grid-template-columns:1fr 1fr 32px;gap:8px;margin-bottom:8px">';
    h+='<input type="text" class="iv-name" data-idx="'+idx+'" value="'+esc(iv.name||"")+'" placeholder="Name" style="padding:6px 9px;border-radius:5px;border:1px solid var(--tan2);font-size:12px;font-family:Inter,sans-serif">';
    h+='<input type="text" class="iv-role" data-idx="'+idx+'" value="'+esc(iv.role||"")+'" placeholder="Role (e.g. Physician, Practice Manager)" style="padding:6px 9px;border-radius:5px;border:1px solid var(--tan2);font-size:12px;font-family:Inter,sans-serif">';
    h+='<button class="iv-del" data-idx="'+idx+'" style="background:none;border:none;color:var(--red);cursor:pointer;font-size:16px">×</button>';
    h+='</div>';
    h+='<textarea class="iv-notes" data-idx="'+idx+'" rows="3" placeholder="What did they say? Pain points, what is/isn’t working, priorities..." style="width:100%;padding:8px 9px;border:1px solid var(--tan2);border-radius:5px;font-size:12px;font-family:Inter,sans-serif;resize:vertical;box-sizing:border-box">'+esc(iv.notes||"")+'</textarea>';
    h+='</div>';
  });
  h+='<button id="iv-add" style="background:none;border:1px dashed var(--tan2);border-radius:6px;padding:7px 14px;font-size:11px;font-weight:600;cursor:pointer;color:var(--text3);font-family:Inter,sans-serif">+ Add Interview</button>';
  h+='</div>';

  // Vendor's own audit report (e.g. Nextech Health Check) — fold findings in, don't re-audit the same ground
  h+='<div style="background:#fff;border:1px solid var(--tan2);border-radius:12px;padding:16px;margin-bottom:14px">';
  h+='<div style="font-size:13px;font-weight:700;color:var(--navy);margin-bottom:4px">Vendor Audit Findings</div>';
  h+='<div style="font-size:11px;color:var(--text3);margin-bottom:12px">If the platform has its own native audit/health-check report, transcribe its findings here rather than re-checking the same ground during the walkthrough.</div>';
  h+='<div style="margin-bottom:10px"><label style="font-size:9px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;display:block;margin-bottom:3px">Report Source</label>';
  h+='<input type="text" id="va-source" value="'+esc(auditData.vendorAuditSource||"")+'" placeholder="e.g. Nextech Health Check — Aug 2026" style="width:100%;padding:6px 9px;border-radius:5px;border:1px solid var(--tan2);font-size:12px;font-family:Inter,sans-serif;box-sizing:border-box"></div>';
  auditData.vendorAuditFindings.forEach(function(vf,idx){
    h+='<div style="border:1px solid var(--tan2);border-radius:8px;padding:12px;margin-bottom:10px;background:var(--tan-bg,#FAF8F3)">';
    h+='<div style="display:grid;grid-template-columns:1fr 160px 32px;gap:8px;margin-bottom:8px">';
    h+='<input type="text" class="va-cat" data-idx="'+idx+'" value="'+esc(vf.category||"")+'" placeholder="Category (e.g. Financial Review)" style="padding:6px 9px;border-radius:5px;border:1px solid var(--tan2);font-size:12px;font-family:Inter,sans-serif">';
    h+='<select class="va-status" data-idx="'+idx+'" style="padding:6px 9px;border-radius:5px;border:1px solid var(--tan2);font-size:12px;font-family:Inter,sans-serif;color:var(--navy)">';
    [["","— Status —"],["great","Great"],["needs_review","Needs Review"],["na","Not Assessed"]].forEach(function(o){
      h+='<option value="'+o[0]+'"'+(vf.status===o[0]?' selected':'')+'>'+o[1]+'</option>';
    });
    h+='</select>';
    h+='<button class="va-del" data-idx="'+idx+'" style="background:none;border:none;color:var(--red);cursor:pointer;font-size:16px">×</button>';
    h+='</div>';
    h+='<textarea class="va-notes" data-idx="'+idx+'" rows="2" placeholder="What did the vendor report find/flag for this category?" style="width:100%;padding:8px 9px;border:1px solid var(--tan2);border-radius:5px;font-size:12px;font-family:Inter,sans-serif;resize:vertical;box-sizing:border-box">'+esc(vf.notes||"")+'</textarea>';
    h+='</div>';
  });
  h+='<button id="va-add" style="background:none;border:1px dashed var(--tan2);border-radius:6px;padding:7px 14px;font-size:11px;font-weight:600;cursor:pointer;color:var(--text3);font-family:Inter,sans-serif">+ Add Category</button>';
  h+='</div>';

  // Feature utilization questions (existing engine, now mounted)
  h+='<div style="background:#fff;border:1px solid var(--tan2);border-radius:12px;padding:16px;margin-bottom:14px">';
  h+='<div style="font-size:13px;font-weight:700;color:var(--navy);margin-bottom:4px">Feature Utilization</div>';
  h+='<div style="font-size:11px;color:var(--text3);margin-bottom:12px">Quick yes/no pass on whether existing features are actually being used — answered live during the walkthrough or the interview, whichever comes up first.</div>';
  h+='<div id="util-cats-wrap">'+renderUtilCategories()+'</div>';
  h+='</div>';

  // Staff questionnaire (manual transcription)
  h+='<div style="background:#fff;border:1px solid var(--tan2);border-radius:12px;padding:16px;margin-bottom:20px">';
  h+='<div style="font-size:13px;font-weight:700;color:var(--navy);margin-bottom:4px">Staff Questionnaire Responses</div>';
  h+='<div style="font-size:11px;color:var(--text3);margin-bottom:12px">Collected outside the tool and transcribed here — one entry per respondent.</div>';
  h+='<details style="margin-bottom:14px;border:1px solid var(--tan2);border-radius:8px;background:var(--gold-bg,#FBF6EA)">';
  h+='<summary style="padding:9px 14px;cursor:pointer;font-size:11px;font-weight:700;color:var(--navy);list-style:none">☰ Question list (what to ask / send)</summary>';
  h+='<div style="padding:2px 14px 12px">';
  STAFF_QUESTIONNAIRE.forEach(function(sec){
    h+='<div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:var(--text3);margin:10px 0 4px">'+esc(sec.area)+'</div>';
    h+='<ul style="margin:0;padding-left:18px">';
    sec.qs.forEach(function(q){
      h+='<li style="font-size:12px;color:var(--text2);line-height:1.6">'+esc(q)+'</li>';
    });
    h+='</ul>';
  });
  h+='</div></details>';
  auditData.staffQuestionnaire.forEach(function(sq,idx){
    h+='<div style="border:1px solid var(--tan2);border-radius:8px;padding:12px;margin-bottom:10px;background:var(--tan-bg,#FAF8F3)">';
    h+='<div style="display:grid;grid-template-columns:1fr 1fr 32px;gap:8px;margin-bottom:8px">';
    h+='<input type="text" class="sq-name" data-idx="'+idx+'" value="'+esc(sq.name||"")+'" placeholder="Name" style="padding:6px 9px;border-radius:5px;border:1px solid var(--tan2);font-size:12px;font-family:Inter,sans-serif">';
    h+='<input type="text" class="sq-role" data-idx="'+idx+'" value="'+esc(sq.role||"")+'" placeholder="Role (e.g. Front Desk, Billing)" style="padding:6px 9px;border-radius:5px;border:1px solid var(--tan2);font-size:12px;font-family:Inter,sans-serif">';
    h+='<button class="sq-del" data-idx="'+idx+'" style="background:none;border:none;color:var(--red);cursor:pointer;font-size:16px">×</button>';
    h+='</div>';
    h+='<textarea class="sq-notes" data-idx="'+idx+'" rows="3" placeholder="Transcribed responses, including &quot;what would you change?&quot;..." style="width:100%;padding:8px 9px;border:1px solid var(--tan2);border-radius:5px;font-size:12px;font-family:Inter,sans-serif;resize:vertical;box-sizing:border-box">'+esc(sq.notes||"")+'</textarea>';
    h+='</div>';
  });
  h+='<button id="sq-add" style="background:none;border:1px dashed var(--tan2);border-radius:6px;padding:7px 14px;font-size:11px;font-weight:600;cursor:pointer;color:var(--text3);font-family:Inter,sans-serif">+ Add Staff Response</button>';
  h+='</div>';

  h+='<div style="display:flex;gap:10px;margin-bottom:40px">';
  h+='<button id="audit-save3" style="flex:1;padding:12px;border-radius:8px;border:1.5px solid var(--navy);background:none;color:var(--navy);font-size:13px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif">Save Progress</button>';
  h+='<button id="iv-next" style="flex:1;padding:12px;border-radius:8px;border:none;background:var(--gold);color:var(--navy);font-size:13px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif">Continue: Checklist →</button>';
  h+='</div>';
  h+='</div>';
  body.innerHTML=h;

  wireUtilCategories(body);

  function persist(){save(SK+"_audits",Object.assign(audits,(function(){var o={};o[auditData.name]={intake:JSON.parse(JSON.stringify(auditData)),ts:Date.now()};return o;})()));saveAuditCurrent();}

  document.getElementById("back-intake").addEventListener("click",function(){auditStep=1;render();});
  document.getElementById("iv-add").addEventListener("click",function(){auditData.interviews.push({name:"",role:"",notes:""});persist();render();});
  document.getElementById("va-add").addEventListener("click",function(){auditData.vendorAuditFindings.push({category:"",status:"",notes:""});persist();render();});
  document.getElementById("sq-add").addEventListener("click",function(){auditData.staffQuestionnaire.push({name:"",role:"",notes:""});persist();render();});
  document.getElementById("audit-save3").addEventListener("click",function(){persist();var b=document.getElementById("audit-save3");b.textContent="✓ Saved";setTimeout(function(){b.textContent="Save Progress";},2000);});
  document.getElementById("iv-next").addEventListener("click",function(){persist();auditStep=3;render();});

  body.querySelectorAll(".iv-name").forEach(function(inp){inp.addEventListener("input",function(){auditData.interviews[inp.dataset.idx].name=inp.value;});});
  body.querySelectorAll(".iv-role").forEach(function(inp){inp.addEventListener("input",function(){auditData.interviews[inp.dataset.idx].role=inp.value;});});
  body.querySelectorAll(".iv-notes").forEach(function(inp){inp.addEventListener("input",function(){auditData.interviews[inp.dataset.idx].notes=inp.value;});});
  body.querySelectorAll(".iv-del").forEach(function(btn){btn.addEventListener("click",function(){auditData.interviews.splice(parseInt(btn.dataset.idx),1);persist();render();});});

  document.getElementById("va-source").addEventListener("input",function(inpEvt){auditData.vendorAuditSource=inpEvt.target.value;});
  body.querySelectorAll(".va-cat").forEach(function(inp){inp.addEventListener("input",function(){auditData.vendorAuditFindings[inp.dataset.idx].category=inp.value;});});
  body.querySelectorAll(".va-status").forEach(function(sel){sel.addEventListener("change",function(){auditData.vendorAuditFindings[sel.dataset.idx].status=sel.value;});});
  body.querySelectorAll(".va-notes").forEach(function(inp){inp.addEventListener("input",function(){auditData.vendorAuditFindings[inp.dataset.idx].notes=inp.value;});});
  body.querySelectorAll(".va-del").forEach(function(btn){btn.addEventListener("click",function(){auditData.vendorAuditFindings.splice(parseInt(btn.dataset.idx),1);persist();render();});});

  body.querySelectorAll(".sq-name").forEach(function(inp){inp.addEventListener("input",function(){auditData.staffQuestionnaire[inp.dataset.idx].name=inp.value;});});
  body.querySelectorAll(".sq-role").forEach(function(inp){inp.addEventListener("input",function(){auditData.staffQuestionnaire[inp.dataset.idx].role=inp.value;});});
  body.querySelectorAll(".sq-notes").forEach(function(inp){inp.addEventListener("input",function(){auditData.staffQuestionnaire[inp.dataset.idx].notes=inp.value;});});
  body.querySelectorAll(".sq-del").forEach(function(btn){btn.addEventListener("click",function(){auditData.staffQuestionnaire.splice(parseInt(btn.dataset.idx),1);persist();render();});});
}

function getActiveCats(){
  var active=AUDIT_CATEGORIES.filter(function(cat){
    if(cat.always)return true;
    if(cat.trigger==="surgical"&&auditData.type==="surgical")return true;
    if(cat.trigger&&auditData.painPoints&&auditData.painPoints[cat.trigger])return true;
    return false;
  });
  // Add custom categories
  (auditData.customCategories||[]).forEach(function(cc){active.push(cc);});
  return active;
}

function rAuditChecklist(body){
  var cats=getActiveCats();
  var cl=auditData.checklist||{};

  // Progress summary
  var totalItems=0,okItems=0,missingItems=0,partialItems=0;
  cats.forEach(function(cat){
    (cat.items||[]).forEach(function(item){
      totalItems++;
      var st=(cl[cat.id]&&cl[cat.id][item.id])?cl[cat.id][item.id].status:"";
      if(st==="ok")okItems++;
      else if(st==="missing")missingItems++;
      else if(st==="partial")partialItems++;
    });
  });
  var assessed=okItems+missingItems+partialItems;

  var h='<div style="max-width:900px;margin:0 auto;padding:16px">';
  h+='<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">';
  h+='<div><h2 style="font-family:Playfair Display,serif;font-size:20px;color:var(--navy);margin:0">'+esc(auditData.name)+'</h2>';
  h+='<p style="font-size:11px;color:var(--text3);margin:3px 0 0">'+esc(auditData.currentStack.emr)+(auditData.type?' · '+(auditData.type==="surgical"?"Surgical":auditData.type==="medspa"?"Med Spa":"Hybrid"):"")+' · '+esc(auditData.providers)+' provider'+(auditData.providers!=="1"?"s":"")+'</p></div>';
  h+='<div style="display:flex;gap:8px">';
  h+='<button id="back-interview" style="background:none;border:1.5px solid var(--tan2);color:var(--navy);border-radius:8px;padding:8px 14px;font-size:12px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif">\u2190 Back</button>';
  h+='<button id="audit-save" style="background:none;border:1.5px solid var(--tan2);color:var(--navy);border-radius:8px;padding:8px 14px;font-size:12px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif">Save Progress</button>';
  h+='<button id="audit-report-btn" style="background:var(--gold);color:var(--navy);border:none;border-radius:8px;padding:8px 14px;font-size:12px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif">Generate Report \u2192</button>';
  h+='</div></div>';

  // Progress bar
  h+='<div style="background:#fff;border:1px solid var(--tan2);border-radius:8px;padding:10px 14px;margin-bottom:14px">';
  h+='<div style="display:flex;gap:16px;align-items:center">';
  h+='<div style="flex:1;background:var(--tan);border-radius:4px;height:8px;overflow:hidden">';
  h+='<div style="height:8px;border-radius:4px;width:'+(totalItems>0?Math.round((assessed/totalItems)*100):0)+'%;background:var(--navy);transition:width .3s"></div></div>';
  h+='<div style="font-size:11px;color:var(--text3);white-space:nowrap">'+assessed+' / '+totalItems+' assessed</div>';
  if(missingItems)h+='<span style="font-size:10px;background:#FEE2E2;color:#DC2626;padding:2px 7px;border-radius:6px;font-weight:700">❌ '+missingItems+'</span>';
  if(partialItems)h+='<span style="font-size:10px;background:#FEF3C7;color:#D97706;padding:2px 7px;border-radius:6px;font-weight:700">⚠️ '+partialItems+'</span>';
  if(okItems)h+='<span style="font-size:10px;background:#D1FAE5;color:#059669;padding:2px 7px;border-radius:6px;font-weight:700">✅ '+okItems+'</span>';
  h+='</div></div>';

  // Checklist categories
  cats.forEach(function(cat){
    var catData=cl[cat.id]||{};
    var catMissing=0,catPartial=0,catOk=0;
    (cat.items||[]).forEach(function(item){
      var st=catData[item.id]?catData[item.id].status:"";
      if(st==="ok")catOk++;
      else if(st==="missing")catMissing++;
      else if(st==="partial")catPartial++;
    });

    h+='<div class="audit-cat" data-cat="'+cat.id+'" style="background:#fff;border:1px solid var(--tan2);border-radius:12px;margin-bottom:10px;overflow:hidden">';
    h+='<div class="audit-cat-hdr" style="padding:12px 16px;display:flex;align-items:center;gap:10px;cursor:pointer;user-select:none">';
    h+='<span style="font-size:18px">'+(cat.icon||"📋")+'</span>';
    h+='<span style="font-size:14px;font-weight:700;color:var(--navy);flex:1">'+esc(cat.label)+'</span>';
    if(catMissing)h+='<span style="font-size:10px;background:#FEE2E2;color:#DC2626;padding:2px 7px;border-radius:6px;font-weight:700">❌ '+catMissing+'</span>';
    if(catPartial)h+='<span style="font-size:10px;background:#FEF3C7;color:#D97706;padding:2px 7px;border-radius:6px;font-weight:700">⚠️ '+catPartial+'</span>';
    if(catOk)h+='<span style="font-size:10px;background:#D1FAE5;color:#059669;padding:2px 7px;border-radius:6px;font-weight:700">✅ '+catOk+'</span>';
    h+='<span class="cat-arrow" style="color:var(--text3);font-size:12px">\u25bc</span>';
    h+='</div>';
    h+='<div class="audit-cat-body" style="padding:0 16px 12px">';

    // Items
    (cat.items||[]).forEach(function(item){
      var itemData=catData[item.id]||{};
      h+='<div class="audit-item" data-cat="'+cat.id+'" data-item="'+item.id+'" style="padding:10px 0;border-top:1px solid var(--tan)">';
      h+='<div style="display:flex;align-items:flex-start;gap:10px">';
      h+='<div style="flex:1;font-size:12px;color:var(--navy);line-height:1.5;font-weight:500">'+esc(item.text)+'</div>';
      h+='<div style="display:flex;gap:4px;flex-shrink:0">';
      STATUS_OPTIONS.forEach(function(s){
        var isActive=itemData.status===s.value;
        h+='<button class="status-btn'+(isActive?" active":"")+'" data-cat="'+cat.id+'" data-item="'+item.id+'" data-status="'+s.value+'" title="'+s.label+'" style="padding:3px 8px;border-radius:5px;border:1.5px solid '+(isActive?s.color:"var(--tan2)")+';background:'+(isActive?s.color+"18":"#fff")+';color:'+(isActive?s.color:"var(--text3)")+';cursor:pointer;font-size:11px;font-weight:700;font-family:Inter,sans-serif;white-space:nowrap">'+s.label.split(" ")[0]+'</button>';
      });
      h+='</div></div>';

      // Notes fields (shown when status is set)
      if(itemData.status&&itemData.status!=="ok"&&itemData.status!=="na"){
        h+='<div style="margin-top:8px;display:grid;grid-template-columns:1fr 1fr;gap:8px">';
        h+='<div><label style="font-size:9px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;display:block;margin-bottom:3px">Current State</label>';
        h+='<textarea class="audit-note" data-cat="'+cat.id+'" data-item="'+item.id+'" data-field="currentState" rows="2" style="width:100%;padding:6px 8px;border:1px solid var(--tan2);border-radius:5px;font-size:11px;font-family:Inter,sans-serif;color:var(--navy);resize:vertical;box-sizing:border-box">'+esc(itemData.currentState||"")+'</textarea></div>';
        h+='<div><label style="font-size:9px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;display:block;margin-bottom:3px">Recommended Action</label>';
        h+='<textarea class="audit-note" data-cat="'+cat.id+'" data-item="'+item.id+'" data-field="recommendation" rows="2" style="width:100%;padding:6px 8px;border:1px solid var(--tan2);border-radius:5px;font-size:11px;font-family:Inter,sans-serif;color:var(--navy);resize:vertical;box-sizing:border-box">'+esc(itemData.recommendation||"")+'</textarea></div>';
        h+='</div>';
        h+='<div style="margin-top:6px;display:flex;gap:8px;align-items:center">';
        h+='<label style="font-size:9px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.5px">Priority:</label>';
        ["High","Medium","Low"].forEach(function(p){
          var active=itemData.priority===p.toLowerCase()||(p==="High"&&!itemData.priority&&itemData.status==="missing");
          h+='<button class="priority-btn'+(active?" active":"")+'" data-cat="'+cat.id+'" data-item="'+item.id+'" data-priority="'+p.toLowerCase()+'" style="padding:2px 9px;border-radius:4px;border:1px solid '+(active?(p==="High"?"#DC2626":p==="Medium"?"#D97706":"#059669"):"var(--tan2)")+';background:'+(active?(p==="High"?"#FEE2E2":p==="Medium"?"#FEF3C7":"#D1FAE5"):"#fff")+';color:'+(active?(p==="High"?"#DC2626":p==="Medium"?"#D97706":"#059669"):"var(--text3)")+';cursor:pointer;font-size:10px;font-weight:700;font-family:Inter,sans-serif">'+p+'</button>';
        });
        h+='</div>';
      }
      h+='</div>';
    });

    // Add custom item
    h+='<div style="margin-top:8px;border-top:1px solid var(--tan);padding-top:8px">';
    h+='<button class="add-custom-item" data-cat="'+cat.id+'" style="background:none;border:1px dashed var(--tan2);border-radius:6px;padding:5px 12px;font-size:11px;font-weight:600;cursor:pointer;color:var(--text3);font-family:Inter,sans-serif;width:100%">+ Add item to this category</button>';
    h+='</div>';
    h+='</div></div>';
  });

  // Add custom category
  h+='<div style="background:#fff;border:2px dashed var(--tan2);border-radius:12px;padding:16px;text-align:center;margin-bottom:16px">';
  h+='<button id="add-custom-cat" style="background:none;border:none;font-size:13px;font-weight:600;cursor:pointer;color:var(--text3);font-family:Inter,sans-serif">+ Add Custom Category</button>';
  h+='</div>';

  h+='<div style="display:flex;gap:10px;margin-bottom:40px">';
  h+='<button id="audit-save2" style="flex:1;padding:12px;border-radius:8px;border:1.5px solid var(--navy);background:none;color:var(--navy);font-size:13px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif">Save Progress</button>';
  h+='<button id="audit-report-btn2" style="flex:1;padding:12px;border-radius:8px;border:none;background:var(--gold);color:var(--navy);font-size:13px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif">Generate Report \u2192</button>';
  h+='</div>';
  h+='</div>';
  body.innerHTML=h;

  function saveAuditProgress(){
    audits[auditData.name]={intake:JSON.parse(JSON.stringify(auditData)),ts:Date.now()};
    save(SK+"_audits",audits);
    saveAuditCurrent();
  }

  // Status buttons
  body.querySelectorAll(".status-btn").forEach(function(btn){
    btn.addEventListener("click",function(){
      var cat=btn.dataset.cat,item=btn.dataset.item,status=btn.dataset.status;
      if(!auditData.checklist[cat])auditData.checklist[cat]={};
      if(!auditData.checklist[cat][item])auditData.checklist[cat][item]={};
      auditData.checklist[cat][item].status=status;
      if(status==="missing"&&!auditData.checklist[cat][item].priority)auditData.checklist[cat][item].priority="high";
      saveAuditProgress();
      render();
    });
  });

  // Note fields
  body.querySelectorAll(".audit-note").forEach(function(ta){
    ta.addEventListener("blur",function(){
      var cat=ta.dataset.cat,item=ta.dataset.item,field=ta.dataset.field;
      if(!auditData.checklist[cat])auditData.checklist[cat]={};
      if(!auditData.checklist[cat][item])auditData.checklist[cat][item]={};
      auditData.checklist[cat][item][field]=ta.value.trim();
      saveAuditProgress();
    });
  });

  // Priority buttons
  body.querySelectorAll(".priority-btn").forEach(function(btn){
    btn.addEventListener("click",function(){
      var cat=btn.dataset.cat,item=btn.dataset.item,priority=btn.dataset.priority;
      if(!auditData.checklist[cat])auditData.checklist[cat]={};
      if(!auditData.checklist[cat][item])auditData.checklist[cat][item]={};
      auditData.checklist[cat][item].priority=priority;
      saveAuditProgress();
      render();
    });
  });

  // Add custom item
  body.querySelectorAll(".add-custom-item").forEach(function(btn){
    btn.addEventListener("click",function(){
      var text=prompt("Item description:");
      if(!text)return;
      var catId=btn.dataset.cat;
      // Find if it's a custom category
      var customCat=(auditData.customCategories||[]).filter(function(c){return c.id===catId;})[0];
      if(customCat){
        if(!customCat.items)customCat.items=[];
        customCat.items.push({id:uid(),text:text.trim()});
      } else {
        // Add to a custom items override on the standard category
        if(!auditData.customCategories)auditData.customCategories=[];
        var existing=auditData.customCategories.filter(function(c){return c.id===catId+"_extra";})[0];
        if(!existing){existing={id:catId+"_extra",label:"",items:[]};auditData.customCategories.push(existing);}
        existing.items.push({id:uid(),text:text.trim()});
        // Also add to the standard category's items in a separate tracker
        if(!auditData.customItems)auditData.customItems={};
        if(!auditData.customItems[catId])auditData.customItems[catId]=[];
        auditData.customItems[catId].push({id:uid(),text:text.trim()});
      }
      saveAuditProgress();
      render();
    });
  });

  // Add custom category
  document.getElementById("add-custom-cat").addEventListener("click",function(){
    var name=prompt("Category name:");
    if(!name)return;
    if(!auditData.customCategories)auditData.customCategories=[];
    auditData.customCategories.push({id:uid(),label:name,icon:"📌",items:[]});
    saveAuditProgress();
    render();
  });

  // Category collapse/expand
  body.querySelectorAll(".audit-cat-hdr").forEach(function(hdr){
    hdr.addEventListener("click",function(){
      var catBody=hdr.nextElementSibling;
      var arrow=hdr.querySelector(".cat-arrow");
      var isOpen=catBody.style.display!=="none";
      catBody.style.display=isOpen?"none":"block";
      if(arrow)arrow.textContent=isOpen?"\u25b6":"\u25bc";
    });
  });

  // Save buttons
  ["audit-save","audit-save2"].forEach(function(id){
    var btn=document.getElementById(id);
    if(btn)btn.addEventListener("click",function(){saveAuditProgress();btn.textContent="\u2713 Saved";setTimeout(function(){btn.textContent=id==="audit-save"?"Save Progress":"Save Progress";},2000);});
  });

  // Report buttons
  ["audit-report-btn","audit-report-btn2"].forEach(function(id){
    var btn=document.getElementById(id);
    if(btn)btn.addEventListener("click",function(){saveAuditProgress();auditStep=4;render();});
  });

  // Back to interview
  var backIv=document.getElementById("back-interview");
  if(backIv)backIv.addEventListener("click",function(){saveAuditProgress();auditStep=2;render();});
}

function rAuditReport(body){
  var cats=getActiveCats();
  var cl=auditData.checklist||{};

  // Count gaps
  var highItems=[],medItems=[],lowItems=[];
  cats.forEach(function(cat){
    (cat.items||[]).forEach(function(item){
      var d=(cl[cat.id]&&cl[cat.id][item.id])?cl[cat.id][item.id]:{};
      if(d.status==="missing"||d.status==="partial"){
        var entry={cat:cat.label,item:item.text,currentState:d.currentState||"",recommendation:d.recommendation||"",status:d.status,priority:d.priority||"medium"};
        if(d.priority==="high"||d.status==="missing")highItems.push(entry);
        else if(d.priority==="low")lowItems.push(entry);
        else medItems.push(entry);
      }
    });
  });

  var h='<div style="max-width:860px;margin:0 auto;padding:16px">';
  h+='<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">';
  h+='<button id="back-checklist" style="background:none;border:none;color:var(--navy);font-size:12px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif;padding:0">\u2190 Back to Checklist</button>';
  h+='<button id="gen-pdf" style="background:var(--navy);color:#fff;border:none;border-radius:8px;padding:9px 16px;font-size:12px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif">\u2193 Download PDF</button></div>';

  // Preview
  h+='<div style="background:#fff;border:1px solid var(--tan2);border-radius:12px;overflow:hidden;margin-bottom:16px">';

  // Cover strip
  h+='<div style="background:var(--navy);padding:24px 28px">';
  h+='<div style="font-size:10px;font-weight:700;color:var(--gold);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">ACG Practice Partners \u2014 EMR Systems Review</div>';
  h+='<div style="font-family:Playfair Display,serif;font-size:24px;color:#fff;margin-bottom:6px">'+esc(auditData.name)+'</div>';
  h+='<div style="font-size:12px;color:rgba(255,255,255,.5)">'+esc(auditData.currentStack.emr)+(auditData.type?' \u00b7 '+(auditData.type==="surgical"?"Surgical":auditData.type==="medspa"?"Med Spa":"Hybrid"):"")+' \u00b7 '+new Date().toLocaleDateString()+' \u00b7 ACG Practice Partners</div></div>';

  // Summary
  h+='<div style="padding:20px 28px;border-bottom:1px solid var(--tan2)">';
  h+='<div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px">Executive Summary</div>';
  h+='<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:12px">';
  [{label:"High Priority",count:highItems.length,color:"#DC2626",bg:"#FEE2E2"},{label:"Needs Work",count:medItems.length,color:"#D97706",bg:"#FEF3C7"},{label:"Low Priority",count:lowItems.length,color:"#059669",bg:"#D1FAE5"}].forEach(function(s){
    h+='<div style="background:'+s.bg+';border-radius:8px;padding:12px;text-align:center">';
    h+='<div style="font-size:28px;font-weight:800;color:'+s.color+'">'+s.count+'</div>';
    h+='<div style="font-size:11px;font-weight:700;color:'+s.color+'">'+s.label+'</div></div>';
  });
  h+='</div>';
  if(auditData.notes)h+='<div style="font-size:12px;color:var(--text2);font-style:italic;line-height:1.6">'+esc(auditData.notes)+'</div>';
  h+='</div>';

  // Category sections
  cats.forEach(function(cat){
    var catItems=[];
    (cat.items||[]).forEach(function(item){
      var d=(cl[cat.id]&&cl[cat.id][item.id])?cl[cat.id][item.id]:{};
      catItems.push({item:item,data:d});
    });
    var hasGaps=catItems.some(function(ci){return ci.data.status==="missing"||ci.data.status==="partial";});
    if(!hasGaps&&catItems.every(function(ci){return ci.data.status==="ok"||ci.data.status==="na"||!ci.data.status;}))return;

    h+='<div style="padding:16px 28px;border-bottom:1px solid var(--tan2)">';
    h+='<div style="font-size:10px;font-weight:800;color:var(--text3);text-transform:uppercase;letter-spacing:.8px;margin-bottom:12px">'+(cat.icon||"")+" "+esc(cat.label)+'</div>';

    catItems.forEach(function(ci){
      var d=ci.data;
      if(!d.status||d.status==="ok"||d.status==="na")return;
      var isHigh=d.priority==="high"||d.status==="missing";
      var borderColor=isHigh?"#DC2626":d.priority==="low"?"#059669":"#D97706";
      var bgColor=isHigh?"#FFF5F5":d.priority==="low"?"#F0FDF4":"#FFFBEB";

      h+='<div style="background:'+bgColor+';border-left:3px solid '+borderColor+';border-radius:0 8px 8px 0;padding:12px 14px;margin-bottom:8px">';
      h+='<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:6px">';
      h+='<div style="font-size:12px;font-weight:700;color:var(--navy)">'+esc(ci.item.text)+'</div>';
      h+='<span style="font-size:9px;font-weight:800;color:'+borderColor+';text-transform:uppercase;letter-spacing:.5px;white-space:nowrap;padding:2px 7px;border-radius:4px;border:1px solid '+borderColor+'">'+(isHigh?"HIGH":d.priority==="low"?"LOW":"MEDIUM")+'</span></div>';
      if(d.currentState)h+='<div style="font-size:11px;color:var(--text2);margin-bottom:4px"><strong>Current state:</strong> '+esc(d.currentState)+'</div>';
      if(d.recommendation)h+='<div style="font-size:11px;color:var(--text2)"><strong>Recommended action:</strong> '+esc(d.recommendation)+'</div>';
      h+='</div>';
    });
    h+='</div>';
  });

  // Vendor Audit Findings (reference — e.g. Nextech Health Check)
  var vFindings=(auditData.vendorAuditFindings||[]).filter(function(vf){return vf.category||vf.notes;});
  if(vFindings.length){
    var vStatusLabel={great:"GREAT",needs_review:"NEEDS REVIEW",na:"NOT ASSESSED",'':"—"};
    var vStatusColor={great:"#059669",needs_review:"#DC2626",na:"#6B7280",'':"#6B7280"};
    h+='<div style="padding:16px 28px;border-bottom:1px solid var(--tan2)">';
    h+='<div style="font-size:10px;font-weight:800;color:var(--text3);text-transform:uppercase;letter-spacing:.8px;margin-bottom:4px">Vendor Audit Findings</div>';
    if(auditData.vendorAuditSource)h+='<div style="font-size:11px;color:var(--text3);font-style:italic;margin-bottom:10px">Source: '+esc(auditData.vendorAuditSource)+'</div>';
    vFindings.forEach(function(vf){
      var col=vStatusColor[vf.status||''];
      h+='<div style="border-left:3px solid '+col+';border-radius:0 8px 8px 0;padding:10px 14px;margin-bottom:8px;background:#FAFAFA">';
      h+='<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:4px">';
      h+='<div style="font-size:12px;font-weight:700;color:var(--navy)">'+esc(vf.category||"(uncategorized)")+'</div>';
      h+='<span style="font-size:9px;font-weight:800;color:'+col+';text-transform:uppercase;letter-spacing:.5px;white-space:nowrap;padding:2px 7px;border-radius:4px;border:1px solid '+col+'">'+(vStatusLabel[vf.status||'']||'—')+'</span></div>';
      if(vf.notes)h+='<div style="font-size:11px;color:var(--text2)">'+esc(vf.notes)+'</div>';
      h+='</div>';
    });
    h+='</div>';
  }

  // Feature Utilization Opportunities
  var utilGaps=getUtilizationGaps(auditData);
  var utilByArea={};
  utilGaps.flagged.forEach(function(f){
    if(!utilByArea[f.area])utilByArea[f.area]=[];
    utilByArea[f.area].push(f);
  });
  if(utilGaps.flagged.length){
    h+='<div style="padding:16px 28px;border-bottom:1px solid var(--tan2)">';
    h+='<div style="font-size:10px;font-weight:800;color:var(--text3);text-transform:uppercase;letter-spacing:.8px;margin-bottom:12px">Feature Utilization Opportunities</div>';
    Object.keys(utilByArea).forEach(function(area){
      h+='<div style="font-size:11px;font-weight:700;color:var(--navy);margin:10px 0 6px">'+esc(area)+'</div>';
      utilByArea[area].forEach(function(f){
        var borderColor=f.impact==="High"?"#DC2626":f.impact==="Low"?"#059669":"#D97706";
        var bgColor=f.impact==="High"?"#FFF5F5":f.impact==="Low"?"#F0FDF4":"#FFFBEB";
        h+='<div style="background:'+bgColor+';border-left:3px solid '+borderColor+';border-radius:0 8px 8px 0;padding:12px 14px;margin-bottom:8px">';
        h+='<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:6px">';
        h+='<div style="font-size:12px;font-weight:700;color:var(--navy)">'+esc(f.q)+(f.isOneOff?' <span style="font-size:9px;color:var(--amber);font-weight:700">ONE-OFF</span>':'')+'</div>';
        h+='<span style="font-size:9px;font-weight:800;color:'+borderColor+';text-transform:uppercase;letter-spacing:.5px;white-space:nowrap;padding:2px 7px;border-radius:4px;border:1px solid '+borderColor+'">'+esc(f.impact||"")+'</span></div>';
        h+='<div style="font-size:11px;color:var(--text2);margin-bottom:4px"><strong>Effort:</strong> '+esc(f.effort||"")+(f.acgFix!==undefined?' \u00b7 <strong>ACG can fix directly:</strong> '+(f.acgFix?"Yes":"No"):'')+'</div>';
        if(f.rec)h+='<div style="font-size:11px;color:var(--text2)"><strong>Recommended action:</strong> '+esc(f.rec)+'</div>';
        if(f.note)h+='<div style="font-size:11px;color:var(--text2)"><strong>Note:</strong> '+esc(f.note)+'</div>';
        h+='</div>';
      });
    });
    h+='</div>';
  }

  // Interviews & Staff Feedback
  var hasInterviews=(auditData.interviews||[]).length>0;
  var hasStaffQ=(auditData.staffQuestionnaire||[]).length>0;
  if(hasInterviews||hasStaffQ){
    h+='<div style="padding:16px 28px;border-bottom:1px solid var(--tan2)">';
    h+='<div style="font-size:10px;font-weight:800;color:var(--text3);text-transform:uppercase;letter-spacing:.8px;margin-bottom:12px">Interviews &amp; Staff Feedback</div>';
    if(hasInterviews){
      h+='<div style="font-size:11px;font-weight:700;color:var(--navy);margin:6px 0 6px">Live Interviews (Provider / Practice Manager)</div>';
      auditData.interviews.forEach(function(iv){
        if(!iv.name&&!iv.notes)return;
        h+='<div style="background:#F7F5EF;border-radius:8px;padding:10px 14px;margin-bottom:8px">';
        h+='<div style="font-size:12px;font-weight:700;color:var(--navy)">'+esc(iv.name||"(no name)")+(iv.role?' \u2014 '+esc(iv.role):'')+'</div>';
        if(iv.notes)h+='<div style="font-size:11px;color:var(--text2);margin-top:4px;white-space:pre-wrap">'+esc(iv.notes)+'</div>';
        h+='</div>';
      });
    }
    if(hasStaffQ){
      h+='<div style="font-size:11px;font-weight:700;color:var(--navy);margin:14px 0 6px">Staff Questionnaire Responses</div>';
      auditData.staffQuestionnaire.forEach(function(sq){
        if(!sq.name&&!sq.notes)return;
        h+='<div style="background:#F7F5EF;border-radius:8px;padding:10px 14px;margin-bottom:8px">';
        h+='<div style="font-size:12px;font-weight:700;color:var(--navy)">'+esc(sq.name||"(no name)")+(sq.role?' \u2014 '+esc(sq.role):'')+'</div>';
        if(sq.notes)h+='<div style="font-size:11px;color:var(--text2);margin-top:4px;white-space:pre-wrap">'+esc(sq.notes)+'</div>';
        h+='</div>';
      });
    }
    h+='</div>';
  }

  h+='<div style="padding:14px 28px;text-align:center"><div style="font-size:10px;color:var(--text3)">This document is confidential and prepared solely for the use of '+esc(auditData.name)+' practice leadership. \u00b7 ACG Practice Partners \u00a9 '+new Date().getFullYear()+'</div></div>';
  h+='</div></div>';
  body.innerHTML=h;

  document.getElementById("back-checklist").addEventListener("click",function(){auditStep=3;render();});
  document.getElementById("gen-pdf").addEventListener("click",function(){generateAuditPdf(cats,cl);});
}

function generateAuditPdf(cats,cl){
  var win=window.open("","_blank");
  if(!win){alert("Allow pop-ups to generate PDF.");return;}
  var css='@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Playfair+Display:wght@600&display=swap");*{box-sizing:border-box;margin:0;padding:0}body{font-family:Inter,sans-serif;color:#1c2b3a;font-size:12px;line-height:1.6;background:#fff}.page{max-width:760px;margin:0 auto;padding:40px 40px 60px}.cover{background:#1c2b3a;border-radius:12px;padding:32px;margin-bottom:28px}.cover-tag{font-size:9px;font-weight:700;color:#c9a84c;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:10px}.cover-title{font-family:"Playfair Display",serif;font-size:26px;color:#fff;margin-bottom:6px}.cover-sub{font-size:12px;color:rgba(255,255,255,.5)}.section-hdr{font-size:9px;font-weight:800;color:#888;text-transform:uppercase;letter-spacing:1px;margin:22px 0 10px;padding-bottom:5px;border-bottom:1px solid #e5dcc8}.gap-card{border-left:3px solid #dc2626;background:#fff5f5;border-radius:0 8px 8px 0;padding:12px 14px;margin-bottom:8px}.gap-card.medium{border-left-color:#d97706;background:#fffbeb}.gap-card.low{border-left-color:#059669;background:#f0fdf4}.gap-title{font-size:12px;font-weight:700;color:#1c2b3a;margin-bottom:4px;display:flex;justify-content:space-between;align-items:flex-start;gap:8px}.priority-badge{font-size:8px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;padding:2px 6px;border-radius:3px;flex-shrink:0}.gap-state{font-size:11px;color:#555;margin-bottom:3px}.gap-rec{font-size:11px;color:#555}.summary-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:16px 0}.summary-box{text-align:center;border-radius:8px;padding:14px}.summary-num{font-size:28px;font-weight:800;display:block}.summary-label{font-size:10px;font-weight:700}.footer{margin-top:40px;padding-top:14px;border-top:1px solid #e5dcc8;font-size:9px;color:#aaa;display:flex;justify-content:space-between}.no-print{position:fixed;bottom:20px;right:20px}@media print{.no-print{display:none}.cover,.summary-box,.gap-card{-webkit-print-color-adjust:exact;print-color-adjust:exact}}';

  win.document.write('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Technology Audit \u2014 '+esc(auditData.name)+'</title><style>'+css+'</style></head><body><div class="page">');
  win.document.write('<div class="cover"><div class="cover-tag">ACG Practice Partners \u2014 EMR Systems Review</div>');
  win.document.write('<div class="cover-title">'+esc(auditData.name)+'</div>');
  win.document.write('<div class="cover-sub">'+esc(auditData.currentStack.emr)+(auditData.type?' \u00b7 '+(auditData.type==="surgical"?"Surgical":auditData.type==="medspa"?"Med Spa":"Hybrid"):"")+' \u00b7 '+esc(auditData.providers)+' provider'+(auditData.providers!=="1"?"s":"")+' \u00b7 '+new Date().toLocaleDateString()+' \u00b7 ACG Practice Partners</div></div>');

  // Summary
  var highCount=0,medCount=0,lowCount=0;
  cats.forEach(function(cat){(cat.items||[]).forEach(function(item){var d=(cl[cat.id]&&cl[cat.id][item.id])?cl[cat.id][item.id]:{};if(d.status==="missing"||d.status==="partial"){if(d.priority==="high"||d.status==="missing")highCount++;else if(d.priority==="low")lowCount++;else medCount++;}});});

  win.document.write('<div class="summary-grid">');
  win.document.write('<div class="summary-box" style="background:#FEE2E2"><span class="summary-num" style="color:#DC2626">'+highCount+'</span><span class="summary-label" style="color:#DC2626">High Priority</span></div>');
  win.document.write('<div class="summary-box" style="background:#FEF3C7"><span class="summary-num" style="color:#D97706">'+medCount+'</span><span class="summary-label" style="color:#D97706">Needs Work</span></div>');
  win.document.write('<div class="summary-box" style="background:#D1FAE5"><span class="summary-num" style="color:#059669">'+lowCount+'</span><span class="summary-label" style="color:#059669">Low Priority</span></div>');
  win.document.write('</div>');
  if(auditData.notes)win.document.write('<p style="font-size:12px;color:#555;font-style:italic;margin-bottom:16px;line-height:1.6">'+esc(auditData.notes)+'</p>');

  // Categories
  cats.forEach(function(cat){
    var catItems=[];
    (cat.items||[]).forEach(function(item){var d=(cl[cat.id]&&cl[cat.id][item.id])?cl[cat.id][item.id]:{};if(d.status==="missing"||d.status==="partial")catItems.push({item:item,data:d});});
    if(!catItems.length)return;
    win.document.write('<div class="section-hdr">'+(cat.icon||"")+" "+esc(cat.label)+'</div>');
    catItems.forEach(function(ci){
      var d=ci.data;
      var isHigh=d.priority==="high"||d.status==="missing";
      var cls=isHigh?"gap-card":d.priority==="low"?"gap-card low":"gap-card medium";
      var borderColor=isHigh?"#DC2626":d.priority==="low"?"#059669":"#D97706";
      win.document.write('<div class="'+cls+'">');
      win.document.write('<div class="gap-title">'+esc(ci.item.text)+'<span class="priority-badge" style="color:'+borderColor+';border:1px solid '+borderColor+'">'+(isHigh?"HIGH":d.priority==="low"?"LOW":"MEDIUM")+'</span></div>');
      if(d.currentState)win.document.write('<div class="gap-state"><strong>Current state:</strong> '+esc(d.currentState)+'</div>');
      if(d.recommendation)win.document.write('<div class="gap-rec"><strong>Recommended action:</strong> '+esc(d.recommendation)+'</div>');
      win.document.write('</div>');
    });
  });

  // Vendor Audit Findings (reference — e.g. Nextech Health Check)
  var vFindings=(auditData.vendorAuditFindings||[]).filter(function(vf){return vf.category||vf.notes;});
  if(vFindings.length){
    var vStatusLabel={great:"GREAT",needs_review:"NEEDS REVIEW",na:"NOT ASSESSED",'':"—"};
    var vStatusColor={great:"#059669",needs_review:"#DC2626",na:"#6B7280",'':"#6B7280"};
    win.document.write('<div class="section-hdr">Vendor Audit Findings</div>');
    if(auditData.vendorAuditSource)win.document.write('<p style="font-size:11px;color:#888;font-style:italic;margin-bottom:10px">Source: '+esc(auditData.vendorAuditSource)+'</p>');
    vFindings.forEach(function(vf){
      var col=vStatusColor[vf.status||''];
      win.document.write('<div style="border-left:3px solid '+col+';border-radius:0 8px 8px 0;padding:10px 14px;margin-bottom:8px;background:#FAFAFA">');
      win.document.write('<div class="gap-title">'+esc(vf.category||"(uncategorized)")+'<span class="priority-badge" style="color:'+col+';border:1px solid '+col+'">'+(vStatusLabel[vf.status||'']||'—')+'</span></div>');
      if(vf.notes)win.document.write('<div class="gap-rec">'+esc(vf.notes)+'</div>');
      win.document.write('</div>');
    });
  }

  // Feature Utilization Opportunities
  var utilGaps=getUtilizationGaps(auditData);
  var utilByArea={};
  utilGaps.flagged.forEach(function(f){
    if(!utilByArea[f.area])utilByArea[f.area]=[];
    utilByArea[f.area].push(f);
  });
  if(utilGaps.flagged.length){
    win.document.write('<div class="section-hdr">Feature Utilization Opportunities</div>');
    Object.keys(utilByArea).forEach(function(area){
      win.document.write('<div style="font-size:11px;font-weight:700;color:#1c2b3a;margin:10px 0 6px">'+esc(area)+'</div>');
      utilByArea[area].forEach(function(f){
        var borderColor=f.impact==="High"?"#DC2626":f.impact==="Low"?"#059669":"#D97706";
        var cls=f.impact==="High"?"gap-card":f.impact==="Low"?"gap-card low":"gap-card medium";
        win.document.write('<div class="'+cls+'">');
        win.document.write('<div class="gap-title">'+esc(f.q)+(f.isOneOff?' <span style="font-size:9px;color:#9C7A3C;font-weight:700">ONE-OFF</span>':'')+'<span class="priority-badge" style="color:'+borderColor+';border:1px solid '+borderColor+'">'+esc(f.impact||"")+'</span></div>');
        win.document.write('<div class="gap-state"><strong>Effort:</strong> '+esc(f.effort||"")+(f.acgFix!==undefined?' \u00b7 <strong>ACG can fix directly:</strong> '+(f.acgFix?"Yes":"No"):'')+'</div>');
        if(f.rec)win.document.write('<div class="gap-rec"><strong>Recommended action:</strong> '+esc(f.rec)+'</div>');
        if(f.note)win.document.write('<div class="gap-rec"><strong>Note:</strong> '+esc(f.note)+'</div>');
        win.document.write('</div>');
      });
    });
  }

  // Interviews & Staff Feedback
  var hasInterviews=(auditData.interviews||[]).filter(function(iv){return iv.name||iv.notes;});
  var hasStaffQ=(auditData.staffQuestionnaire||[]).filter(function(sq){return sq.name||sq.notes;});
  if(hasInterviews.length||hasStaffQ.length){
    win.document.write('<div class="section-hdr">Interviews &amp; Staff Feedback</div>');
    if(hasInterviews.length){
      win.document.write('<div style="font-size:11px;font-weight:700;color:#1c2b3a;margin:6px 0 6px">Live Interviews (Provider / Practice Manager)</div>');
      hasInterviews.forEach(function(iv){
        win.document.write('<div style="background:#F7F5EF;border-radius:8px;padding:10px 14px;margin-bottom:8px">');
        win.document.write('<div style="font-size:12px;font-weight:700;color:#1c2b3a">'+esc(iv.name||"(no name)")+(iv.role?' \u2014 '+esc(iv.role):'')+'</div>');
        if(iv.notes)win.document.write('<div style="font-size:11px;color:#555;margin-top:4px;white-space:pre-wrap">'+esc(iv.notes)+'</div>');
        win.document.write('</div>');
      });
    }
    if(hasStaffQ.length){
      win.document.write('<div style="font-size:11px;font-weight:700;color:#1c2b3a;margin:14px 0 6px">Staff Questionnaire Responses</div>');
      hasStaffQ.forEach(function(sq){
        win.document.write('<div style="background:#F7F5EF;border-radius:8px;padding:10px 14px;margin-bottom:8px">');
        win.document.write('<div style="font-size:12px;font-weight:700;color:#1c2b3a">'+esc(sq.name||"(no name)")+(sq.role?' \u2014 '+esc(sq.role):'')+'</div>');
        if(sq.notes)win.document.write('<div style="font-size:11px;color:#555;margin-top:4px;white-space:pre-wrap">'+esc(sq.notes)+'</div>');
        win.document.write('</div>');
      });
    }
  }

  win.document.write('<div class="footer"><span>ACG Practice Partners \u00a9 '+new Date().getFullYear()+'</span><span>This document is confidential and prepared solely for the use of '+esc(auditData.name)+' practice leadership.</span></div>');
  win.document.write('<div class="no-print"><button onclick="window.print()" style="background:#1c2b3a;color:#fff;border:none;border-radius:8px;padding:10px 22px;font-size:13px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif">Print / Save as PDF</button></div>');
  win.document.write('</div></body></html>');
  win.document.close();
}

