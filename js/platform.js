// ── ASK ─────────────────────────────────────────────────────
function doAsk(){var q=document.getElementById("ask-inp").value.trim();if(q)render();}

function detectRecIntent(ql){
  var emrWords=["emr","software","system","platform","recommend","best","which","suggest","should use","good for","fit for","work for"];
  var crmWords=["crm","marketing","lead","nurture","automation","follow.?up"];
  var phoneWords=["phone","weave","calling","texting","voip","communication system"];
  var finWords=["financing","payment plan","cherry","carecredit","finance"];
  var isQuestion=ql.indexOf("what")>=0||ql.indexOf("which")>=0||ql.indexOf("should")>=0||ql.indexOf("recommend")>=0||ql.indexOf("best")>=0||ql.indexOf("suggest")>=0;
  if(!isQuestion)return null;
  for(var i=0;i<emrWords.length;i++){if(new RegExp(emrWords[i]).test(ql))return"emr";}
  for(var i=0;i<crmWords.length;i++){if(new RegExp(crmWords[i]).test(ql))return"crm";}
  for(var i=0;i<phoneWords.length;i++){if(new RegExp(phoneWords[i]).test(ql))return"phone";}
  for(var i=0;i<finWords.length;i++){if(new RegExp(finWords[i]).test(ql))return"financing";}
  return null;
}

function renderQuickRec(body,ql,recType,extraEntries,words){
  // Build a quick recommendation from available context
  var intake=Object.assign({},auditData);
  // Try to extract context from the question
  if(ql.indexOf("surgical")>=0||ql.indexOf("plastic")>=0)intake.type="surgical";
  else if(ql.indexOf("medspa")>=0||ql.indexOf("spa")>=0||ql.indexOf("aesthetic")>=0)intake.type="medspa";
  if(ql.indexOf("small")>=0||ql.indexOf("solo")>=0||ql.indexOf("one provider")>=0||ql.indexOf("1 provider")>=0)intake.providers="1";
  if(ql.indexOf("budget")>=0||ql.indexOf("affordable")>=0||ql.indexOf("cheap")>=0)intake.budget="low";
  if(ql.indexOf("mobile")>=0||ql.indexOf("phone app")>=0)intake.mobile="yes";
  if(ql.indexOf("inject")>=0||ql.indexOf("filler")>=0||ql.indexOf("botox")>=0)intake.injectable="yes";
  if(ql.indexOf("insurance")>=0)intake.insurance="yes";
  if(ql.indexOf("growth")>=0||ql.indexOf("marketing")>=0||ql.indexOf("lead")>=0)intake.growth="yes";
  // Also use practice context if set
  if(practiceCtx.emr)intake.currentStack=intake.currentStack||{};
  if(practiceCtx.emr&&intake.currentStack)intake.currentStack.emr=practiceCtx.emr;

  var h='<div class="answer-box">';
  h+='<div class="answer-q">'+esc(ql)+'</div>';
  h+='<div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;padding:8px 12px;background:var(--gold-bg);border:1px solid var(--gold-l);border-radius:7px">'
    +'<span style="font-size:11px;color:var(--amber)">● Based on '+(practiceCtx.name?esc(practiceCtx.name)+' context':"keywords in your question")+'. For a full scored recommendation, use the <b>Technology Audit</b> tab.</span>'
    +'<button onclick="SV(\"audit\")" style="margin-left:auto;padding:4px 10px;border-radius:5px;border:none;background:var(--gold);color:var(--navy);font-size:11px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif">Run Full Audit</button>'
    +'</div>';

  if(recType==="emr"){
    var scores=scoreEmr(intake);
    var sorted=Object.keys(scores).sort(function(a,b){return scores[b]-scores[a];});
    h+='<div style="font-size:13px;font-weight:700;color:var(--navy);margin-bottom:12px">EMR Recommendation</div>';
    sorted.slice(0,3).forEach(function(p,i){
      var score=scores[p];
      var isTop=i===0;
      var take=(overrides[overrideKey("Dashboard","Implementation Timeline",p)]||{}).acgTake||"";
      var issues=(knownIssues[p]||[]).filter(function(iss){return iss.sev==="Critical";});
      h+='<div style="margin-bottom:12px;padding:12px 14px;border-radius:8px;background:'+(isTop?"var(--gold-bg)":"var(--white)")+';border:'+(isTop?"2px solid var(--gold-l)":"1px solid var(--tan2)")+'">'
        +'<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:5px">'
        +'<div style="font-size:13px;font-weight:700;color:var(--navy)">'+esc(p)+(isTop?' <span style="background:var(--gold);color:var(--navy);border-radius:3px;padding:1px 6px;font-size:9px;font-weight:800">TOP PICK</span>':'')+'</div>'
        +'<div style="font-size:13px;font-weight:800;color:'+(isTop?"var(--amber)":"var(--text3)")+'">'+score+'</div></div>'
        +'<div style="background:var(--tan);border-radius:3px;height:6px;overflow:hidden;margin-bottom:6px"><div style="background:'+(isTop?"var(--gold)":i===1?"var(--navy)":"var(--tan2)")+';height:6px;width:'+score+'%;border-radius:3px"></div></div>'
        +(take?'<div style="font-size:12px;color:var(--blue);font-style:italic;line-height:1.5">'+esc(take.slice(0,120))+(take.length>120?"…":"")+'</div>':"")
        +(issues.length?'<div style="font-size:11px;color:var(--red);margin-top:3px">⚠ '+issues.length+' critical watch-out'+(issues.length>1?"s":"")+'</div>':"")
        +'</div>';
    });
  } else if(recType==="crm"){
    var cScores=scoreCrm(intake);
    var cSorted=Object.keys(cScores).sort(function(a,b){return cScores[b]-cScores[a];});
    h+='<div style="font-size:13px;font-weight:700;color:var(--navy);margin-bottom:12px">CRM Recommendation</div>';
    cSorted.slice(0,3).forEach(function(p,i){
      var take=(overrides[overrideKey("CRM Comparison","Parent Platform / Vendor",p)]||{}).acgTake
        ||(ACG_TAKES["CRM Comparison·Parent Platform / Vendor·"+p])||"";
      h+='<div style="display:flex;align-items:flex-start;gap:12px;padding:11px 14px;border-radius:8px;margin-bottom:8px;background:'+(i===0?"var(--gold-bg)":"var(--white)")+';border:'+(i===0?"2px solid var(--gold-l)":"1px solid var(--tan2)")+'">'
        +'<div style="font-size:20px;font-weight:800;color:'+(i===0?"var(--gold)":i===1?"var(--navy)":"var(--tan2)")+';flex-shrink:0">#'+(i+1)+'</div>'
        +'<div><div style="font-size:13px;font-weight:700;color:var(--navy);margin-bottom:3px">'+esc(p)+'</div>'
        +(take?'<div style="font-size:12px;color:var(--blue);font-style:italic;line-height:1.5">'+esc(take.slice(0,100))+(take.length>100?"…":"")+'</div>':"")
        +'</div></div>';
    });
  } else if(recType==="phone"){
    var phoneRecs=[{p:"Weave",reason:"Best EMR integration for plastic surgery. Call pop, schedule sync, review automation. Highest-rated for aesthetics practices."},
      {p:"RingCentral",reason:"Best for larger multi-location practices or those needing enterprise features and 24/7 support."},
      {p:"Dialpad",reason:"Best for practices prioritizing AI call transcription and real-time coaching for front desk training."}];
    h+='<div style="font-size:13px;font-weight:700;color:var(--navy);margin-bottom:12px">Phone System Recommendation</div>';
    phoneRecs.forEach(function(rec,i){
      h+='<div style="display:flex;align-items:flex-start;gap:12px;padding:11px 14px;border-radius:8px;margin-bottom:8px;background:'+(i===0?"var(--gold-bg)":"var(--white)")+';border:'+(i===0?"2px solid var(--gold-l)":"1px solid var(--tan2)")+'">'
        +'<div style="font-size:20px;font-weight:800;color:'+(i===0?"var(--gold)":i===1?"var(--navy)":"var(--tan2)")+';flex-shrink:0">#'+(i+1)+'</div>'
        +'<div><div style="font-size:13px;font-weight:700;color:var(--navy);margin-bottom:3px">'+esc(rec.p)+'</div>'
        +'<div style="font-size:12px;color:var(--text2);line-height:1.5">'+esc(rec.reason)+'</div></div></div>';
    });
  } else if(recType==="financing"){
    var finRecs=[{p:"Cherry",reason:"Primary recommendation for every practice. Highest approval rate (80-90%), soft credit check, no deferred interest, free to add, Allē integration."},
      {p:"CareCredit",reason:"Secondary for brand recognition. Hard pull and deferred interest are negatives but patient familiarity justifies offering it alongside Cherry."},
      {p:"PatientFi",reason:"Add for high-cost surgical cases. Up to $85K — fills the gap when Cherry's $50K cap isn't enough."}];
    h+='<div style="font-size:13px;font-weight:700;color:var(--navy);margin-bottom:12px">Patient Financing Recommendation</div>';
    finRecs.forEach(function(rec,i){
      h+='<div style="display:flex;align-items:flex-start;gap:12px;padding:11px 14px;border-radius:8px;margin-bottom:8px;background:'+(i===0?"var(--gold-bg)":"var(--white)")+';border:'+(i===0?"2px solid var(--gold-l)":"1px solid var(--tan2)")+'">'
        +'<div style="font-size:20px;font-weight:800;color:'+(i===0?"var(--gold)":i===1?"var(--navy)":"var(--tan2)")+';flex-shrink:0">#'+(i+1)+'</div>'
        +'<div><div style="font-size:13px;font-weight:700;color:var(--navy);margin-bottom:3px">'+esc(rec.p)+'</div>'
        +'<div style="font-size:12px;color:var(--text2);line-height:1.5">'+esc(rec.reason)+'</div></div></div>';
    });
  }

  // Also show any relevant search results below
  if(extraEntries.length){
    h+='<div style="border-top:1px solid var(--tan);margin-top:14px;padding-top:14px"><div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:var(--text3);margin-bottom:10px">Related Data</div>';
    extraEntries.slice(0,3).forEach(function(e){
      var cols=Object.keys(e.c).slice(0,3);
      h+='<div style="margin-bottom:8px"><div style="font-size:12px;font-weight:600;color:var(--navy);margin-bottom:4px">'+hl(e.f,words||[])+'</div>';
      cols.forEach(function(col){h+='<div style="font-size:11px;color:var(--text2)"><span style="font-weight:600">'+esc(col)+':</span> '+esc(String(e.c[col]).slice(0,60))+'</div>';});
      h+='</div>';
    });
    h+='</div>';
  }

  h+='</div>';
  body.innerHTML=h;
}

function rAsk(body){
  var q=document.getElementById("ask-inp").value.trim();
  var ctxPlat=resolveCtxPlatform();
  var fav=isFav(q);

  // ── EMPTY STATE ──────────────────────────────────────────────────────────────
  if(!q){
    var ctxName=practiceCtx.name?practiceCtx.name:"";
    var ctxEmr=ctxPlat?ctxPlat:"";
    // Call-ready suggestion cards
    var callQs=[
      {icon:"💉",q:"injectable tracking"+(ctxEmr?" "+ctxEmr:""),label:"Injectable tracking"},
      {icon:"📋",q:"consent forms"+(ctxEmr?" "+ctxEmr:""),label:"Consent forms"},
      {icon:"📱",q:"mobile app"+(ctxEmr?" "+ctxEmr:""),label:"Mobile app"},
      {icon:"🤖",q:"AI scribe"+(ctxEmr?" "+ctxEmr:""),label:"AI scribe"},
      {icon:"💳",q:"Cherry approval rate",label:"Cherry approval rate"},
      {icon:"📅",q:"online booking"+(ctxEmr?" "+ctxEmr:""),label:"Online booking"},
      {icon:"⚠️",q:"watch-outs"+(ctxEmr?" "+ctxEmr:""),label:"Watch-outs"+(ctxEmr?" for "+ctxEmr:"")},
      {icon:"💰",q:"pricing"+(ctxEmr?" "+ctxEmr:""),label:"Pricing"+(ctxEmr?" for "+ctxEmr:"")}
    ];
    var favHints=favorites.slice(0,3).map(function(f){return'<button class="hint fav-hint" data-h="'+esc(f.query)+'">★ '+esc(f.label||f.query)+'</button>';}).join("");
    var h='<div style="max-width:580px;margin:0 auto;padding:12px 0">';
    if(ctxPlat){
      h+='<div style="background:var(--navy);border-radius:10px;padding:14px 18px;margin-bottom:18px;display:flex;align-items:center;gap:10px">';
      h+='<div style="font-size:22px">🏥</div>';
      h+='<div><div style="font-size:12px;font-weight:700;color:var(--gold)">Call context active</div>';
      h+='<div style="font-size:13px;color:#fff;font-weight:600">'+(ctxName?esc(ctxName)+" · ":"")+esc(ctxPlat)+'</div></div>';
      h+='<button onclick="practiceCtx.emr=\'\';save(SK+\'_ctx\',practiceCtx);updateCtxBar();render();" style="margin-left:auto;background:none;border:1px solid rgba(255,255,255,.2);border-radius:5px;color:rgba(255,255,255,.5);cursor:pointer;font-size:11px;padding:3px 8px;font-family:Inter,sans-serif">clear</button>';
      h+='</div>';
    }
    h+='<div style="font-size:13px;font-weight:600;color:var(--text3);margin-bottom:10px;text-transform:uppercase;letter-spacing:.5px;font-size:10px">Common call questions</div>';
    h+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px">';
    callQs.forEach(function(cq){
      h+='<button class="call-q-btn" data-q="'+esc(cq.q)+'" style="text-align:left;padding:12px 14px;border-radius:10px;border:1.5px solid var(--tan2);background:var(--white);cursor:pointer;font-family:Inter,sans-serif;transition:all .12s">';
      h+='<div style="font-size:18px;margin-bottom:4px">'+cq.icon+'</div>';
      h+='<div style="font-size:12px;font-weight:700;color:var(--navy)">'+esc(cq.label)+'</div>';
      h+='</button>';
    });
    h+='</div>';
    if(favHints)h+='<div style="margin-bottom:8px"><div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">Saved searches</div><div style="display:flex;gap:6px;flex-wrap:wrap">'+favHints+'</div></div>';
    h+='</div>';
    body.innerHTML=h;
    body.querySelectorAll(".call-q-btn").forEach(function(btn){
      btn.addEventListener("click",function(){
        document.getElementById("ask-inp").value=btn.getAttribute("data-q");
        render();
      });
    });
    document.getElementById("ask-hints").innerHTML="";
    attachHints();
    return;
  }

  // ── SEARCH ───────────────────────────────────────────────────────────────────
  var res=answerQ(q);
  var words=res.words||q.toLowerCase().split(/\s+/).filter(function(w){return w.length>2;});
  var qLower=q.toLowerCase();

  // ── RECOMMENDATION INTENT ─────────────────────────────────────────────────────
  var recIntent=detectRecIntent(qLower);
  if(recIntent){renderQuickRec(body,qLower,recIntent,res.entries,words);return;}

  // ── NO RESULTS ───────────────────────────────────────────────────────────────
  if(!res.entries.length){
    body.innerHTML='<div class="no-match">'
      +'<div style="font-size:15px;font-weight:700;color:var(--navy);margin-bottom:6px">No match for \u201c'+esc(q)+'\u201d</div>'
      +'<div style="font-size:13px;color:var(--text2);margin-bottom:12px">Try simpler terms — one or two words works best.</div>'
      +'<div class="suggestions">'+["injectable","consent forms","mobile app","pricing","AI scribe","online booking","telehealth","Cherry"].map(function(s){return'<button class="sug" data-sg="'+s+'">'+s+'</button>';}).join("")+'</div></div>';
    body.querySelectorAll(".sug").forEach(function(b){b.addEventListener("click",function(){document.getElementById("ask-inp").value=b.getAttribute("data-sg");render();});});
    return;
  }

  // ── DETERMINE PLATFORM ────────────────────────────────────────────────────────
  // Priority: 1) platform mentioned in query, 2) practice context, 3) ask user
  var detectedPlat=res.plats.length>0?res.plats[0]:null;
  var activePlat=detectedPlat||ctxPlat||window._chatPlat||null;

  // If no platform known — show platform picker
  if(!activePlat){
    var emrPlats=["4D","Nextech w/ P+","Nextech Cloud","Symplast","ModMed","AestheticsPro","Podium AI OS"];
    var h='<div style="max-width:500px;margin:0 auto">';
    h+='<div style="font-size:13px;color:var(--text2);margin-bottom:14px">Which platform are you asking about?</div>';
    h+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:7px">';
    emrPlats.forEach(function(p){
      var pl=PLATS.filter(function(pl){return pl.label===p;})[0];
      var bg=pl?pl.color:"#1C2B3A";
      h+='<button class="plat-pick" data-p="'+esc(p)+'" style="padding:10px 14px;border-radius:8px;border:none;background:'+bg+';color:#fff;font-size:12px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif;text-align:left">'+esc(p)+'</button>';
    });
    h+='</div>';
    h+='<button id="skip-plat" style="margin-top:12px;background:none;border:none;color:var(--text3);font-size:12px;cursor:pointer;font-family:Inter,sans-serif;padding:0">Show all platforms instead →</button>';
    h+='</div>';
    body.innerHTML=h;
    body.querySelectorAll(".plat-pick").forEach(function(btn){
      btn.addEventListener("click",function(){
        window._chatPlat=btn.getAttribute("data-p");
        render();
      });
    });
    document.getElementById("skip-plat").addEventListener("click",function(){
      window._chatPlat="__all__";render();
    });
    return;
  }

  // Reset _chatPlat on new query
  if(window._chatLastQ!==q){window._chatPlat=null;window._chatLastQ=q;}

  var showAll=(activePlat==="__all__");

  // ── BUILD CHAT RESPONSE ───────────────────────────────────────────────────────
  var h='<div>';

  // Platform badge (show which platform we're answering for)
  if(!showAll&&activePlat){
    var platObj=PLATS.filter(function(p){return p.label===activePlat;})[0];
    var platBg=platObj?platObj.color:"#1C2B3A";
    h+='<div style="display:flex;align-items:center;gap:8px;margin-bottom:14px">';
    h+='<span style="background:'+platBg+';color:#fff;border-radius:6px;padding:4px 12px;font-size:12px;font-weight:700">'+esc(activePlat)+'</span>';
    if(ctxPlat&&ctxPlat!==activePlat)h+='<button onclick="window._chatPlat=null;render();" style="background:none;border:none;font-size:11px;color:var(--text3);cursor:pointer;font-family:Inter,sans-serif">← change platform</button>';
    h+='<button class="ae-fav'+(fav?" on":"")+'" id="fav-toggle" style="margin-left:auto">'+(fav?"★":"☆")+'</button>';
    h+='</div>';
  }

  // Answer bubbles — one per matching feature
  var displayed=0;
  res.entries.slice(0,showAll?5:4).forEach(function(e){
    // Get value and notes for this platform
    var col=showAll?null:Object.keys(e.c).filter(function(k){
      if(k===activePlat)return true;
      var p=PLATS.filter(function(p){return p.label===activePlat;})[0];
      if(p&&p.keys.some(function(key){return k===key;}))return true;
      return k.toLowerCase()===activePlat.toLowerCase();
    })[0];
    if(!showAll&&!col)return;

    var ov=col?getOverride(e.s,e.f,col):null;
    var val=ov&&ov.val?ov.val:(col?e.c[col]:"");
    var note=ov&&ov.note?ov.note:(col&&e.notes?e.notes[col]:"");
    var take=ov&&ov.acgTake?ov.acgTake:"";
    var sc=getStatusClass(val);
    displayed++;

    h+='<div style="margin-bottom:14px">';

    // Feature + value line
    h+='<div style="display:flex;align-items:baseline;gap:10px;margin-bottom:6px">';
    h+='<div style="font-size:14px;font-weight:700;color:var(--navy)">'+hl(e.f,words)+'</div>';
    if(val)h+='<span class="'+sc+'" style="font-size:13px;font-weight:700">'+esc(String(val))+'</span>';
    h+='</div>';

    // ACG Take — the main answer, prominent
    if(take){
      h+='<div style="background:var(--navy);border-radius:10px;padding:12px 16px;margin-bottom:6px">';
      h+='<div style="font-size:10px;font-weight:700;color:var(--gold);letter-spacing:.6px;text-transform:uppercase;margin-bottom:4px">ACG Take</div>';
      h+='<div style="font-size:13px;color:rgba(255,255,255,.92);line-height:1.65">'+hl(take,words)+'</div>';
      h+='</div>';
    }

    // Note — secondary, lighter
    if(note&&note!==take){
      h+='<div style="font-size:12px;color:var(--text2);line-height:1.6;padding-left:2px">'+hl(String(note),words)+'</div>';
    }

    // Edit link — small, out of the way
    if(col){
      var rawVal=String(e.c[col]||"");
      var rawNote=e.notes&&e.notes[col]?e.notes[col]:"";
      h+='<button class="ae-edit-btn" data-s="'+esc(e.s)+'" data-f="'+esc(e.f)+'" data-p="'+esc(col)+'" data-v="'+esc(rawVal)+'" data-n="'+esc(rawNote)+'" data-t="'+esc(take)+'" style="margin-top:5px">✎ edit</button>';
    }
    h+='</div>';
  });

  if(displayed===0){
    // Platform exists but no data for it in these results
    h+='<div style="color:var(--text3);font-size:13px;padding:8px 0">No specific data found for '+esc(activePlat)+' on this topic. <button onclick="window._chatPlat=\'__all__\';render();" style="background:none;border:none;color:var(--blue);cursor:pointer;font-family:Inter,sans-serif;font-size:13px;padding:0">Show all platforms →</button></div>';
  }

  // MyAnna matches
  var brainMatches=brainEntries.filter(function(be){
    var hay=(be.text+" "+(be.tag||"")+" "+(be.from||"")).toLowerCase();
    return words.some(function(w){return w.length>3&&hay.indexOf(w)>=0;});
  }).slice(0,1);
  if(brainMatches.length){
    h+='<div style="background:var(--gold-bg);border:1px solid var(--gold-l);border-radius:8px;padding:10px 14px;margin-top:8px">';
    h+='<div style="font-size:10px;font-weight:700;color:var(--amber);text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px">🥷 From your notes</div>';
    h+='<div style="font-size:12px;color:var(--navy);line-height:1.55">'+hl(brainMatches[0].text,words)+'</div>';
    h+='</div>';
  }

  // Watch-outs (only for context platform, compact)
  if(!showAll&&activePlat&&(knownIssues[activePlat]||[]).length){
    var critIssues=(knownIssues[activePlat]||[]).filter(function(i){return i.sev==="Critical"||i.sev==="Significant";}).slice(0,1);
    if(critIssues.length){
      h+='<div style="background:#FFF8E1;border-left:3px solid #FDD835;border-radius:0 8px 8px 0;padding:10px 14px;margin-top:8px">';
      h+='<div style="font-size:10px;font-weight:800;color:#92400E;text-transform:uppercase;letter-spacing:.4px;margin-bottom:3px">⚠ Watch-out</div>';
      h+='<div style="font-size:12px;color:#5C3A00;line-height:1.55">'+esc(critIssues[0].issue)+'</div>';
      h+='</div>';
    }
  }

  h+='</div>';
  body.innerHTML=h;

  var ft=body.querySelector("#fav-toggle");
  if(ft)ft.addEventListener("click",function(){toggleFav(q,q);render();});
  body.querySelectorAll(".ae-edit-btn").forEach(function(btn){
    btn.addEventListener("click",function(){
      openEdit(btn.getAttribute("data-s"),btn.getAttribute("data-f"),btn.getAttribute("data-p"),btn.getAttribute("data-v"),btn.getAttribute("data-n"),btn.getAttribute("data-t"));
    });
  });
}

// ── PLATFORM SCORECARD ──────────────────────────────────────
function selectPlat(label){
  activePlat=label;
  document.querySelectorAll(".plat-btn").forEach(function(b){b.classList.toggle("on",b.getAttribute("data-label")===label);});
  render();
}

function rPlatform(body){
  if(!activePlat){
    body.innerHTML='<div class="empty"><div class="empty-icon">&#x25a3;</div><div class="empty-title">Select a Platform</div><div class="empty-sub">Tap any platform above to see its full profile with status, your ACG notes, and your recommendations.</div></div>';
    return;
  }
  var data=GD();
  var sheets={};
  for(var i=0;i<data.length;i++){
    var e=data[i];var ck=findPlatKey(e,activePlat);if(!ck)continue;
    var s=e.s;if(!sheets[s])sheets[s]={};if(!sheets[s][e.sec])sheets[s][e.sec]=[];
    var ov=getOverride(e.s,e.f,ck)||{};
    sheets[s][e.sec].push({e:e,ck:ck,val:ov.val||e.c[ck],note:ov.note||(e.notes?e.notes[ck]:""),take:ov.acgTake||"",verified:ov.verifiedBy||"",overridden:!!(ov.val||ov.note||ov.acgTake)});
  }
  var sheetKeys=Object.keys(sheets);
  if(!sheetKeys.length){body.innerHTML='<div class="no-match"><div class="no-match-title">No data found for '+esc(activePlat)+'</div></div>';return;}

  // Export button + switch bar
  var otherPlats=PLATS.filter(function(pl){return pl.label!==activePlat;}).slice(0,12);
  // Scorecard search
  var scSearch=document.getElementById("sc-search");
  var scQ=scSearch?scSearch.value.trim().toLowerCase():"";

  var h='<div style="margin-bottom:12px"><input id="sc-search" type="text" value="'+esc(scQ)+'" placeholder="&#x2315; Search within '+esc(activePlat)+'..." style="width:100%;padding:9px 14px;border-radius:8px;border:1.5px solid var(--tan2);font-size:13px;font-family:Inter,sans-serif;outline:none;background:var(--white);color:var(--text)"></div>'
  +'<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px;align-items:center;justify-content:space-between">'
    +'<div style="display:flex;gap:5px;flex-wrap:wrap;align-items:center"><span style="font-size:10px;font-weight:700;color:var(--text3);letter-spacing:.5px;margin-right:4px">SWITCH:</span>'
    +otherPlats.map(function(p){return'<button class="spill" data-switch="'+esc(p.label)+'">'+esc(p.label)+'</button>';}).join("")+'</div>'
    +'<div style="display:flex;gap:6px">'
    +'<button id="export-sc-btn" style="padding:6px 14px;border-radius:7px;border:none;background:var(--navy);color:#fff;font-size:12px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif">&#x2913; Internal PDF</button>'
    +'<button id="export-client-btn" style="padding:6px 14px;border-radius:7px;border:none;background:var(--gold);color:var(--navy);font-size:12px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif">&#x2665; Client One-Pager</button>'
    +'</div>'
    +'</div>';

  for(var si=0;si<sheetKeys.length;si++){
    var sheet=sheetKeys[si];var sheetColor=SC[sheet]||"#1C2B3A";
    var totalItems=Object.values(sheets[sheet]).reduce(function(n,a){return n+a.length;},0);
    h+='<div class="scorecard"><div class="sc-hdr" style="background:'+sheetColor+'">'
      +'<div class="sc-sheet-tag">'+(SL[sheet]||sheet)+'</div>'
      +'<div class="sc-plat">'+esc(activePlat)+'</div>'
      +'<div class="sc-sub">'+totalItems+' data points</div>'
      +'</div>';
    var secKeys=Object.keys(sheets[sheet]);
    for(var seci=0;seci<secKeys.length;seci++){
      var sec=secKeys[seci];var items=sheets[sheet][sec];var key=sheet+"|"+sec;var isC=coll[key];
      h+='<div class="sc-sec-hdr" data-key="'+esc(key)+'"><span>'+esc(sec)+'</span><span style="color:var(--text3);font-size:11px">'+(isC?"\u25b8":"\u25be")+'</span></div>';
      if(!isC){
        var filteredItems=scQ?items.filter(function(it){return it.e.f.toLowerCase().indexOf(scQ)>=0||(it.note&&it.note.toLowerCase().indexOf(scQ)>=0)||(it.take&&it.take.toLowerCase().indexOf(scQ)>=0);}):items;
        for(var ii=0;ii<filteredItems.length;ii++){
          var item=filteredItems[ii];var bc=getBadgeClass(item.val);
          var confKey=sheet+"|"+item.e.f+"|"+item.ck;
          var conf=confidence[confKey]||"unverified";
          var confDot={"verified":"#059669","unverified":"#9CA3AF","tbd":"#D97706"};
          var confLabel={"verified":"✓","unverified":"?","tbd":"!"};
          var ov2=getOverride(sheet,item.e.f,item.ck)||{};
          h+='<div class="sc-item">'
            +'<div>'
            +'<div class="sc-feat" style="display:flex;align-items:center;gap:6px">'
            +esc(item.e.f)
            +'<span title="'+conf+'" style="width:14px;height:14px;border-radius:50%;background:'+confDot[conf]+';color:#fff;font-size:8px;font-weight:800;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;cursor:pointer" class="conf-dot" data-s="'+esc(sheet)+'" data-f="'+esc(item.e.f)+'" data-p="'+esc(item.ck)+'">'+confLabel[conf]+'</span>'
            +'</div>'
            +'</div>'
            +'<div class="sc-badge '+bc+'"'+(item.overridden?' style="border-bottom:2px solid var(--blue-bd)"':'')+'>'+esc(String(item.val))+'</div>'
            +'<button class="sc-edit-btn" data-s="'+esc(sheet)+'" data-f="'+esc(item.e.f)+'" data-p="'+esc(item.ck)+'" data-v="'+esc(String(item.e.c[item.ck]||""))+'" data-n="'+esc(String(item.e.notes&&item.e.notes[item.ck]?item.e.notes[item.ck]:""))+'" data-t="'+esc(item.take)+'">&#x270e;</button>'
            +(item.note?'<div class="sc-note">'+esc(String(item.note))+'</div>':"")
            +(item.take?'<div class="sc-acg-take">'+esc(String(item.take))+'</div>':"")
            +(ov2.screenshot?'<div style="grid-column:1/-1;margin-top:6px"><img src="'+esc(ov2.screenshot)+'" style="max-width:100%;max-height:120px;border-radius:6px;border:1px solid var(--tan2)" onerror="this.style.display=\'none\'"><a href="'+esc(ov2.screenshot)+'" target="_blank" style="font-size:10px;color:var(--blue);display:block;margin-top:2px">↗ View reference</a></div>':"")
            +(item.verified?'<div class="sc-verified">&#x2713; '+esc(item.verified)+'</div>':"")
            +'</div>';
        }
      }
    }
    h+='</div>';
  }
  body.innerHTML=h;
  body.querySelectorAll(".sc-sec-hdr").forEach(function(el){el.addEventListener("click",function(){var k=el.getAttribute("data-key");coll[k]=!coll[k];render();});});
  // Scorecard search
  var scInp=body.querySelector("#sc-search");
  if(scInp){
    scInp.addEventListener("input",function(){render();});
    scInp.focus();
  }
  // Confidence dot quick-cycle
  body.querySelectorAll(".conf-dot").forEach(function(dot){
    dot.addEventListener("click",function(e){
      e.stopPropagation();
      var s=dot.getAttribute("data-s"),f=dot.getAttribute("data-f"),p=dot.getAttribute("data-p");
      var ck2=s+"|"+f+"|"+p;
      var cycle=["unverified","verified","tbd"];
      var cur=confidence[ck2]||"unverified";
      confidence[ck2]=cycle[(cycle.indexOf(cur)+1)%cycle.length];
      save(SK+"_conf",confidence);
      render();
    });
  });
  body.querySelectorAll(".sc-edit-btn").forEach(function(btn){btn.addEventListener("click",function(){openEdit(btn.getAttribute("data-s"),btn.getAttribute("data-f"),btn.getAttribute("data-p"),btn.getAttribute("data-v"),btn.getAttribute("data-n"),btn.getAttribute("data-t"));});});
  body.querySelectorAll(".spill[data-switch]").forEach(function(btn){btn.addEventListener("click",function(){selectPlat(btn.getAttribute("data-switch"));});});
  var expBtn=body.querySelector("#export-sc-btn");
  if(expBtn)expBtn.addEventListener("click",function(){exportPlatformPDF(activePlat,sheets);});
  var clientBtn=body.querySelector("#export-client-btn");
  if(clientBtn)clientBtn.addEventListener("click",function(){exportClientOnePager();});
}

// ── COMPARE MODE ────────────────────────────────────────────
function rCompare(body){
  var data=GD();
  // Get all platforms that have data
  var allPlatLabels=PLATS.map(function(p){return p.label;});

  if(comparePlats.length<2){
    var GROUPS=[
      {label:"EMR Platforms",plats:["4D","Nextech w/ P+","Nextech Cloud","Symplast","ModMed","AestheticsPro","Podium AI OS"]},
      {label:"CRM",plats:["Nextech CRM","SymplastCRM","Zone DM","Dewy","Aesthetix CRM"]},
      {label:"Phone Systems",plats:["Weave","RingCentral","Dialpad"]},
      {label:"Patient Financing",plats:["Cherry","CareCredit","PatientFi"]},
      {label:"Imaging",plats:["Touch MD","Image Assist","Canfield VECTRA","Canfield Mirror","VISIA Complexion"]},
      {label:"AI Tools",plats:["ModMed Scribe","Doximity"]}
    ];
    // Which category is active (for dropdown)
    var activeCat=window._cmpCat||GROUPS[0].label;
    var activePlatList=(GROUPS.filter(function(g){return g.label===activeCat;})[0]||GROUPS[0]).plats;
    var catOpts=GROUPS.map(function(g){return'<option value="'+esc(g.label)+'"'+(g.label===activeCat?' selected':"")+'>'+g.label+'</option>';}).join("");
    var platBtns=activePlatList.filter(function(pl){return data.some(function(e){return findPlatKey(e,pl);});}).map(function(pl){
      var isSel=comparePlats.indexOf(pl)>=0;
      var selNum=comparePlats.indexOf(pl)+1;
      return'<button class="cmp-pick-btn" data-cmp="'+esc(pl)+'" style="'
        +'display:flex;align-items:center;justify-content:space-between;width:100%;'
        +'padding:11px 16px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;font-family:Inter,sans-serif;text-align:left;'
        +'border:2px solid '+(isSel?'#C9A84C':'var(--tan2)')+';'
        +'background:'+(isSel?'#C9A84C':'var(--white)')+';'
        +'color:'+(isSel?'#1C2B3A':'var(--navy)')+';'
        +'transition:all .15s;">'
        +'<span>'+esc(pl)+'</span>'
        +(isSel?'<span style="background:#1C2B3A;color:#C9A84C;border-radius:10px;padding:1px 8px;font-size:10px">#'+selNum+'</span>':'<span style="color:var(--tan2);font-size:16px">+</span>')
        +'</button>';
    }).join("");
    body.innerHTML='<div style="max-width:460px;margin:0 auto">'
      +'<div style="font-family:Playfair Display,serif;font-size:20px;font-weight:600;color:var(--navy);margin-bottom:4px">Compare Two Platforms</div>'
      +'<div style="font-size:13px;color:var(--text2);margin-bottom:20px">Select a category, then choose two platforms to compare side by side.</div>'
      // Step 1: category dropdown
      +'<div style="margin-bottom:16px">'
      +'<label style="font-size:10px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;color:var(--text3);display:block;margin-bottom:6px">Category</label>'
      +'<select id="cmp-cat-sel" style="width:100%;padding:11px 14px;border-radius:8px;border:2px solid var(--tan2);font-size:14px;font-weight:600;font-family:Inter,sans-serif;color:var(--navy);background:var(--white);outline:none;cursor:pointer">'+catOpts+'</select>'
      +'</div>'
      // Step 2: platform list
      +'<div>'
      +'<label style="font-size:10px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;color:var(--text3);display:block;margin-bottom:8px">Select platforms <span style="font-weight:400;color:var(--text3)">(choose two)</span></label>'
      +'<div id="cmp-plat-list" style="display:flex;flex-direction:column;gap:8px">'+platBtns+'</div>'
      +'</div>'
      +(comparePlats.length===1
        ?'<div style="margin-top:16px;padding:12px 16px;background:var(--gold-bg);border:1px solid var(--gold-l);border-radius:8px;font-size:13px;color:var(--amber);font-weight:600">'
          +'✓ <b>'+esc(comparePlats[0])+'</b> selected — now pick a second platform'
          +(GROUPS.some(function(g){return g.plats.indexOf(comparePlats[0])>=0&&g.label!==activeCat;})?'<div style="font-size:11px;font-weight:400;margin-top:3px;color:var(--text3)">You can switch categories to compare across different types</div>':'')
          +'</div>'
        :"")
      +'</div>';
    // Category dropdown listener
    var catSel=body.querySelector("#cmp-cat-sel");
    if(catSel)catSel.addEventListener("change",function(){window._cmpCat=this.value;render();});
    body.querySelectorAll(".cmp-pick-btn[data-cmp]").forEach(function(btn){
      btn.addEventListener("click",(function(b){
        return function(){
          var pl=b.getAttribute("data-cmp");
          var idx=comparePlats.indexOf(pl);
          if(idx>=0){comparePlats.splice(idx,1);}
          else if(comparePlats.length<2){comparePlats.push(pl);}
          if(comparePlats.length===2)render();
          else render();
        };
      })(btn));
    });
    return;
  }

  var p1=comparePlats[0],p2=comparePlats[1];
  // Map category to relevant sheets
  var CAT_SHEETS={
    "EMR Platforms":["Dashboard","Detail Notes"],
    "CRM":["CRM Comparison"],
    "Phone Systems":["Phone Systems"],
    "Patient Financing":["Patient Financing"],
    "Imaging":["Imaging & Photography"],
    "AI Tools":["AI Tools"]
  };
  var activeCat2=window._cmpCat||"EMR Platforms";
  var allowedSheets=CAT_SHEETS[activeCat2]||Object.keys(ST);
  var sheetKeys=Object.keys(ST).filter(function(s){return allowedSheets.indexOf(s)>=0;});
  var h='<div style="margin-bottom:14px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px">'
    +'<div style="font-family:Playfair Display,serif;font-size:20px;font-weight:600;color:var(--navy)">'+esc(p1)+' <span style="color:var(--text3);font-size:16px">vs</span> '+esc(p2)+'</div>'
    +'<div style="display:flex;gap:8px">'
    +'<button id="cmp-reset" style="padding:6px 14px;border-radius:7px;border:1px solid var(--tan2);background:transparent;font-size:12px;cursor:pointer;font-family:Inter,sans-serif;color:var(--text2)">&#x21ba; Change</button>'
    +'<button id="cmp-pdf" style="padding:6px 14px;border-radius:7px;border:none;background:var(--navy);color:#fff;font-size:12px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif">&#x2913; Export PDF</button>'
    +'</div></div>';

  for(var si=0;si<sheetKeys.length;si++){
    var sheet=sheetKeys[si];var sections=ST[sheet]||[];var sc=SC[sheet]||"#1C2B3A";
    h+='<div class="sblock" style="margin-bottom:16px">'
      +'<div class="shd" style="background:'+sc+';grid-template-columns:1fr 1fr 1fr;display:grid">'
      +'<span style="font-size:10px;font-weight:700;letter-spacing:.5px;text-transform:uppercase">'+(SL[sheet]||sheet)+'</span>'
      +'<span style="text-align:center;font-size:12px;font-weight:700">'+esc(p1)+'</span>'
      +'<span style="text-align:center;font-size:12px;font-weight:700">'+esc(p2)+'</span>'
      +'</div>';

    for(var seci=0;seci<sections.length;seci++){
      var sec=sections[seci];
      var secItems=data.filter(function(e){return e.s===sheet&&e.sec===sec;});
      if(!secItems.length)continue;
      var hasData=secItems.some(function(e){return findPlatKey(e,p1)||findPlatKey(e,p2);});
      if(!hasData)continue;
      var key2=sheet+"|"+sec+"|cmp";var isColl=coll[key2];
      h+='<div class="sech" data-key="'+esc(key2)+'"><span>'+esc(sec)+'</span><span style="color:var(--text3);font-size:11px">'+(isColl?"▸":"▾")+'</span></div>';
      if(!isColl){
        for(var ei2=0;ei2<secItems.length;ei2++){
          var e=secItems[ei2];
          var ck1=findPlatKey(e,p1),ck2=findPlatKey(e,p2);
          if(!ck1&&!ck2)continue;
          var ov1=ck1?(getOverride(sheet,e.f,ck1)||{}):null;
          var ov2b=ck2?(getOverride(sheet,e.f,ck2)||{}):null;
          var v1=ov1&&ov1.val?ov1.val:(ck1?e.c[ck1]:"—");
          var v2=ov2b&&ov2b.val?ov2b.val:(ck2?e.c[ck2]:"—");
          var n1=ov1&&ov1.note?ov1.note:(ck1&&e.notes?e.notes[ck1]:"");
          var n2=ov2b&&ov2b.note?ov2b.note:(ck2&&e.notes?e.notes[ck2]:"");
          var t1=ov1&&ov1.acgTake?ov1.acgTake:"";
          var t2=ov2b&&ov2b.acgTake?ov2b.acgTake:"";
          var same=String(v1).toLowerCase()===String(v2).toLowerCase();
          h+='<div style="display:grid;grid-template-columns:1fr 1fr 1fr;border-bottom:1px solid #F5EFE8;background:'+(same?"#fff":"#FFFBF0")+'">'
            +'<div style="padding:10px 14px;font-size:12px;font-weight:600;color:var(--navy);border-right:1px solid #F5EFE8">'+esc(e.f)+(same?"":' <span style="color:var(--gold);font-size:9px;font-weight:800">DIFF</span>')+'</div>'
            +'<div style="padding:10px 14px;border-right:1px solid #F5EFE8">'
            +'<div class="'+getBadgeClass(v1)+'" style="display:inline-block;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700;margin-bottom:'+(n1||t1?"4px":"0")+'">'+esc(String(v1))+'</div>'
            +(n1?'<div style="font-size:11px;color:#4A3A1A;line-height:1.5;background:var(--gold-bg);padding:5px 8px;border-radius:4px;border-left:2px solid var(--gold)">'+esc(n1.slice(0,120))+(n1.length>120?"…":"")+'</div>':"")
            +(t1?'<div style="font-size:11px;color:var(--blue);line-height:1.5;margin-top:4px;font-style:italic">'+esc(t1.slice(0,100))+(t1.length>100?"…":"")+'</div>':"")
            +'</div>'
            +'<div style="padding:10px 14px">'
            +'<div class="'+getBadgeClass(v2)+'" style="display:inline-block;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700;margin-bottom:'+(n2||t2?"4px":"0")+'">'+esc(String(v2))+'</div>'
            +(n2?'<div style="font-size:11px;color:#4A3A1A;line-height:1.5;background:var(--gold-bg);padding:5px 8px;border-radius:4px;border-left:2px solid var(--gold)">'+esc(n2.slice(0,120))+(n2.length>120?"…":"")+'</div>':"")
            +(t2?'<div style="font-size:11px;color:var(--blue);line-height:1.5;margin-top:4px;font-style:italic">'+esc(t2.slice(0,100))+(t2.length>100?"…":"")+'</div>':"")
            +'</div>'
            +'</div>';
        }
      }
    }
    h+='<div class="sft" style="background:'+sc+'"></div></div>';
  }

  body.innerHTML=h;
  body.querySelectorAll(".sech[data-key]").forEach(function(el){el.addEventListener("click",function(){var k=el.getAttribute("data-key");coll[k]=!coll[k];render();});});
  var rBtn=body.querySelector("#cmp-reset");
  if(rBtn)rBtn.addEventListener("click",function(){comparePlats=[];render();});
  var pdfBtn=body.querySelector("#cmp-pdf");
  if(pdfBtn)pdfBtn.addEventListener("click",function(){exportComparePDF(p1,p2);});
}

// ── CHANGELOG ──────────────────────────────────────────────
function rChangelogPanel(body){
  if(!changelog.length){
    body.innerHTML='<div class="empty"><div class="empty-icon">&#x29d6;</div><div class="empty-title">No changes yet</div><div class="empty-sub">Every time you edit a value, note, or ACG Take, it will appear here with who made the change, when, and why.</div></div>';
    return;
  }
  var h='<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">'
    +'<div style="font-size:13px;font-weight:700;color:var(--navy)">'+changelog.length+' change'+(changelog.length!==1?"s":"")+'</div>'
    +'<button id="cl-clear" style="padding:5px 12px;border-radius:6px;border:1px solid var(--red-bd);background:var(--red-bg);color:var(--red);font-size:11px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif">Clear all</button>'
    +'</div>';
  for(var i=0;i<Math.min(changelog.length,50);i++){
    var c=changelog[i];
    h+='<div class="cl-entry">'
      +'<div class="cl-header"><div class="cl-who">'+esc(c.who||"Unknown")+'</div><div class="cl-when">'+timeAgo(c.when)+'</div></div>'
      +'<div class="cl-plat">'+(SL[c.sheet]||c.sheet)+' \u00b7 '+esc(c.platform)+'</div>'
      +'<div class="cl-feature">'+esc(c.feature)+'</div>'
      +'<div class="cl-change">'
      +(c.oldVal?'<span class="cl-old">'+esc(String(c.oldVal).slice(0,40))+'</span><span class="cl-arrow">\u2192</span>':''  )
      +'<span class="cl-new">'+esc(String(c.newVal||"").slice(0,60))+'</span>'
      +'</div>'
      +(c.reason?'<div class="cl-note">'+esc(c.reason)+'</div>':"")
      +'</div>';
  }
  body.innerHTML=h;
  var clr=body.querySelector("#cl-clear");
  if(clr)clr.addEventListener("click",function(){if(confirm("Clear all change history?")){changelog=[];save(SK+"_changelog",changelog);rChangelogPanel(body);}});
}

// ── FAVORITES ──────────────────────────────────────────────
function rFavorites(body){
  if(!favorites.length){
    body.innerHTML='<div class="empty"><div class="empty-icon">&#x2605;</div><div class="empty-title">No favorites yet</div><div class="empty-sub">In Ask mode, tap the &#x2606; Save button next to any search to save it here for one-tap access on your next call.</div></div>';
    return;
  }
  var h='<div style="font-size:13px;font-weight:700;color:var(--navy);margin-bottom:12px">Saved searches</div>';
  for(var i=0;i<favorites.length;i++){
    var f=favorites[i];
    h+='<div class="fav-card" data-q="'+esc(f.query)+'">'
      +'<div><div class="fav-name">'+esc(f.label||f.query)+'</div><div class="fav-meta">'+esc(f.query)+'</div></div>'
      +'<button class="fav-remove" data-q="'+esc(f.query)+'">&#xd7;</button>'
      +'</div>';
  }
  body.innerHTML=h;
  body.querySelectorAll(".fav-card").forEach(function(card){
    card.addEventListener("click",function(e){
      if(e.target.classList.contains("fav-remove"))return;
      var q=card.getAttribute("data-q");
      document.getElementById("ask-inp").value=q;SV("ask");
    });
  });
  body.querySelectorAll(".fav-remove").forEach(function(btn){
    btn.addEventListener("click",function(e){e.stopPropagation();var q=btn.getAttribute("data-q");favorites=favorites.filter(function(f){return f.query!==q;});save(SK+"_favs",favorites);render();});
  });
}

// ── SETTINGS ──────────────────────────────────────────────
function rSettings(body){
  var sheetConnected=!!settings.sheetUrl;
  body.innerHTML='<div class="setting-block"><div class="setting-title">Your Profile</div>'
    +'<div class="setting-row"><label>Your name</label><input id="s-name" class="s-inp" type="text" value="'+esc(settings.name||"")+'"><button class="s-btn" id="s-name-save">Save</button></div>'
    +'<button class="s-btn" id="s-switch-user" style="margin-top:6px">Switch User</button>'
    +'</div>'
    +'<div class="setting-block"><div class="setting-title">Azure Function Sync</div>'
    +(sheetConnected
      ?'<div style="background:var(--green-bg);border:1px solid var(--green-bd);border-radius:7px;padding:10px 14px;margin-bottom:12px;font-size:12px;color:var(--green)">&#x2713; Connected</div>'
      :'<div style="font-size:12px;color:var(--text2);margin-bottom:10px;line-height:1.6">Paste your Azure Function URL to sync data across all devices and enable AI features.</div>'
    )
    +'<div class="setting-row"><label>Azure Function URL</label><input id="s-sheet" class="s-inp" type="text" value="'+esc(settings.sheetUrl||"")+'" placeholder="https://acgcsiapi-xxx.azurewebsites.net/api/sync"><button class="s-btn" id="s-sheet-save">Connect</button></div>'
    +'<div id="sheet-status" style="font-size:12px;margin-top:6px">'+(sheetConnected?'<span style="color:#059669;font-weight:600">&#x2713; Connected</span>':'<span style="color:var(--text3)">Not connected</span>')+'</div>'
    +(sheetConnected?'<button class="s-btn danger" id="s-sheet-clear" style="margin-top:8px">Disconnect</button>':"")
    +'</div>'
    +'<div class="setting-block"><div class="setting-title">Clients</div>'
    +'<div style="font-size:12px;color:var(--text2);margin-bottom:10px">Practice names used in Training Path PDFs and client dropdowns.</div>'
    +'<div id="clients-list"></div>'
    +'<div style="display:flex;gap:8px;margin-top:10px"><input id="s-new-client" class="s-inp" type="text" placeholder="Practice name..." style="flex:1"><button class="s-btn" id="s-add-client">+ Add</button></div>'
    +'</div>'
    +'<div class="setting-block"><div class="setting-title">Data</div>'
    +'<div style="font-size:12px;color:var(--text2);margin-bottom:10px">'+DB.length+' base data points &nbsp;&#183;&nbsp; '+cust.length+' added items &nbsp;&#183;&nbsp; '+Object.keys(overrides).length+' edits &nbsp;&#183;&nbsp; '+changelog.length+' changelog entries</div>'
    +'<div style="display:flex;gap:8px;flex-wrap:wrap">'
    +'<button class="export-btn gold" id="exp-all">&#x2913; Export all data (CSV)</button>'
    +'<button class="export-btn" id="exp-client" style="background:var(--gold);color:var(--navy)">&#x2665; Client One-Pager</button>'
    +'<button class="s-btn danger" id="clear-all-btn">Clear all local data</button>'
    +'</div></div>'
    +'<div class="setting-block"><div class="setting-title">Custom Utilization Questions</div><div id="cu-container"></div></div>'
    +'<div class="setting-block"><div class="setting-title">Saved Practice Notes</div>'
    +(Object.keys(scratchPads).length
      ?Object.keys(scratchPads).map(function(k){return'<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--tan)"><div style="font-size:13px;font-weight:600;color:var(--navy)">'+esc(k)+'</div><div style="display:flex;gap:6px"><button class="s-btn" data-load="'+esc(k)+'">Load</button><button class="s-btn danger" data-del="'+esc(k)+'">Delete</button></div></div>';}).join("")
      :'<div style="font-size:13px;color:var(--text3)">No practice notes saved yet. Use the Notes pad during a call.</div>'
    )+'</div>'
    +'<div class="setting-block"><div class="setting-title" style="display:flex;justify-content:space-between;align-items:center;cursor:pointer" id="settings-add-toggle">'
    +'<span>+ Add New Item</span><span id="settings-add-arrow" style="color:var(--gold)">&#x25be;</span></div>'
    +'<div id="settings-add-panel" style="display:none;margin-top:12px"></div></div>'
    +'<div class="setting-block"><div class="setting-title" style="display:flex;justify-content:space-between;align-items:center;cursor:pointer" id="settings-cl-toggle">'
    +'<span>&#x29d6; Changelog'+(changelog.length?' <span style="background:var(--gold);color:var(--navy);border-radius:10px;padding:1px 8px;font-size:11px;font-weight:700;margin-left:6px">'+changelog.length+'</span>':'')+'</span><span id="settings-cl-arrow" style="color:var(--gold)">&#x25be;</span></div>'
    +'<div id="settings-cl-panel" style="display:none;margin-top:12px"></div></div>';

  var ns=body.querySelector("#s-name-save");
  if(ns)ns.addEventListener("click",function(){settings.name=document.getElementById("s-name").value.trim()||"Anna";save(SK+"_settings",settings);ns.textContent="\u2713 Saved";setTimeout(function(){ns.textContent="Save";},1500);});
  var su=body.querySelector("#s-switch-user");
  if(su)su.addEventListener("click",function(){
    if(confirm("Switch to a different user? You'll be asked to enter a name on next load.")){
      save(SK+"_login_done",false);
      location.reload();
    }
  });
  var ss=body.querySelector("#s-sheet-save");
  if(ss)ss.addEventListener("click",function(){
    var url=document.getElementById("s-sheet").value.trim();
    settings.sheetUrl=url;
    SHEET_URL=url;
    save(SK+"_settings",settings);
    // Update button feedback without re-rendering (render() was resetting the field visually)
    ss.textContent=url?"✓ Connected":"✓ Cleared";
    ss.style.background="#059669";
    setTimeout(function(){ss.textContent=url?"Connect":"Clear";ss.style.background="";},2000);
    // Update connection status indicator in place
    var statusEl=document.getElementById("sheet-status");
    if(statusEl)statusEl.innerHTML=url
      ?'<span style="color:#059669;font-weight:600">&#x2713; Connected</span>'
      :'<span style="color:var(--text3)">Not connected</span>';
    if(url)setTimeout(loadFromSheet,200);
  });
  var sc=body.querySelector("#s-sheet-clear");
  if(sc)sc.addEventListener("click",function(){settings.sheetUrl="";SHEET_URL="";save(SK+"_settings",settings);render();});
  // ── Client management ──────────────────────────────────────────────────────
  function renderClientsList(){
    var cl=body.querySelector("#clients-list");
    if(!cl)return;
    if(!settings.clients)settings.clients=[];
    var html="";
    settings.clients.forEach(function(c,i){
      html+='<div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--tan)">';
      html+='<span style="flex:1;font-size:13px;font-weight:600;color:var(--navy)">'+esc(c)+'</span>';
      html+='<button class="s-btn danger s-del-client" data-idx="'+i+'" style="padding:4px 10px;font-size:11px">Remove</button></div>';
    });
    if(!settings.clients.length)html='<div style="font-size:12px;color:var(--text3);padding:6px 0">No clients added yet.</div>';
    cl.innerHTML=html;
    cl.querySelectorAll(".s-del-client").forEach(function(btn){
      btn.addEventListener("click",function(){
        var idx=parseInt(this.dataset.idx);
        settings.clients.splice(idx,1);
        save(SK+"_settings",settings);
        renderClientsList();
      });
    });
  }
  renderClientsList();
  var addClientBtn=body.querySelector("#s-add-client");
  if(addClientBtn)addClientBtn.addEventListener("click",function(){
    var inp=document.getElementById("s-new-client");
    var val=inp.value.trim();
    if(!val)return;
    if(!settings.clients)settings.clients=[];
    if(settings.clients.indexOf(val)<0){
      settings.clients.push(val);
      save(SK+"_settings",settings);
    }
    inp.value="";
    renderClientsList();
  });
  // Allow Enter key on client input
  var ci=body.querySelector("#s-new-client");
  if(ci)ci.addEventListener("keydown",function(e){if(e.key==="Enter")addClientBtn&&addClientBtn.click();});
  var ca=body.querySelector("#clear-all-btn");
  if(ca)ca.addEventListener("click",function(){if(confirm("Clear ALL local data including edits, changelog, and added items? This cannot be undone.")){cust=[];overrides={};changelog=[];favorites=[];editHistory={};confidence={};scratchPads={};save(SK+"_cust",cust);save(SK+"_overrides",overrides);save(SK+"_changelog",changelog);save(SK+"_favs",favorites);save(SK+"_hist",editHistory);save(SK+"_conf",confidence);save(SK+"_scratch",scratchPads);render();}});
  var ea=body.querySelector("#exp-all");
  if(ea)ea.addEventListener("click",exportAllCSV);
  // Render known issues inline
  var cuc=body.querySelector("#cu-container");
  if(cuc)renderCustomUtilQ(cuc);
  // Add panel toggle
  var addToggle=body.querySelector("#settings-add-toggle");
  var addPanel=body.querySelector("#settings-add-panel");
  var addArrow=body.querySelector("#settings-add-arrow");
  if(addToggle)addToggle.addEventListener("click",function(){
    var showing=addPanel.style.display==="block";
    addPanel.style.display=showing?"none":"block";
    addArrow.innerHTML=showing?"&#x25be;":"&#x25b4;";
    if(!showing)rAddPanel(addPanel);
  });
  // Changelog panel toggle
  var clToggle=body.querySelector("#settings-cl-toggle");
  var clPanel=body.querySelector("#settings-cl-panel");
  var clArrow=body.querySelector("#settings-cl-arrow");
  if(clToggle)clToggle.addEventListener("click",function(){
    var showing=clPanel.style.display==="block";
    clPanel.style.display=showing?"none":"block";
    clArrow.innerHTML=showing?"&#x25be;":"&#x25b4;";
    if(!showing)rChangelogPanel(clPanel);
  });
  var ec=body.querySelector("#exp-client");
  if(ec)ec.addEventListener("click",exportClientOnePager);
  body.querySelectorAll("[data-load]").forEach(function(btn){
    btn.addEventListener("click",function(){
      var key=btn.getAttribute("data-load");
      practiceCtx.name=key;
      save(SK+"_ctx",practiceCtx);
      updateCtxBar();
      scratchVisible=true;
      var st=document.getElementById("scratch-text");
      if(st){st.dataset.loaded="";updateScratchPad();}
      SV("ask");
    });
  });
  body.querySelectorAll("[data-del]").forEach(function(btn){
    btn.addEventListener("click",function(){
      var key=btn.getAttribute("data-del");
      delete scratchPads[key];
      save(SK+"_scratch",scratchPads);
      render();
    });
  });
}

// ── BROWSE ──────────────────────────────────────────────────
function rBrowse(body){
  var h="";var shts=Object.keys(ST);
  for(var si=0;si<shts.length;si++){
    var sheet=shts[si];var sections=ST[sheet];var data=GD();
    var cnt=0;for(var di=0;di<data.length;di++){if(data[di].s===sheet)cnt++;}
    var sc=SC[sheet]||"#1C2B3A";
    h+='<div class="bb"><div class="bh" style="background:'+sc+'"><span>'+(SL[sheet]||sheet)+'</span><span style="opacity:.5;font-size:9px">'+cnt+' items</span></div>';
    for(var seci=0;seci<sections.length;seci++){
      var sec=sections[seci];var c2=0;for(var di2=0;di2<data.length;di2++){if(data[di2].s===sheet&&data[di2].sec===sec)c2++;}
      var cols=(CP[sheet]||[]).slice(0,5).join(" \u00b7 ")+((CP[sheet]||[]).length>5?" \u00b7 ...":"");
      h+='<div class="brow" data-sec="'+esc(sec)+'"><div><div class="brn">'+esc(sec)+'</div><div class="brc">'+esc(cols)+'</div></div><div style="display:flex;align-items:center;gap:8px"><span class="bct">'+c2+'</span><span style="color:var(--gold);font-size:14px">\u2192</span></div></div>';
    }
    h+='<div class="bft" style="background:'+sc+'"></div></div>';
  }
  body.innerHTML=h;
  body.querySelectorAll(".brow").forEach(function(row){
    row.addEventListener("click",function(){var sec=row.getAttribute("data-sec");document.getElementById("ask-inp").value=sec.toLowerCase();SV("ask");});
  });
}

// ── ADD ─────────────────────────────────────────────────────
function saveEntry(panelEl){
  if(!AF.feature.trim()||!AF.section.trim())return;
  var cols={};var keys=Object.keys(AF.cols);for(var i=0;i<keys.length;i++)cols[keys[i]]=AF.cols[keys[i]];
  var entry={s:AF.sheet,sec:AF.section.trim().toUpperCase(),f:AF.feature.trim(),c:cols,custom:true,ts:Date.now()};
  cust.push(entry);save(SK+"_cust",cust);
  AF.feature="";AF.cols={};
  var btn=document.getElementById("svbtn");
  if(btn){btn.textContent="Saved!";btn.classList.add("sv");setTimeout(function(){btn.textContent="Save to Database";btn.classList.remove("sv");},2000);}
  if(SHEET_URL)pushCustom(entry);
  if(panelEl)rAddPanel(panelEl);else render();
}
function delCust(i){cust.splice(i,1);save(SK+"_cust",cust);render();}
function syncToSheet(payload,cb){
  if(!SHEET_URL)return;
  fetch(SHEET_URL,{
    method:"POST",mode:"cors",
    headers:{"Content-Type":"text/plain"},
    body:JSON.stringify(payload)
  }).then(function(){if(cb)cb(true);}).catch(function(){if(cb)cb(false);});
}

function pushOverride(sheet,feature,platform,data){
  syncToSheet({action:"override",sheet:sheet,feature:feature,platform:platform,data:JSON.stringify(data),ts:Date.now()});
}
function pushChangelog(entry){
  syncToSheet({action:"changelog",who:entry.who,when:entry.when,sheet:entry.sheet,feature:entry.feature,platform:entry.platform,field:entry.field,oldVal:entry.oldVal,newVal:entry.newVal,reason:entry.reason});
}
function pushFavorite(fav,remove){
  syncToSheet({action:"favorite",query:fav.query,label:fav.label||fav.query,remove:remove?1:0});
}
function pushCustom(entry){
  syncToSheet({action:"add",sheet:entry.s,section:entry.sec,feature:entry.f,cols:JSON.stringify(entry.c),ts:entry.ts});
}

function loadFromSheet(){
  if(!SHEET_URL)return;
  var ind=document.getElementById("sync-ind");
  if(ind){ind.textContent="↻ syncing...";ind.style.color="rgba(255,255,255,.4)";}
  fetch(SHEET_URL+"?action=getall",{mode:"cors"})
    .then(function(r){return r.json();})
    .then(function(resp){
      var changed=false;

      // Custom entries
      if(resp.items&&resp.items.length){
        var existingKeys=cust.map(function(c){return c.f+"|"+c.sec;});
        for(var i=0;i<resp.items.length;i++){
          var row=resp.items[i];
          if(existingKeys.indexOf(row.f+"|"+row.sec)<0){cust.push(row);changed=true;}
        }
        if(changed)save(SK+"_cust",cust);
      }

      // Overrides
      if(resp.overrides&&resp.overrides.length){
        for(var oi=0;oi<resp.overrides.length;oi++){
          var ov=resp.overrides[oi];
          var okey=overrideKey(ov.sheet,ov.feature,ov.platform);
          var existing=overrides[okey];
          // Only apply if remote is newer or local doesn't exist
          if(!existing||!existing.updatedAt||(ov.ts&&ov.ts>existing.updatedAt)){
            try{
              var parsed=JSON.parse(ov.data);
              overrides[okey]=Object.assign({},overrides[okey]||{},parsed,{updatedAt:ov.ts});
              changed=true;
            }catch(e){}
          }
        }
        if(changed)save(SK+"_overrides",overrides);
      }

      // Changelog (merge - avoid duplicates by timestamp+feature)
      if(resp.changelog&&resp.changelog.length){
        var existingTs=changelog.map(function(c){return c.when+"|"+c.feature;});
        for(var ci=0;ci<resp.changelog.length;ci++){
          var ce=resp.changelog[ci];
          if(existingTs.indexOf(ce.when+"|"+ce.feature)<0){
            changelog.push(ce);changed=true;
          }
        }
        if(changed){changelog.sort(function(a,b){return b.when-a.when;});save(SK+"_changelog",changelog);}
      }

      // Brain entries
      if(resp.brain&&resp.brain.length){
        var existingIds=brainEntries.map(function(b){return b.id;});
        for(var bi=0;bi<resp.brain.length;bi++){
          var be=resp.brain[bi];
          be.faq=!!(be.faq&&be.faq!=="0"&&be.faq!==0);
          if(existingIds.indexOf(be.id)<0){
            brainEntries.push(be);changed=true;
          } else {
            var local=brainEntries.filter(function(b){return b.id===be.id;})[0];
            if(local&&be.promoted&&!local.promoted){local.promoted=be.promoted;local.status=be.status;changed=true;}
            if(local&&be.faq&&!local.faq){local.faq=true;local.faqTitle=be.faqTitle||local.faqTitle;changed=true;}
          }
        }
        if(changed){brainEntries.sort(function(a,b){return b.ts-a.ts;});save(SK+"_brain",brainEntries);}
      }

      // Custom utilization questions
      if(resp.customutil&&resp.customutil.length){
        var existingQs=customUtilQ.map(function(c){return c.q;});
        for(var cui=0;cui<resp.customutil.length;cui++){
          try{
            var cuq=JSON.parse(resp.customutil[cui].q);
            if(existingQs.indexOf(cuq.q)<0){customUtilQ.push(cuq);changed=true;}
          }catch(e){}
        }
        if(changed)save(SK+"_customutil",customUtilQ);
      }

      // Favorites
      if(resp.favorites&&resp.favorites.length){
        for(var fi=0;fi<resp.favorites.length;fi++){
          var fv=resp.favorites[fi];
          if(!fv.remove&&!favorites.some(function(f){return f.query===fv.query;})){
            favorites.push({query:fv.query,label:fv.label||fv.query});changed=true;
          }
        }
        if(changed)save(SK+"_favs",favorites);
      }

      // Profiles
      if(resp.profiles&&resp.profiles.length){
        var existingProfileIds=profiles.map(function(p){return p.id;});
        resp.profiles.forEach(function(p){
          if(!existingProfileIds.some(function(id){return id===p.id;})){
            profiles.push(p);changed=true;
          } else {
            var local=profiles.filter(function(x){return x.id===p.id;})[0];
            if(local&&p.updated&&(!local.updated||p.updated>local.updated)){
              Object.assign(local,p);changed=true;
            }
          }
        });
        if(changed)save(SK+"_profiles",profiles);
      }

      // Global releases
      if(resp.releases&&resp.releases.length){
        var existingRelIds=globalReleases.map(function(r){return r.id;});
        resp.releases.forEach(function(r){
          if(!existingRelIds.some(function(id){return id===r.id;})){
            // Reconstruct release object from Azure fields
            var rel={
              id:r.id,
              platform:r.platform,
              version:r.version||"",
              parsed:r.parsed===1||r.parsed===true,
              created:r.created,
              updated:r.updated||r.created,
              rawText:r.rawText||"",
              matchedProfiles:[],
              items:[]
            };
            try{if(r.matchedProfiles)rel.matchedProfiles=JSON.parse(r.matchedProfiles);}catch(e){}
            try{if(r.items)rel.items=JSON.parse(r.items);}catch(e){}
            globalReleases.push(rel);changed=true;
          }
        });
        if(changed)save(SK+"_grec",globalReleases);
      }

      // Help articles
      if(resp.help&&resp.help.length){
        var existingHelpIds=helpArticles.map(function(a){return a.id;});
        resp.help.forEach(function(a){
          if(!existingHelpIds.some(function(id){return id===a.id;})){
            var art={
              id:a.id,
              title:a.title||"",
              category:a.category||"",
              body:a.body||"",
              author:a.author||"",
              clientReady:a.clientReady===1||a.clientReady===true,
              published:a.published===1||a.published===true,
              created:a.created||Date.now(),
              updated:a.updated||Date.now(),
              tags:[]
            };
            try{if(a.tags)art.tags=JSON.parse(a.tags);}catch(e){}
            helpArticles.push(art);changed=true;
          }
        });
        if(changed)save(SK+"_help",helpArticles);
      }

      // Training paths
      if(resp.paths&&resp.paths.length){
        var existingPathIds=helpPaths.map(function(p){return p.id;});
        resp.paths.forEach(function(p){
          if(!existingPathIds.some(function(id){return id===p.id;})){
            helpPaths.push(p);changed=true;
          }
        });
        if(changed)save(SK+"_paths",helpPaths);
      }

      if(ind){ind.textContent="✓ synced";ind.style.color="var(--gold)";setTimeout(function(){if(ind)ind.textContent="";},3000);}
      if(changed)render();
    })
    .catch(function(){
      if(ind){ind.textContent="⚠ sync unavailable";ind.style.color="rgba(255,255,255,.3)";setTimeout(function(){if(ind)ind.textContent="";},4000);}
    });
}

function rAddPanel(body){
  var sheet=AF.sheet;var secs=ST[sheet]||[];var cols=CP[sheet]||[];
  var chips=secs.map(function(s){return'<button class="cp'+(AF.section===s?" on":"")+'" data-sec="'+esc(s)+'">'+esc(s)+'</button>';}).join("");
  var cfs=cols.map(function(col){return'<label><div class="cfl">'+esc(col)+'</div><input class="cfi" type="text" value="'+esc(AF.cols[col]||"")+'" data-col="'+esc(col)+'" placeholder="Yes / No / Partial..."></label>';}).join("");
  var myH="";
  if(cust.length){
    var rows=cust.map(function(e,i){
      var vs=Object.keys(e.c).filter(function(k){return e.c[k];}).map(function(k){return'<div style="font-size:11px;color:var(--text2);margin-top:1px"><b style="color:var(--text3)">'+esc(k)+':</b> '+esc(String(e.c[k]))+'</div>';}).join("");
      return'<div style="border:1.5px solid var(--amber-bd);border-radius:8px;padding:11px 14px;margin-bottom:8px;background:var(--gold-bg);display:flex;justify-content:space-between;align-items:flex-start"><div style="flex:1"><div style="font-size:12px;font-weight:700;color:var(--amber);margin-bottom:2px">'+esc(e.f)+'</div><div style="font-size:11px;color:var(--text3);margin-bottom:4px">'+(SL[e.s]||e.s)+' \u203a '+esc(e.sec)+'</div>'+vs+'</div><button class="db" data-ci="'+i+'">\u00d7</button></div>';
    }).join("");
    myH='<div class="ac"><div style="font-family:Playfair Display,serif;font-size:16px;font-weight:600;color:var(--navy);margin-bottom:14px">My Added Items ('+cust.length+')</div>'+rows+'</div>';
  }
  var opts=Object.keys(SL).map(function(k){return'<option value="'+k+'"'+(k===sheet?" selected":"")+'>'+SL[k]+'</option>';}).join("");
  body.innerHTML='<div class="ac"><div class="at">Add a new item</div>'
    +'<div class="fg"><label class="fl">Sheet</label><select id="asheet" class="fsel">'+opts+'</select></div>'
    +'<div class="fg"><label class="fl">Section</label><div class="cps" id="achips">'+chips+'</div><input id="asec" class="fi" type="text" value="'+esc(AF.section)+'" placeholder="Or type a new section..."></div>'
    +'<div class="fg"><label class="fl">Feature / Row Label *</label><input id="afeat" class="fi" type="text" value="'+esc(AF.feature)+'" placeholder="e.g. Acuity Scheduling Integration"></div>'
    +'<div class="fg"><label class="fl">Values per Platform</label><div class="cg" id="acols">'+cfs+'</div></div>'
    +'<button id="svbtn" class="svb">Save to Database</button></div>'+myH;
  document.getElementById("asheet").addEventListener("change",function(){AF={sheet:this.value,section:"",feature:"",cols:{}};render();});
  document.getElementById("asec").addEventListener("input",function(){AF.section=this.value;});
  document.getElementById("afeat").addEventListener("input",function(){AF.feature=this.value;});
  document.getElementById("svbtn").addEventListener("click",function(){saveEntry(body);});
  body.querySelectorAll("#achips .cp").forEach(function(chip){chip.addEventListener("click",function(){var s=chip.getAttribute("data-sec");AF.section=AF.section===s?"":s;render();});});
  body.querySelectorAll("#acols .cfi").forEach(function(inp){inp.addEventListener("input",function(){AF.cols[inp.getAttribute("data-col")]=inp.value;});});
  body.querySelectorAll(".db[data-ci]").forEach(function(btn){btn.addEventListener("click",function(e){e.stopPropagation();delCust(parseInt(btn.getAttribute("data-ci")));});});
}

// ── EXPORT ──────────────────────────────────────────────────
// ── CLIENT ONE-PAGER PDF ────────────────────────────────────
function exportClientOnePager(){
  var plat=resolveCtxPlatform()||activePlat;
  if(!plat){alert("Please set a practice context or select a platform first.");return;}
  var practiceName=practiceCtx.name||"";
  var practiceEMR=practiceCtx.emr||plat;
  var data=GD();
  var sheets={};
  for(var i=0;i<data.length;i++){
    var e=data[i];var ck=findPlatKey(e,plat);if(!ck)continue;
    if(!sheets[e.s])sheets[e.s]={};
    if(!sheets[e.s][e.sec])sheets[e.s][e.sec]=[];
    var ov=getOverride(e.s,e.f,ck)||{};
    var val=ov.val||e.c[ck];
    var take=ov.acgTake||"";
    var conf=confidence[e.s+"|"+e.f+"|"+ck]||"unverified";
    sheets[e.s][e.sec].push({f:e.f,val:val,take:take,conf:conf});
  }
  // Only include verified items and items with ACG Takes for client doc
  var w=window.open("","_blank");if(!w)return;
  var lines=['<!DOCTYPE html><html><head><title>'+plat+' — ACG Software Assessment</title>',
    '<style>',
    'body{font-family:Georgia,serif;max-width:750px;margin:40px auto;color:#1C2B3A;font-size:14px;line-height:1.7}',
    '.hdr{border-bottom:3px solid #C9A84C;padding-bottom:16px;margin-bottom:28px}',
    '.acg{font-size:10px;font-weight:700;letter-spacing:3px;color:#C9A84C;margin-bottom:4px}',
    '.title{font-size:28px;font-weight:700;margin-bottom:4px}',
    '.sub{font-size:14px;color:#718096}',
    'h2{font-size:13px;background:#EDE5D8;padding:7px 14px;margin:24px 0 0;text-transform:uppercase;letter-spacing:1px;color:#4A5568;font-family:inherit}',
    'table{width:100%;border-collapse:collapse;margin-bottom:0}',
    'td{padding:10px 14px;border-bottom:1px solid #EDE5D8;vertical-align:top}',
    'td:first-child{font-weight:600;width:50%}',
    '.yes{color:#065F46;font-weight:700}.no{color:#991B1B;font-weight:700}.part{color:#92400E;font-weight:700}',
    '.take{font-size:12px;color:#1E40AF;font-style:italic;margin-top:5px;padding:5px 10px;background:#DBEAFE;border-radius:4px;border-left:2px solid #93C5FD}',
    '.footer{margin-top:40px;padding-top:14px;border-top:1px solid #EDE5D8;font-size:11px;color:#9CA3AF;display:flex;justify-content:space-between}',
    '.disclaimer{margin-top:28px;padding:14px 18px;background:#FBF5E6;border-radius:8px;border-left:3px solid #C9A84C;font-size:12px;color:#92400E;line-height:1.6}',
    '</style></head><body>',
    '<div class="hdr">',
    '<div class="acg">ACG PRACTICE PARTNERS</div>',
    '<div class="title">Software Assessment: '+plat+'</div>',
    '<div class="sub">'+(practiceName?'Prepared for '+practiceName+' &nbsp;&middot;&nbsp; ':'')+new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})+'</div>',
    '</div>',
  ];
  var sheetKeys=Object.keys(sheets);
  for(var si=0;si<sheetKeys.length;si++){
    var sheet=sheetKeys[si];
    lines.push('<h2>'+(SL[sheet]||sheet)+'</h2><table>');
    var secKeys=Object.keys(sheets[sheet]);
    for(var seci=0;seci<secKeys.length;seci++){
      var items=sheets[sheet][secKeys[seci]];
      for(var ii=0;ii<items.length;ii++){
        var item=items[ii];
        // Skip TBD items with no take for client doc
        if(item.val.toLowerCase()==="tbd"&&!item.take)continue;
        var vl=item.val.toLowerCase();
        var cls=vl==="yes"||vl.indexOf("✅")===0?"yes":vl==="no"||vl.indexOf("❌")===0?"no":"part";
        // Soften language for client-facing
        var displayVal=item.val;
        if(vl==="partial")displayVal="Available (verify scope)";
        if(vl==="tbd")displayVal="To be confirmed";
        lines.push('<tr><td>'+item.f+'</td><td><span class="'+cls+'">'+displayVal+'</span>'+(item.take?'<div class="take">'+item.take+'</div>':'')+'</td></tr>');
      }
    }
    lines.push('</table>');
  }
  // Scratch pad notes if any
  var scratchKey=practiceCtx.name||"general";
  var scratchText=scratchPads[scratchKey];
  if(scratchText){
    lines.push('<h2>Call Notes</h2><div style="padding:14px;background:#F8F4EE;border-radius:6px;white-space:pre-wrap;font-size:13px">'+scratchText.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")+'</div>');
  }
  lines.push('<div class="disclaimer">This assessment was prepared by ACG Practice Partners based on vendor documentation, product demonstrations, and client experience. Feature availability and pricing are subject to change. We recommend confirming all details directly with the vendor before making a final decision.</div>');
  lines.push('<div class="footer"><span>ACG Practice Partners &nbsp;&middot;&nbsp; acgpracticepartners.com</span><span>Internal reference &mdash; not for distribution</span></div>');
  lines.push('</body></html>');
  w.document.write(lines.join(''));w.document.close();w.print();
}

// ── COMPARE PDF ──────────────────────────────────────────────
function exportComparePDF(p1,p2){
  var data=GD();var w=window.open("","_blank");if(!w)return;
  var lines=['<!DOCTYPE html><html><head><title>'+p1+' vs '+p2+'</title>',
    '<style>body{font-family:Georgia,serif;max-width:900px;margin:32px auto;color:#1C2B3A;font-size:13px}',
    '.hdr{border-bottom:3px solid #C9A84C;padding-bottom:12px;margin-bottom:20px;display:flex;justify-content:space-between;align-items:flex-end}',
    '.acg{font-size:9px;font-weight:700;letter-spacing:3px;color:#C9A84C}',
    '.title{font-size:22px;font-weight:700}',
    'h2{font-size:11px;background:#1C2B3A;color:#fff;padding:6px 12px;margin:20px 0 0;letter-spacing:1px;text-transform:uppercase}',
    'table{width:100%;border-collapse:collapse}',
    'th{background:#EDE5D8;padding:8px 10px;font-size:11px;text-align:left;font-weight:700;text-transform:uppercase;letter-spacing:.5px}',
    'td{padding:9px 10px;border-bottom:1px solid #F0EBE2;vertical-align:top;font-size:12px}',
    'td:first-child{font-weight:600;width:34%}',
    '.yes{color:#065F46;font-weight:700}.no{color:#991B1B;font-weight:700}.part{color:#92400E;font-weight:700}',
    '.note{font-size:11px;color:#5C4A1A;background:#FBF5E6;padding:4px 7px;border-radius:3px;border-left:2px solid #C9A84C;margin-top:3px}',
    '.take{font-size:11px;color:#1E40AF;background:#DBEAFE;padding:4px 7px;border-radius:3px;margin-top:3px;font-style:italic}',
    '.diff{background:#FFFBF0}',
    '.footer{margin-top:24px;font-size:10px;color:#9CA3AF;border-top:1px solid #EDE5D8;padding-top:8px;display:flex;justify-content:space-between}',
    '</style></head><body>',
    '<div class="hdr"><div><div class="acg">ACG PRACTICE PARTNERS</div><div class="title">'+p1+' vs '+p2+'</div></div>',
    '<div style="font-size:11px;color:#9CA3AF">'+new Date().toLocaleDateString()+'</div></div>',
  ];
  var sheetKeys=Object.keys(ST);
  for(var si=0;si<sheetKeys.length;si++){
    var sheet=sheetKeys[si];var sections=ST[sheet]||[];var sheetData=false;
    var sheetLines=['<h2>'+(SL[sheet]||sheet)+'</h2><table><tr><th>Feature</th><th>'+p1+'</th><th>'+p2+'</th></tr>'];
    for(var seci=0;seci<sections.length;seci++){
      var secItems=data.filter(function(e){return e.s===sheet&&e.sec===sections[seci];});
      for(var ei2=0;ei2<secItems.length;ei2++){
        var e=secItems[ei2];
        var ck1=findPlatKey(e,p1),ck2=findPlatKey(e,p2);if(!ck1&&!ck2)continue;
        var ov1=ck1?(getOverride(sheet,e.f,ck1)||{}):null;
        var ov2b=ck2?(getOverride(sheet,e.f,ck2)||{}):null;
        var v1=ov1&&ov1.val?ov1.val:(ck1?e.c[ck1]:"—");
        var v2=ov2b&&ov2b.val?ov2b.val:(ck2?e.c[ck2]:"—");
        var n1=ov1&&ov1.note?ov1.note:(ck1&&e.notes?e.notes[ck1]:"");
        var n2=ov2b&&ov2b.note?ov2b.note:(ck2&&e.notes?e.notes[ck2]:"");
        var t1=ov1&&ov1.acgTake?ov1.acgTake:"";
        var t2=ov2b&&ov2b.acgTake?ov2b.acgTake:"";
        var same=String(v1).toLowerCase()===String(v2).toLowerCase();
        var c1l=v1.toLowerCase();var c2l=v2.toLowerCase();
        var cls1=c1l==="yes"||c1l.indexOf("✅")===0?"yes":c1l==="no"||c1l.indexOf("❌")===0?"no":"part";
        var cls2=c2l==="yes"||c2l.indexOf("✅")===0?"yes":c2l==="no"||c2l.indexOf("❌")===0?"no":"part";
        sheetLines.push('<tr class="'+(same?"":"diff")+'">');
        sheetLines.push('<td>'+e.f+'</td>');
        sheetLines.push('<td><span class="'+cls1+'">'+v1+'</span>'+(n1?'<div class="note">'+n1.slice(0,100)+(n1.length>100?"…":"")+'</div>':"")+(t1?'<div class="take">'+t1.slice(0,80)+(t1.length>80?"…":"")+'</div>':"")+'</td>');
        sheetLines.push('<td><span class="'+cls2+'">'+v2+'</span>'+(n2?'<div class="note">'+n2.slice(0,100)+(n2.length>100?"…":"")+'</div>':"")+(t2?'<div class="take">'+t2.slice(0,80)+(t2.length>80?"…":"")+'</div>':"")+'</td>');
        sheetLines.push('</tr>');
        sheetData=true;
      }
    }
    sheetLines.push('</table>');
    if(sheetData)lines=lines.concat(sheetLines);
  }
  lines.push('<div class="footer"><span>ACG Practice Partners &middot; acgpracticepartners.com</span><span>Rows highlighted in gold indicate differences between platforms</span></div>');
  lines.push('</body></html>');
  w.document.write(lines.join(''));w.document.close();w.print();
}

function exportAllCSV(){
  var rows=[["Sheet","Section","Feature","Platform","Value","ACG Note","ACG Take","Verified By","Last Updated"]];
  var data=GD();
  for(var i=0;i<data.length;i++){
    var e=data[i];
    var cols=Object.keys(e.c);
    for(var ci=0;ci<cols.length;ci++){
      var col=cols[ci];
      var ov=getOverride(e.s,e.f,col)||{};
      var val=ov.val||e.c[col]||"";
      var note=ov.note||(e.notes?e.notes[col]:"") ||"";
      var take=ov.acgTake||"";
      var verified=ov.verifiedBy||"";
      var updated=ov.updatedAt?new Date(ov.updatedAt).toLocaleDateString():"";
      rows.push([e.s,e.sec,e.f,col,val,note,take,verified,updated]);
    }
  }
  var csv=rows.map(function(r){return r.map(function(c){return'"'+String(c||"").replace(/"/g,'""')+'"';}).join(",");}).join("\n");
  var blob=new Blob([csv],{type:"text/csv"});
  var a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="ACG_ClientSoftwareIntelligence_"+new Date().toISOString().slice(0,10)+".csv";a.click();
}
function exportPlatformPDF(platLabel,sheets){
  var w=window.open("","_blank");
  if(!w)return;
  var lines=["<html><head><title>"+platLabel+" \u2014 ACG CSI</title><style>body{font-family:Georgia,serif;max-width:800px;margin:40px auto;color:#1C2B3A}h1{font-size:28px;border-bottom:2px solid #C9A84C;padding-bottom:10px;margin-bottom:20px}h2{font-size:16px;background:#EDE5D8;padding:8px 12px;margin:20px 0 0;text-transform:uppercase;letter-spacing:1px;font-size:11px}table{width:100%;border-collapse:collapse;margin-bottom:0}td{padding:9px 12px;border-bottom:1px solid #EDE5D8;font-size:13px;vertical-align:top}td:first-child{font-weight:600;width:55%;color:#1C2B3A}td:last-child{width:45%}.yes{color:#065F46;font-weight:700}.no{color:#991B1B;font-weight:700}.partial{color:#92400E;font-weight:700}.note{font-size:11px;color:#5C4A1A;background:#FBF5E6;padding:6px 10px;border-left:2px solid #C9A84C;margin-top:4px}.take{font-size:11px;color:#1E40AF;background:#DBEAFE;padding:6px 10px;border-left:2px solid #93C5FD;margin-top:4px;font-style:italic}.footer{margin-top:30px;font-size:11px;color:#9CA3AF;border-top:1px solid #EDE5D8;padding-top:10px}</style></head><body>"];
  lines.push("<h1>"+platLabel+"</h1>");
  lines.push("<p style='font-size:12px;color:#718096;margin-bottom:20px'>Generated "+new Date().toLocaleDateString()+" \u00b7 ACG Practice Partners \u00b7 Client Software Intelligence</p>");
  var sheetKeys=Object.keys(sheets);
  for(var si=0;si<sheetKeys.length;si++){
    var sheet=sheetKeys[si];
    lines.push("<h2>"+(SL[sheet]||sheet)+"</h2><table>");
    var secKeys=Object.keys(sheets[sheet]);
    for(var seci=0;seci<secKeys.length;seci++){
      var items=sheets[sheet][secKeys[seci]];
      for(var ii=0;ii<items.length;ii++){
        var item=items[ii];
        var cls=item.val.toLowerCase()==="yes"||item.val.indexOf("\u2705")===0?"yes":item.val.toLowerCase()==="no"||item.val.indexOf("\u274c")===0?"no":"partial";
        lines.push("<tr><td>"+esc(item.e.f)+"</td><td><span class='"+cls+"'>"+esc(String(item.val))+"</span>"+(item.note?"<div class='note'>"+esc(String(item.note))+"</div>":"")+(item.take?"<div class='take'>ACG: "+esc(String(item.take))+"</div>":"")+"</td></tr>");
      }
    }
    lines.push("</table>");
  }
  lines.push("<div class='footer'>ACG Practice Partners \u00b7 acgpracticepartners.com \u00b7 Internal use only</div></body></html>");
  w.document.write(lines.join(""));w.document.close();w.print();
}

// ── HINTS ───────────────────────────────────────────────────
function attachHints(){
  document.querySelectorAll(".hint[data-h]").forEach(function(b){b.addEventListener("click",function(){document.getElementById("ask-inp").value=b.getAttribute("data-h");doAsk();});});
}

// ── WATCH-OUT POPOUT ────────────────────────────────────────
function openWarnPopout(){
  var plat=resolveCtxPlatform();
  var warnings=getCtxWarnings();
  if(!warnings.length)return;

  // Remove existing popout if any
  var existing=document.getElementById("warn-popout");
  if(existing){existing.remove();return;}

  var popout=document.createElement("div");
  popout.id="warn-popout";
  popout.style.cssText="position:fixed;top:0;right:0;width:360px;max-width:95vw;height:100vh;background:#fff;z-index:1000;box-shadow:-4px 0 24px rgba(28,43,58,.2);display:flex;flex-direction:column;animation:slideIn .2s ease";

  var catColors={
    "CONTRACT":"#DC2626","CLINICAL":"#7C3AED","IMPLEMENTATION":"#D97706",
    "PRICING":"#059669","WORKFLOW":"#2563EB","REPORTING":"#6B7280"
  };

  var items=warnings.map(function(w){
    var cc=catColors[w.cat]||"#6B7280";
    return'<div style="padding:14px 18px;border-bottom:1px solid #F5EFE8;">'
      +'<div style="display:flex;align-items:center;gap:7px;margin-bottom:5px">'
      +'<span style="background:'+cc+';color:#fff;border-radius:3px;padding:1px 7px;font-size:9px;font-weight:800;letter-spacing:.5px;flex-shrink:0">'+w.cat+'</span>'
      +'<span style="font-size:11px;font-weight:700;color:#92400E">'+w.feature+'</span>'
      +'</div>'
      +'<div style="font-size:13px;color:#374151;line-height:1.65">'+w.text+'</div>'
      +'</div>';
  }).join("");

  popout.innerHTML=
    '<div style="background:#1C2B3A;padding:14px 18px;flex-shrink:0;display:flex;align-items:center;justify-content:space-between">'
      +'<div>'
        +'<div style="font-size:9px;font-weight:700;letter-spacing:1.5px;color:#C9A84C;margin-bottom:3px">ACG WATCH-OUTS</div>'
        +'<div style="font-family:Playfair Display,serif;font-size:15px;color:#fff;font-weight:600">'+plat+'</div>'
        +(practiceCtx.name?'<div style="font-size:11px;color:rgba(255,255,255,.4);margin-top:2px">'+practiceCtx.name+'</div>':""  )
      +'</div>'
      +'<button id="warn-close" style="background:none;border:none;color:rgba(255,255,255,.4);cursor:pointer;font-size:24px;line-height:1;padding:0">×</button>'
    +'</div>'
    +'<div style="overflow-y:auto;flex:1">'+items+'</div>'
    +'<div style="padding:12px 18px;border-top:1px solid #EDE5D8;background:#F8F4EE;font-size:11px;color:#9CA3AF;text-align:center">Tap outside to close</div>';

  document.body.appendChild(popout);

  // Slide-in animation
  if(!document.getElementById("warn-anim-style")){
    var st=document.createElement("style");
    st.id="warn-anim-style";
    st.textContent="@keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}";
    document.head.appendChild(st);
  }

  document.getElementById("warn-close").addEventListener("click",function(){popout.remove();});
  // Click outside to close
  setTimeout(function(){
    document.addEventListener("click",function closePopout(e){
      if(!popout.contains(e.target)&&!e.target.classList.contains("ctx-warn-badge")){
        popout.remove();
        document.removeEventListener("click",closePopout);
      }
    });
  },100);
}
