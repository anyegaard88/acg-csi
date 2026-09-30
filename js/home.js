function rHome(body){
  var recentBrain=brainEntries.slice(0,3);
  var recentReleases=globalReleases.slice(0,2);
  var activeProfiles=profiles.filter(function(p){return (p.status||"active")==="active";});
  var totalFlags=profiles.reduce(function(sum,p){return sum+(p.flags||[]).length;},0);
  var ctx=practiceCtx.emr||practiceCtx.name;

  var h='<div style="max-width:900px;margin:0 auto;padding:20px 16px">';

  // Greeting + context
  h+='<div style="margin-bottom:22px">';
  h+='<h2 style="font-family:Playfair Display,serif;font-size:22px;color:var(--navy);margin:0 0 4px">ACG Client Software Intelligence</h2>';
  h+='<div style="font-size:12px;color:var(--text3)">Your call intelligence, knowledge base, and consulting toolkit in one place.</div>';
  if(ctx){
    h+='<div style="display:inline-flex;align-items:center;gap:8px;margin-top:10px;background:var(--navy);border-radius:8px;padding:8px 14px">';
    h+='<span style="font-size:12px;color:rgba(255,255,255,.6)">Call context:</span>';
    h+='<span style="font-size:13px;font-weight:700;color:#fff">'+esc(practiceCtx.name||practiceCtx.emr)+(practiceCtx.name&&practiceCtx.emr?' \u00b7 '+esc(practiceCtx.emr):'')+'</span>';
    h+='<button onclick="practiceCtx.name=\'\';practiceCtx.emr=\'\';save(SK+\'_ctx\',practiceCtx);updateCtxBar();render();" style="background:rgba(255,255,255,.1);border:none;border-radius:4px;color:rgba(255,255,255,.5);cursor:pointer;font-size:10px;padding:2px 7px;font-family:Inter,sans-serif">clear</button>';
    h+='</div>';
  }
  h+='</div>';

  // Three section cards
  h+='<div class="home-grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:24px">';

  // CALL — deep navy with phone blue accent
  h+='<div class="home-section-card" data-section="call" data-view="ask" style="background:linear-gradient(135deg,#1C2B3A 0%,#0F2035 100%);border-radius:16px;padding:22px;cursor:pointer;transition:all .15s;border:1px solid rgba(255,255,255,.06)">';
  h+='<div style="width:60px;height:60px;background:rgba(201,168,76,.18);border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:34px;margin-bottom:16px;border:1px solid rgba(201,168,76,.3);box-shadow:0 0 20px rgba(201,168,76,.15)"><span style="filter:sepia(1) saturate(4) hue-rotate(5deg) brightness(1.2)">📞</span></div>';
  h+='<div style="font-size:17px;font-weight:800;color:#fff;margin-bottom:6px;letter-spacing:-.3px">Call</div>';
  h+='<div style="font-size:11px;color:rgba(255,255,255,.5);line-height:1.65;margin-bottom:16px">Real-time lookup during client calls. Ask, compare platforms, check known issues.</div>';
  h+='<div style="display:flex;gap:5px;flex-wrap:wrap">';
  ['Ask','Platform','Compare','Issues'].forEach(function(t){
    h+='<span style="background:rgba(201,168,76,.12);color:var(--gold);border:1px solid rgba(201,168,76,.2);border-radius:6px;padding:3px 9px;font-size:10px;font-weight:700">'+t+'</span>';
  });
  h+='</div></div>';

  // KNOWLEDGE — rich purple with brain icon
  h+='<div class="home-section-card" data-section="knowledge" data-view="knowledge" style="background:linear-gradient(135deg,#1a1206 0%,#0f0d02 100%);border-radius:16px;padding:22px;cursor:pointer;transition:all .15s;border:1px solid rgba(255,255,255,.06)">';
  h+='<div style="width:60px;height:60px;background:rgba(201,168,76,.1);border-radius:16px;display:flex;align-items:center;justify-content:center;margin-bottom:16px;border:1px solid rgba(201,168,76,.25);box-shadow:0 0 20px rgba(201,168,76,.12)"><img src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2052%2052%22%3E%0A%20%20%3Ccircle%20cx%3D%2226%22%20cy%3D%2226%22%20r%3D%2224%22%20fill%3D%22%231a1206%22%20opacity%3D%220.8%22/%3E%0A%20%20%3Ccircle%20cx%3D%2226%22%20cy%3D%2226%22%20r%3D%2222%22%20fill%3D%22none%22%20stroke%3D%22%23C9A84C%22%20stroke-width%3D%221.5%22%20opacity%3D%220.6%22/%3E%0A%20%20%3Ccircle%20cx%3D%2226%22%20cy%3D%2226%22%20r%3D%2217%22%20fill%3D%22none%22%20stroke%3D%22%23D4A832%22%20stroke-width%3D%221.5%22%20opacity%3D%220.75%22/%3E%0A%20%20%3Ccircle%20cx%3D%2226%22%20cy%3D%2226%22%20r%3D%2212%22%20fill%3D%22none%22%20stroke%3D%22%23FDE68A%22%20stroke-width%3D%221.2%22%20opacity%3D%220.85%22/%3E%0A%20%20%3Cpolygon%20points%3D%2226%2C9%2028.5%2C18%2023.5%2C18%22%20fill%3D%22none%22%20stroke%3D%22%23FDE68A%22%20stroke-width%3D%221.2%22%20opacity%3D%220.9%22/%3E%0A%20%20%3Cpolygon%20points%3D%2226%2C43%2028.5%2C34%2023.5%2C34%22%20fill%3D%22none%22%20stroke%3D%22%23FDE68A%22%20stroke-width%3D%221.2%22%20opacity%3D%220.9%22/%3E%0A%20%20%3Cpolygon%20points%3D%229%2C26%2018%2C23.5%2018%2C28.5%22%20fill%3D%22none%22%20stroke%3D%22%23FDE68A%22%20stroke-width%3D%221.2%22%20opacity%3D%220.9%22/%3E%0A%20%20%3Cpolygon%20points%3D%2243%2C26%2034%2C23.5%2034%2C28.5%22%20fill%3D%22none%22%20stroke%3D%22%23FDE68A%22%20stroke-width%3D%221.2%22%20opacity%3D%220.9%22/%3E%0A%20%20%3Cpolygon%20points%3D%2226%2C2%2027.8%2C23.8%2026%2C26%2024.2%2C23.8%22%20fill%3D%22%23FDE68A%22/%3E%0A%20%20%3Cpolygon%20points%3D%2226%2C50%2027.8%2C28.2%2026%2C26%2024.2%2C28.2%22%20fill%3D%22%23FDE68A%22/%3E%0A%20%20%3Cpolygon%20points%3D%222%2C26%2023.8%2C24.2%2026%2C26%2023.8%2C27.8%22%20fill%3D%22%23FDE68A%22/%3E%0A%20%20%3Cpolygon%20points%3D%2250%2C26%2028.2%2C24.2%2026%2C26%2028.2%2C27.8%22%20fill%3D%22%23FDE68A%22/%3E%0A%20%20%3Ccircle%20cx%3D%2226%22%20cy%3D%2226%22%20r%3D%228%22%20fill%3D%22%23C9A84C%22%20opacity%3D%220.4%22/%3E%0A%20%20%3Ccircle%20cx%3D%2226%22%20cy%3D%2226%22%20r%3D%226%22%20fill%3D%22%23FDE68A%22%20opacity%3D%220.7%22/%3E%0A%20%20%3Ccircle%20cx%3D%2226%22%20cy%3D%2226%22%20r%3D%224%22%20fill%3D%22%23fff%22%20opacity%3D%220.95%22/%3E%0A%3C/svg%3E" width="56" height="56" style="display:block"></div>';

  h+='<div style="font-size:17px;font-weight:800;color:#fff;margin-bottom:6px;letter-spacing:-.3px">Knowledge</div>';
  h+='<div style="font-size:11px;color:rgba(255,255,255,.5);line-height:1.65;margin-bottom:16px">Help articles, training paths, release notes, and call capture notes.</div>';
  h+='<div style="display:flex;gap:5px;flex-wrap:wrap">';
  var kStats=[];
  if(helpArticles.length)kStats.push(helpArticles.length+' articles');
  if(helpPaths.length)kStats.push(helpPaths.length+' paths');
  if(brainEntries.length)kStats.push(brainEntries.length+' notes');
  (kStats.length?kStats:['Help Center','MyAnna','Release Notes']).forEach(function(s){
    h+='<span style="background:rgba(201,168,76,.15);color:#C9A84C;border:1px solid rgba(201,168,76,.25);border-radius:6px;padding:3px 9px;font-size:10px;font-weight:700">'+s+'</span>';
  });
  h+='</div></div>';

  // WORK — forest green with ninja icon
  h+='<div class="home-section-card" data-section="clients" data-view="profiles" style="background:linear-gradient(135deg,#064E3B 0%,#022c22 100%);border-radius:16px;padding:22px;cursor:pointer;transition:all .15s;border:1px solid rgba(255,255,255,.06)">';
  h+='<div style="width:60px;height:60px;background:rgba(52,211,153,.18);border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:36px;margin-bottom:16px;border:1px solid rgba(52,211,153,.3);box-shadow:0 0 20px rgba(52,211,153,.15)">&#x1F977;</div>';
  h+='<div style="font-size:17px;font-weight:800;color:#fff;margin-bottom:6px;letter-spacing:-.3px">Work</div>';
  h+='<div style="font-size:11px;color:rgba(255,255,255,.5);line-height:1.65;margin-bottom:16px">Client profiles, technology audits, release intelligence, and consulting toolkit.</div>';
  h+='<div style="display:flex;gap:5px;flex-wrap:wrap">';
  var wStats=[];
  if(activeProfiles.length)wStats.push(activeProfiles.length+' clients');
  if(totalFlags)wStats.push(totalFlags+' flags');
  if(globalReleases.length)wStats.push(globalReleases.length+' releases');
  wStats.push('+ Tech Audit');
  (wStats.length?wStats:['Clients','Settings']).forEach(function(s){
    h+='<span style="background:rgba(52,211,153,.12);color:#34d399;border:1px solid rgba(52,211,153,.2);border-radius:6px;padding:3px 9px;font-size:10px;font-weight:700">'+s+'</span>';
  });
  h+='</div>';
  h+='<div onclick="event.stopPropagation();SV(&quot;audit&quot;);" style="display:inline-flex;align-items:center;gap:5px;margin-top:10px;background:rgba(52,211,153,.1);border:1px solid rgba(52,211,153,.25);border-radius:7px;padding:5px 10px;cursor:pointer;transition:all .12s" title="Run Technology Audit">';
  h+='<span style="font-size:11px">⬥</span><span style="font-size:10px;font-weight:700;color:#34d399">Technology Audit</span></div>';
  h+='</div>';
  h+='</div>';

  // Post-Call CTA
  var unprocessed=brainEntries.filter(function(e){var c=Date.now()-(7*24*60*60*1000);return !e.processed&&e.ts>c;});
  if(unprocessed.length){
    h+='<div onclick="SV(&quot;postcall&quot;)" style="background:linear-gradient(135deg,#92400E,#78350F);border-radius:12px;padding:14px 20px;margin-bottom:14px;cursor:pointer;display:flex;align-items:center;gap:14px;border:1px solid rgba(255,255,255,.06)">';
    h+='<div style="width:40px;height:40px;background:var(--gold);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0">✅</div>';
    h+='<div><div style="font-size:13px;font-weight:700;color:#fff">Post-Call: '+unprocessed.length+' capture'+(unprocessed.length!==1?'s':'')+' to process</div>';
    h+='<div style="font-size:11px;color:rgba(255,255,255,.55);margin-top:2px">Promote to ACG Takes, client profiles, or Help articles →</div></div>';
    h+='<div style="margin-left:auto;font-size:20px">→</div></div>';
  }

  // Activity row
  h+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">';

  // Recent brain captures
  h+='<div style="background:#fff;border:1px solid var(--tan2);border-radius:12px;padding:12px 14px">';
  h+='<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">';
  h+='<div style="font-size:11px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.5px">🥷 Recent Notes</div>';
  h+='<button onclick="SV(\'brain\')" style="background:none;border:none;color:var(--blue);font-size:11px;font-weight:600;cursor:pointer;font-family:Inter,sans-serif;padding:0">View all →</button></div>';
  if(recentBrain.length){
    recentBrain.forEach(function(be){
      h+='<div style="padding:5px 0;border-top:1px solid var(--tan)">';
      h+='<div style="font-size:12px;color:var(--navy);line-height:1.5">'+esc(be.text.slice(0,90))+(be.text.length>90?'…':'')+'</div>';
      h+='<div style="font-size:10px;color:var(--text3);margin-top:2px">'+timeAgo(be.ts)+(be.from?' · '+esc(be.from):'')+'</div>';
      h+='</div>';
    });
  } else {
    h+='<div style="font-size:12px;color:var(--text3);padding:8px 0">No notes yet. Capture call insights in the Knowledge tab.</div>';
  }
  h+='</div>';

  // Recent releases + flag matches
  h+='<div style="background:#fff;border:1px solid var(--tan2);border-radius:12px;padding:16px">';
  h+='<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">';
  h+='<div style="font-size:11px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.5px">📋 Release Activity</div>';
  h+='<button onclick="SV(\'releases\')" style="background:none;border:none;color:var(--blue);font-size:11px;font-weight:600;cursor:pointer;font-family:Inter,sans-serif;padding:0">View all →</button></div>';
  if(recentReleases.length){
    recentReleases.forEach(function(r){
      var matched=r.matchedProfiles||[];
      var totalM=matched.reduce(function(s,m){return s+m.matches.length;},0);
      h+='<div style="padding:7px 0;border-top:1px solid var(--tan)">';
      h+='<div style="display:flex;align-items:center;gap:6px">';
      h+='<span style="font-size:12px;font-weight:700;color:var(--navy)">'+esc(r.platform)+(r.version?' v'+esc(r.version):'')+'</span>';
      if(totalM)h+='<span style="font-size:10px;background:#D1FAE5;color:#065F46;font-weight:700;padding:1px 6px;border-radius:6px">'+totalM+' match'+(totalM!==1?'es':'')+'</span>';
      h+='</div>';
      h+='<div style="font-size:10px;color:var(--text3);margin-top:2px">'+(r.items||[]).length+' items · '+new Date(r.created).toLocaleDateString()+'</div>';
      h+='</div>';
    });
  } else {
    h+='<div style="font-size:12px;color:var(--text3);padding:8px 0">No release notes yet. Paste vendor release notes in Work → Release Notes.</div>';
    h+='<button onclick="SV(\'releases\')" style="margin-top:8px;background:var(--navy);border:none;border-radius:6px;padding:6px 14px;font-size:11px;font-weight:700;cursor:pointer;color:#fff;font-family:Inter,sans-serif">+ Paste first release note</button>';
  }
  h+='</div>';
  h+='</div>';
  h+='</div>';
  body.innerHTML=h;

  // Section card clicks
  body.querySelectorAll('.home-section-card').forEach(function(card){
    card.addEventListener('mouseenter',function(){card.style.transform='translateY(-2px)';});
    card.addEventListener('mouseleave',function(){card.style.transform='';});
    card.addEventListener('click',function(){
      var sec=card.dataset.section;
      var v=card.dataset.view;
      navSection=sec;
      SV(v);
    });
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// POST-CALL TRIAGE
// ══════════════════════════════════════════════════════════════════════════════

var postCallIdx=0; // current capture index in triage queue

function getUnprocessed(){
  // Today's captures + any unprocessed older ones
  var cutoff=Date.now()-(7*24*60*60*1000); // last 7 days
  return brainEntries.filter(function(e){
    return !e.processed && e.ts > cutoff;
  }).sort(function(a,b){return b.ts-a.ts;});
}

function rPostCall(body){
  var queue=getUnprocessed();
  var h='<div style="max-width:720px;margin:0 auto;padding:16px">';

  // Header
  h+='<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">';
  h+='<div><h2 style="font-family:Playfair Display,serif;font-size:20px;color:var(--navy);margin:0">Post-Call</h2>';
  h+='<p style="font-size:11px;color:var(--text3);margin:3px 0 0">Process your captures from the last 7 days into real knowledge</p></div>';
  if(queue.length)h+='<div style="background:var(--gold);color:var(--navy);border-radius:20px;padding:4px 12px;font-size:12px;font-weight:800">'+queue.length+' to process</div>';
  h+='</div>';

  if(!queue.length){
    h+='<div style="text-align:center;padding:60px 20px;background:#fff;border:1px solid var(--tan2);border-radius:14px">';
    h+='<div style="font-size:40px;margin-bottom:12px">✅</div>';
    h+='<div style="font-size:16px;font-weight:700;color:var(--navy);margin-bottom:6px">All caught up</div>';
    h+='<div style="font-size:12px;color:var(--text3);max-width:320px;margin:0 auto">No unprocessed captures from the last 7 days. Add new captures during your next call.</div>';
    h+='<button onclick="openCaptureModal()" style="margin-top:16px;background:var(--navy);color:#fff;border:none;border-radius:8px;padding:10px 20px;font-size:12px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif">+ New Capture</button>';
    h+='</div></div>';
    body.innerHTML=h;
    return;
  }

  // Progress bar
  var total=queue.length+brainEntries.filter(function(e){var cutoff=Date.now()-(7*24*60*60*1000);return e.processed&&e.ts>cutoff;}).length;
  var done=total-queue.length;
  h+='<div style="background:#fff;border:1px solid var(--tan2);border-radius:8px;padding:10px 14px;margin-bottom:14px;display:flex;align-items:center;gap:12px">';
  h+='<div style="flex:1;background:var(--tan);border-radius:4px;height:6px;overflow:hidden">';
  h+='<div style="background:var(--gold);height:6px;width:'+(total>0?Math.round((done/total)*100):0)+'%;border-radius:4px;transition:width .3s"></div></div>';
  h+='<div style="font-size:11px;color:var(--text3);white-space:nowrap">'+done+' / '+total+' processed</div></div>';

  // Current capture
  if(postCallIdx>=queue.length)postCallIdx=0;
  var entry=queue[postCallIdx];
  var platObj=entry.tag?PLATS.filter(function(p){return p.label===entry.tag;})[0]:null;
  var platBg=platObj?platObj.color:"#1C2B3A";

  h+='<div style="background:#fff;border:1px solid var(--tan2);border-radius:14px;overflow:hidden;margin-bottom:12px">';

  // Capture header
  h+='<div style="padding:14px 18px;background:var(--navy)">';
  h+='<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">';
  h+='<div style="font-size:10px;font-weight:700;color:rgba(255,255,255,.4);text-transform:uppercase;letter-spacing:.6px">'+timeAgo(entry.ts)+(entry.from?' · '+esc(entry.from):'')+'</div>';
  h+='<div style="font-size:10px;color:rgba(255,255,255,.3)">'+( postCallIdx+1)+' of '+queue.length+'</div></div>';
  if(entry.tag)h+='<span style="background:'+platBg+';color:#fff;border-radius:4px;padding:2px 8px;font-size:10px;font-weight:700">'+esc(entry.tag)+'</span> ';
  h+='<div style="font-size:14px;color:#fff;line-height:1.6;margin-top:6px">'+esc(entry.text)+'</div>';
  if(entry.image)h+='<img src="'+esc(entry.image)+'" style="max-width:100%;max-height:120px;border-radius:6px;margin-top:8px" onerror="this.style.display=\'none\'">';
  if(entry.video)h+='<a href="'+esc(entry.video)+'" target="_blank" style="display:inline-flex;align-items:center;gap:5px;margin-top:8px;font-size:11px;color:var(--gold);font-weight:600">🎬 View recording</a>';
  h+='</div>';

  // Action buttons
  h+='<div style="padding:16px 18px">';
  h+='<div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px">What do you want to do with this?</div>';
  h+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">';

  // Action 1 — Promote to ACG Take
  h+='<button id="pc-promote-take" style="padding:12px;border-radius:10px;border:1.5px solid var(--tan2);background:#fff;cursor:pointer;font-family:Inter,sans-serif;text-align:left;transition:all .12s">';
  h+='<div style="font-size:16px;margin-bottom:4px">→</div>';
  h+='<div style="font-size:12px;font-weight:700;color:var(--navy)">Add as ACG Take</div>';
  h+='<div style="font-size:10px;color:var(--text3);margin-top:2px">Adds to platform data — shows in Ask on calls</div></button>';

  // Action 2 — Add to Practice Profile
  h+='<button id="pc-add-profile" style="padding:12px;border-radius:10px;border:1.5px solid var(--tan2);background:#fff;cursor:pointer;font-family:Inter,sans-serif;text-align:left;transition:all .12s">';
  h+='<div style="font-size:16px;margin-bottom:4px">🏥</div>';
  h+='<div style="font-size:12px;font-weight:700;color:var(--navy)">Add to Client Profile</div>';
  h+='<div style="font-size:10px;color:var(--text3);margin-top:2px">Save to a practice as a note or feature flag</div></button>';

  // Action 3 — Draft Help Article
  h+='<button id="pc-draft-article" style="padding:12px;border-radius:10px;border:1.5px solid var(--tan2);background:#fff;cursor:pointer;font-family:Inter,sans-serif;text-align:left;transition:all .12s">';
  h+='<div style="font-size:16px;margin-bottom:4px">📚</div>';
  h+='<div style="font-size:12px;font-weight:700;color:var(--navy)">Draft Help Article</div>';
  h+='<div style="font-size:10px;color:var(--text3);margin-top:2px">Pre-populate a Help Center article draft</div></button>';

  // Action 4 — Keep as note (done)
  h+='<button id="pc-keep" style="padding:12px;border-radius:10px;border:1.5px solid var(--tan2);background:#fff;cursor:pointer;font-family:Inter,sans-serif;text-align:left;transition:all .12s">';
  h+='<div style="font-size:16px;margin-bottom:4px">🥷</div>';
  h+='<div style="font-size:12px;font-weight:700;color:var(--navy)">Keep as MyAnna note</div>';
  h+='<div style="font-size:10px;color:var(--text3);margin-top:2px">It\'s captured — mark as processed and move on</div></button>';

  h+='</div>';

  // Skip / Done buttons
  h+='<div style="display:flex;gap:8px">';
  if(queue.length>1)h+='<button id="pc-skip" style="flex:1;padding:9px;border-radius:8px;border:1px solid var(--tan2);background:none;color:var(--text3);font-size:12px;font-weight:600;cursor:pointer;font-family:Inter,sans-serif">Skip for now</button>';
  h+='<button id="pc-discard" style="padding:9px 14px;border-radius:8px;border:1px solid #fca5a5;background:none;color:#dc2626;font-size:12px;font-weight:600;cursor:pointer;font-family:Inter,sans-serif">Discard</button>';
  h+='</div>';
  h+='</div></div>';

  h+='</div>';
  body.innerHTML=h;

  // Mark processed and advance
  function markProcessed(){
    updateBrainEntry(entry.id,{processed:true});
    postCallIdx=0; // reset, queue rebuilds
    render();
  }

  // Promote to ACG Take
  document.getElementById('pc-promote-take').addEventListener('click',function(){
    var feat=entry.tag?prompt('Feature name (for '+entry.tag+'):',entry.text.slice(0,50)):prompt('Feature name:',entry.text.slice(0,50));
    if(!feat)return;
    var plat=entry.tag||prompt('Platform:','');
    if(!plat)return;
    var takeText=prompt('ACG Take (your words — what you\'d say on a call):',entry.text);
    if(!takeText)return;
    var key='Dashboard|'+feat+'|'+plat;
    if(!overrides[key])overrides[key]={};
    overrides[key].acgTake=takeText;
    if(entry.image)overrides[key].screenshot=entry.image;
    if(entry.video)overrides[key].video=entry.video;
    save(SK+'_overrides',overrides);
    syncToSheet({action:'override',sheet:'Dashboard',feature:feat,platform:plat,data:JSON.stringify(overrides[key]),ts:Date.now()});
    markProcessed();
  });

  // Add to client profile
  document.getElementById('pc-add-profile').addEventListener('click',function(){
    if(!profiles.length){alert('No client profiles yet. Create one first under Work → Clients.');return;}
    var names=profiles.map(function(p){return p.name;}).join('\n');
    var chosen=prompt('Which client?\n\n'+names);
    if(!chosen)return;
    var prof=profiles.filter(function(p){return p.name.toLowerCase().indexOf(chosen.toLowerCase())>=0;})[0];
    if(!prof){alert('Client not found.');return;}
    var type=confirm('Add as feature flag (OK) or just a note (Cancel)?');
    var idx=profiles.findIndex(function(p){return p.id===prof.id;});
    if(idx<0)return;
    if(type){
      if(!profiles[idx].flags)profiles[idx].flags=[];
      profiles[idx].flags.push({id:uid(),feature:entry.text.slice(0,80),platform:entry.tag||'',note:'From call capture '+new Date(entry.ts).toLocaleDateString(),created:Date.now()});
    } else {
      if(!profiles[idx].brainIds)profiles[idx].brainIds=[];
      if(profiles[idx].brainIds.indexOf(entry.id)<0)profiles[idx].brainIds.push(entry.id);
    }
    profiles[idx].updated=Date.now();
    saveProfiles();
    markProcessed();
  });

  // Draft help article
  document.getElementById('pc-draft-article').addEventListener('click',function(){
    var newArt={
      id:uid(),
      title:'Draft: '+entry.text.slice(0,60)+(entry.text.length>60?'...':''),
      category:entry.tag||'General',
      tags:[entry.from||''].filter(Boolean),
      body:'## Overview\n\n'+entry.text+'\n\n## ACG Notes\n\n',
      author:entry.by||settings.name||'ACG',
      clientReady:false,published:false,
      created:Date.now(),updated:Date.now()
    };
    helpArticles.unshift(newArt);
    saveHelp();
    markProcessed();
    helpSelectedId=newArt.id;
    helpView='edit';
    helpSubView='articles';
    navSection='knowledge';
    updateNavSections();
    SV('help');
  });

  // Keep as note
  document.getElementById('pc-keep').addEventListener('click',function(){markProcessed();});

  // Skip
  var skipBtn=document.getElementById('pc-skip');
  if(skipBtn)skipBtn.addEventListener('click',function(){
    postCallIdx=(postCallIdx+1)%queue.length;
    render();
  });

  // Discard
  document.getElementById('pc-discard').addEventListener('click',function(){
    if(!confirm('Remove this capture permanently?'))return;
    deleteBrainEntry(entry.id);
    postCallIdx=0;
    render();
  });

  // Hover effects
  ['pc-promote-take','pc-add-profile','pc-draft-article','pc-keep'].forEach(function(id){
    var btn=document.getElementById(id);
    if(!btn)return;
    btn.addEventListener('mouseenter',function(){btn.style.borderColor='var(--navy)';btn.style.background='var(--tan)';});
    btn.addEventListener('mouseleave',function(){btn.style.borderColor='var(--tan2)';btn.style.background='#fff';});
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// UNIFIED KNOWLEDGE VIEW
// ══════════════════════════════════════════════════════════════════════════════
var knowledgeTab="articles"; // articles | releases | mynanna

function rKnowledge(body){
  var h='<div style="max-width:960px;margin:0 auto;padding:16px">';

  // Internal tab bar
  h+='<div style="display:flex;gap:2px;margin-bottom:18px;border-bottom:2px solid var(--tan2);padding-bottom:0">';
  [
    {id:"articles",icon:"📚",label:"Create"},
    {id:"releases",icon:"📋",label:"Release Notes"},
    {id:"mynanna",icon:"🥷",label:"Capture"},
    {id:"training",icon:"🎯",label:"Playbooks"}
  ].forEach(function(tab){
    var isOn=knowledgeTab===tab.id;
    h+='<button class="know-tab'+(isOn?" on":"")+'" data-kt="'+tab.id+'" style="padding:8px 16px;border:none;background:none;cursor:pointer;font-family:Inter,sans-serif;font-size:12px;font-weight:'+(isOn?"700":"600")+';color:'+(isOn?"var(--navy)":"var(--text3)")+';border-bottom:2px solid '+(isOn?"var(--gold)":"transparent")+';margin-bottom:-2px;transition:all .15s">'+tab.icon+' '+tab.label+'</button>';
  });
  h+='</div>';
  h+='<div id="knowledge-content"></div>';
  h+='</div>';
  body.innerHTML=h;

  // Render active tab
  var kbody=document.getElementById("knowledge-content");
  if(knowledgeTab==="articles")rHelp(kbody);
  else if(knowledgeTab==="releases")rReleases(kbody);
  else if(knowledgeTab==="mynanna")rBrain(kbody);
  else if(knowledgeTab==="training")rTraining(kbody);

  // Tab switching
  body.querySelectorAll(".know-tab").forEach(function(btn){
    btn.addEventListener("click",function(){
      knowledgeTab=btn.dataset.kt;
      SV("knowledge");
    });
  });
}


// ── SEED FIRST PLAYBOOK ───────────────────────────────────────────────────────
function seedPlaybooks(){
  if(trainingPlaybooks.length)return;
  trainingPlaybooks=[{
    id:"pb001",
    title:"4D \u2014 New Staff Onboarding, Session 1",
    platform:"4D",
    sessionType:"new_staff",
    client:"Anderson Plastic Surgery",
    sessionNum:1,
    sessionSummary:"Hands-on onboarding session for new staff (Lainie Milner and Elizabeth White) covering 4D scheduling, patient registration, patient portal, financials, and quoting. A forthcoming first-in-country 4D+Quest Diagnostics integration was announced. Staff were assigned homework to create test patients and explore the portal before the next session.",
    topics:[
      {
        name:"Scheduling & Calendar Features",
        keyPoints:[
          "Calendar views available: 8 weeks, 3 months, 6 months",
          "Multiple provider calendars can be toggled on/off and grouped by day or provider",
          "Find Openings is the most underutilized but most valuable feature \u2014 requires templates to be configured first",
          "Refresh button syncs real-time schedule changes across all users",
          "Price list shows all surgical procedure fees (surgeon fee only \u2014 excludes facility and anesthesia)",
          "Online booking link is active \u2014 online requests appear in the schedule for staff approval",
          "Appointment type filters, privacy mode, and Show Active view for cancellations/no-shows",
          "Templates can be used for any recurring event including team meetings"
        ],
        demoSteps:[
          "Navigate calendar views using the view selector (8wk / 3mo / 6mo)",
          "Toggle provider calendars on/off from the left panel",
          "Click Find Openings and select appointment type to see available new patient slots",
          "Click Refresh to sync real-time changes",
          "Open the template builder to set recurring appointment types, block times, and simultaneous bookings"
        ],
        watchOuts:[
          "Find Openings only works correctly when appointment templates are configured \u2014 set those up first",
          "Online bookings appear in the schedule but require staff approval before confirmed",
          "Always use Show Active to find cancelled or no-showed appointments \u2014 they do not disappear from the system"
        ]
      },
      {
        name:"New Patient Registration & Patient Portal",
        keyPoints:[
          "Never Before Seen vs Previously Seen: use Previously Seen only for patients migrated from another EMR",
          "Save and Send Portal Invitation triggers both email and text to the patient",
          "Health history form is the most important portal form \u2014 captures medications, allergies, surgeries, health conditions, family history",
          "Marketing/text opt-in on the portal only affects marketing \u2014 not appointment reminders",
          "Portal saves progress page by page \u2014 patients can complete across multiple sessions",
          "Staff-side portal login allows staff to walk patients through forms in the office",
          "Portal invitation can be resent at any time including for health history updates on returning patients"
        ],
        demoSteps:[
          "Complete new patient form: demographics, birthdate, preferred language, reminder settings (10 days + 2 days), emergency contact, referral source, default location",
          "Click Save and Send Portal Invitation to trigger email and text",
          "Log into staff-side portal to walk through health history and consent forms",
          "Review the marketing opt-in field and confirm it does not affect reminders"
        ],
        watchOuts:[
          "Portal invitation email had a sending issue during this demo \u2014 Anna to investigate and fix",
          "Patients sometimes confuse marketing opt-out with appointment reminders \u2014 clarify during registration",
          "Previously Seen designation is for EMR migrations only \u2014 do not use for existing patients returning to the practice"
        ]
      },
      {
        name:"Appointment Management & Patient Status Tracking",
        keyPoints:[
          "Right-click on any appointment to access: edit, cancel (by office or patient), reschedule, contact patient, send portal invite, go to money screen, view appointment history",
          "Patient status stages: Arrived \u2192 Roomed (select room) \u2192 Checked Out",
          "Candy cane color indicator on the schedule = patient checked out but provider has not completed the chart note",
          "Appointment history log tracks every change, who made it, and when \u2014 use to resolve discrepancies"
        ],
        demoSteps:[
          "Right-click an appointment and review all available options",
          "Walk patient through status stages: mark Arrived on arrival, Roomed when in room, Checked Out at completion",
          "Point out candy cane indicator and explain what it signals to the provider",
          "Open appointment history log to show change tracking"
        ],
        watchOuts:[
          "Checking out patients is critical for closing out billing \u2014 especially for surgical cases",
          "Candy cane indicator is a provider cue \u2014 chart note must be completed to clear it",
          "Appointment history log is the authoritative record when patients dispute whether they were notified"
        ]
      },
      {
        name:"Patient Chart \u2014 Summary, Timeline & Profile",
        keyPoints:[
          "Summary tab: demographics, most recent chart note, allergies, alerts, cosmetic balance, insurance balance, past surgeries (in-office and self-reported)",
          "Timeline tab: full communication log with timestamps for all emails, texts, and portal invitations \u2014 includes text messaging box with reusable templates",
          "Unread messages and emails appear as notification badges next to staff name",
          "Y confirmation replies from patients are suppressed from staff notifications to reduce noise",
          "Profile tab: family history, admin comments (persistent alerts visible on every visit), appointment-specific comments"
        ],
        demoSteps:[
          "Open patient chart and review Summary tab sections",
          "Click Timeline and show communication audit trail",
          "Create a reusable text message template from the Timeline tab",
          "Add an admin comment in Profile tab and show how it persists across visits"
        ],
        watchOuts:[
          "Timeline is the source of truth when a patient claims they never received a notification",
          "Admin comments are persistent and visible on every visit \u2014 use for important clinical or billing flags",
          "Insurance balance in the Summary tab reflects OpenPM data \u2014 may lag slightly"
        ]
      },
      {
        name:"Patient Financials",
        keyPoints:[
          "Insurance ledger: insurance transactions, write-offs, patient and insurance balances from OpenPM (managed by Octus)",
          "Patient ledger: cosmetic charges, prepayments, credits, gift cards, cosmetic balances",
          "Staff primarily use the Money screen for financial transactions \u2014 not the Financials tab in the chart",
          "Money screen actions: void/update receipts, accept returns, price adjustments, refunds, account credits",
          "OpenPM data flows automatically between 4D and OpenPM \u2014 staff typically do not work in OpenPM directly"
        ],
        demoSteps:[
          "Show insurance profile area and explain that Octus is configuring insurance via OpenPM",
          "Demonstrate the insurance ledger vs patient ledger distinction",
          "Navigate to Money screen and walk through available transaction types"
        ],
        watchOuts:[
          "Octus is still configuring insurance profiles in OpenPM \u2014 this is not yet fully operational",
          "Do not confuse insurance ledger with patient ledger \u2014 they are separate and serve different purposes",
          "All financial transactions should go through the Money screen, not the Financials tab"
        ]
      },
      {
        name:"Quoting",
        keyPoints:[
          "Create a quote: select provider, template, expiration period (90 days default), quote name (defaults to procedure name)",
          "Always enter a discount reason when applying a discount \u2014 required for tracking purposes",
          "$100 consultation credit is already configured in the system",
          "Quote versioning: save multiple versions without creating duplicates \u2014 old versions remain accessible",
          "Delete moves a quote to inactive, not permanently deleted",
          "Quotes auto-complete when the associated appointment is checked out \u2014 do not manually complete them",
          "Quote actions: view PDF, edit, print, email to patient, view payment history, send for patient signature (portal, in-office, or direct)"
        ],
        demoSteps:[
          "Create a new quote: select provider and template, set 90-day expiration",
          "Add procedures from the price list and review pricing",
          "Apply a discount (percentage or flat dollar) and enter a discount reason",
          "Show quote versioning by saving a version and creating an updated version",
          "Send quote for patient signature via the portal",
          "Email quote directly to patient"
        ],
        watchOuts:[
          "Never manually complete a quote \u2014 it auto-completes when the appointment is checked out",
          "Facility and anesthesia fees for the hospital are not yet in the system \u2014 surgical quotes will be incomplete until added",
          "Quote versioning is the correct way to handle revisions \u2014 do not create duplicate quotes",
          "Discount reason is required every time \u2014 do not skip it"
        ]
      },
      {
        name:"Fax & Lab Requisition Workflows",
        keyPoints:[
          "Fax is enabled in 4D \u2014 fax number: 270-216-6177",
          "4D + Quest Diagnostics integration is in final testing (first-in-country feature) \u2014 not yet live",
          "In the interim: manually complete requisition form and scan it back into 4D under Forms and Scans"
        ],
        demoSteps:[
          "Confirm fax number in system settings",
          "Show Forms and Scans area in the patient chart for uploading scanned requisitions"
        ],
        watchOuts:[
          "Quest integration is not live yet \u2014 use manual form until the integration completes",
          "Scan completed requisition forms back into the chart under Forms and Scans \u2014 do not leave them only on paper"
        ]
      }
    ],
    homework:[
      "Create a test patient (first name + 'Test' as last name) in 4D and complete the full patient portal walkthrough including health history and consent forms",
      "Explore the quoting workflow using the test patient \u2014 build a quote, apply a discount, and send for signature"
    ],
    pending:[
      "Portal invitation email not sending during demo \u2014 Anna to investigate and fix",
      "Facility and anesthesia fees not yet entered \u2014 needed for complete surgical quotes (Dr. Anderson to provide)",
      "Supply/inventory list from Dr. Anderson still being finalized \u2014 needed to complete inventory setup",
      "Insurance setup: Octus still configuring insurance profiles in OpenPM (expected in coming days)",
      "Quest Diagnostics integration: in final testing, not yet live \u2014 use manual requisition forms in interim",
      "Surgical estimate PDF template \u2014 Anna to modify after the call"
    ],
    nextSession:"Quoting in depth, text/email templates, and remaining system features. Schedule for next day and following week.",
    notes:"Gusto clock-in/clock-out access issues being resolved by Davina. Staff impressed \u2014 had already started training modules on their first day.",
    ts:1754006400000
  }];
  save(SK+"_playbooks",trainingPlaybooks);
}

// ── TRAINING PLAYBOOKS ────────────────────────────────────────────────────────
function rTraining(body){
  if(tpStep===1){rTPIntake(body);return;}
  if(tpStep===2){rTPTranscript(body);return;}
  if(tpStep===3){rTPReview(body);return;}
  if(tpStep===4){rTPRead(body);return;}
  if(tpStep===5){rTPEdit(body);return;}
  rTPList(body);
}

function saveTP(){
  var idx=trainingPlaybooks.findIndex(function(p){return p.id===tpCurrent.id;});
  if(idx>=0)trainingPlaybooks[idx]=JSON.parse(JSON.stringify(tpCurrent));
  else trainingPlaybooks.unshift(JSON.parse(JSON.stringify(tpCurrent)));
  save(SK+"_playbooks",trainingPlaybooks);
}

function rTPList(body){
  var h='<div style="max-width:860px;margin:0 auto">';
  h+='<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px">';
  h+='<div><h2 style="font-family:Playfair Display,serif;font-size:20px;color:var(--navy);margin:0">Training Playbooks</h2>';
  h+='<p style="font-size:11px;color:var(--text3);margin:4px 0 0">Paste a session transcript \u2192 AI extracts a reusable playbook for your team</p></div>';
  h+='<button id="tp-new" style="background:var(--navy);color:#fff;border:none;border-radius:8px;padding:9px 18px;font-size:12px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif">+ New Playbook</button></div>';

  var platforms=["4D","Nextech w/ P+","Nextech Cloud","Symplast","ModMed","Weave","General"];
  var typeLabels={new_staff:"New Staff Onboarding",go_live:"Go-Live Training",refresher:"Refresher",feature:"Feature Deep Dive",general:"General"};
  var typeColors={new_staff:"#3B82F6",go_live:"#059669",refresher:"#D97706",feature:"#7C3AED",general:"#6B7280"};
  var platColors={"4D":"#C9A84C","Nextech w/ P+":"#1D4ED8","Nextech Cloud":"#2563EB","Symplast":"#7C3AED","ModMed":"#DC2626","Weave":"#059669","General":"#6B7280"};

  if(!trainingPlaybooks.length){
    h+='<div style="background:var(--navy);border-radius:12px;padding:32px;text-align:center">';
    h+='<div style="font-size:32px;margin-bottom:12px">\ud83c\udfaf</div>';
    h+='<div style="font-size:16px;font-weight:700;color:#fff;margin-bottom:6px">No playbooks yet</div>';
    h+='<div style="font-size:12px;color:rgba(255,255,255,.5);margin-bottom:20px">Paste a Zoom or Plaud transcript from a training session and AI builds the playbook for you</div>';
    h+='<button id="tp-new2" style="background:var(--gold);color:var(--navy);border:none;border-radius:8px;padding:10px 22px;font-size:13px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif">+ Create First Playbook</button></div>';
  } else {
    platforms.forEach(function(plat){
      var platBooks=trainingPlaybooks.filter(function(p){return p.platform===plat;});
      if(!platBooks.length)return;
      h+='<div style="margin-bottom:20px">';
      h+='<div style="font-size:10px;font-weight:800;color:var(--text3);text-transform:uppercase;letter-spacing:.8px;margin-bottom:10px;padding-bottom:5px;border-bottom:1px solid var(--tan2)">'+esc(plat)+'</div>';
      platBooks.forEach(function(pb){
        var tLabel=typeLabels[pb.sessionType]||pb.sessionType;
        var tColor=typeColors[pb.sessionType]||"#6B7280";
        var pColor=platColors[pb.platform]||"#6B7280";
        h+='<div class="tp-card" data-id="'+pb.id+'" style="background:#fff;border:1px solid var(--tan2);border-radius:10px;padding:14px 16px;margin-bottom:8px;cursor:pointer;transition:box-shadow .15s">';
        h+='<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px">';
        h+='<div style="flex:1">';
        h+='<div style="display:flex;align-items:center;gap:8px;margin-bottom:5px">';
        h+='<span style="font-size:10px;font-weight:700;background:'+pColor+';color:#fff;padding:2px 8px;border-radius:10px">'+esc(pb.platform)+'</span>';
        h+='<span style="font-size:10px;font-weight:700;color:'+tColor+';background:'+tColor+'18;padding:2px 8px;border-radius:10px;border:1px solid '+tColor+'40">'+tLabel+'</span>';
        if(pb.client)h+='<span style="font-size:10px;color:var(--text3)">'+esc(pb.client)+'</span>';
        h+='</div>';
        h+='<div style="font-size:14px;font-weight:700;color:var(--navy);margin-bottom:3px">'+esc(pb.title||pb.platform+" Training")+'</div>';
        if(pb.topics&&pb.topics.length)h+='<div style="font-size:11px;color:var(--text3)">'+pb.topics.length+' topics covered</div>';
        h+='<div style="font-size:10px;color:var(--text3);margin-top:4px">'+new Date(pb.ts).toLocaleDateString()+'</div>';
        h+='</div>';
        h+='<div style="display:flex;gap:6px;flex-shrink:0">';
        h+='<button class="tp-del" data-id="'+pb.id+'" style="background:none;border:1px solid #fca5a5;color:#dc2626;border-radius:6px;padding:4px 10px;font-size:11px;cursor:pointer">\u00d7</button>';
        h+='</div></div></div>';
      });
      h+='</div>';
    });
  }
  h+='</div>';
  body.innerHTML=h;

  var newBtns=body.querySelectorAll("#tp-new,#tp-new2");
  newBtns.forEach(function(btn){
    btn.addEventListener("click",function(){
      tpCurrent={id:uid(),title:"",platform:"4D",sessionType:"new_staff",client:"",sessionNum:1,transcript:"",topics:[],homework:[],pending:[],nextSession:"",notes:"",ts:Date.now()};
      tpStep=1;rTraining(body);
    });
  });
  body.querySelectorAll(".tp-card").forEach(function(card){
    card.addEventListener("click",function(e){
      if(e.target.classList.contains("tp-del"))return;
      var pb=trainingPlaybooks.find(function(p){return p.id===card.dataset.id;});
      if(pb){tpCurrent=JSON.parse(JSON.stringify(pb));tpStep=4;rTraining(body);}
    });
  });
  body.querySelectorAll(".tp-del").forEach(function(btn){
    btn.addEventListener("click",function(e){
      e.stopPropagation();
      if(!confirm("Delete this playbook?"))return;
      trainingPlaybooks=trainingPlaybooks.filter(function(p){return p.id!==btn.dataset.id;});
      save(SK+"_playbooks",trainingPlaybooks);rTraining(body);
    });
  });
}

function rTPIntake(body){
  var platOpts=["4D","Nextech w/ P+","Nextech Cloud","Symplast","ModMed","Weave","General"];
  var typeOpts=[{v:"new_staff",l:"New Staff Onboarding"},{v:"go_live",l:"Go-Live Training"},{v:"refresher",l:"Refresher / Follow-Up"},{v:"feature",l:"Feature Deep Dive"},{v:"general",l:"General Training"}];
  var h='<div style="max-width:700px;margin:0 auto">';
  h+='<button id="tp-back" style="background:none;border:none;color:var(--navy);font-size:12px;font-weight:700;cursor:pointer;padding:0;margin-bottom:16px">\u2190 Back</button>';
  h+='<div style="background:#fff;border:1px solid var(--tan2);border-radius:12px;padding:24px">';
  h+='<h2 style="font-family:Playfair Display,serif;font-size:18px;color:var(--navy);margin:0 0 18px">New Training Playbook</h2>';
  h+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:16px">';
  h+='<div style="grid-column:span 2"><label style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.4px;color:var(--navy);display:block;margin-bottom:4px">Platform *</label>';
  h+='<select id="tp-platform" style="width:100%;padding:8px 12px;border:1px solid var(--tan2);border-radius:7px;font-size:13px;font-family:Inter,sans-serif;color:var(--navy)">';
  platOpts.forEach(function(p){h+='<option value="'+p+'"'+(p===tpCurrent.platform?' selected':'')+'>'+p+'</option>';});
  h+='</select></div>';
  h+='<div><label style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.4px;color:var(--navy);display:block;margin-bottom:4px">Session Type *</label>';
  h+='<select id="tp-type" style="width:100%;padding:8px 12px;border:1px solid var(--tan2);border-radius:7px;font-size:13px;font-family:Inter,sans-serif;color:var(--navy)">';
  typeOpts.forEach(function(o){h+='<option value="'+o.v+'"'+(o.v===tpCurrent.sessionType?' selected':'')+'>'+o.l+'</option>';});
  h+='</select></div>';
  h+='<div><label style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.4px;color:var(--navy);display:block;margin-bottom:4px">Session Number</label>';
  h+='<input id="tp-sesnum" type="number" value="'+tpCurrent.sessionNum+'" min="1" style="width:100%;padding:8px 12px;border:1px solid var(--tan2);border-radius:7px;font-size:13px;font-family:Inter,sans-serif;color:var(--navy);box-sizing:border-box"></div>';
  h+='<div style="grid-column:span 2"><label style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.4px;color:var(--navy);display:block;margin-bottom:4px">Client / Practice Name (optional)</label>';
  h+='<input id="tp-client" type="text" value="'+esc(tpCurrent.client)+'" placeholder="e.g. Anderson Plastic Surgery" style="width:100%;padding:8px 12px;border:1px solid var(--tan2);border-radius:7px;font-size:13px;font-family:Inter,sans-serif;color:var(--navy);box-sizing:border-box"></div>';
  h+='</div>';
  h+='<button id="tp-next" style="background:var(--navy);color:#fff;border:none;border-radius:8px;padding:11px 24px;font-size:13px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif">Paste Transcript \u2192</button>';
  h+='</div></div>';
  body.innerHTML=h;
  document.getElementById("tp-back").addEventListener("click",function(){tpStep=0;rTraining(body);});
  document.getElementById("tp-next").addEventListener("click",function(){
    tpCurrent.platform=document.getElementById("tp-platform").value;
    tpCurrent.sessionType=document.getElementById("tp-type").value;
    tpCurrent.sessionNum=parseInt(document.getElementById("tp-sesnum").value)||1;
    tpCurrent.client=document.getElementById("tp-client").value.trim();
    var typeLabels={new_staff:"New Staff Onboarding",go_live:"Go-Live Training",refresher:"Refresher",feature:"Feature Deep Dive",general:"General Training"};
    tpCurrent.title=tpCurrent.platform+" \u2014 "+(typeLabels[tpCurrent.sessionType]||"Training")+", Session "+tpCurrent.sessionNum;
    tpStep=2;rTraining(body);
  });
}

function rTPTranscript(body){
  var h='<div style="max-width:800px;margin:0 auto">';
  h+='<button id="tp-back" style="background:none;border:none;color:var(--navy);font-size:12px;font-weight:700;cursor:pointer;padding:0;margin-bottom:14px">\u2190 Back</button>';
  h+='<div style="background:#fff;border:1px solid var(--tan2);border-radius:12px;padding:24px">';
  h+='<h2 style="font-family:Playfair Display,serif;font-size:18px;color:var(--navy);margin:0 0 6px">'+esc(tpCurrent.title)+'</h2>';
  h+='<p style="font-size:12px;color:var(--text3);margin:0 0 18px">Paste your Zoom AI summary, Plaud transcript, or your own notes from the session.</p>';
  h+='<textarea id="tp-transcript" style="width:100%;height:320px;padding:12px;border:1px solid var(--tan2);border-radius:8px;font-size:12px;font-family:Inter,sans-serif;color:var(--navy);resize:vertical;box-sizing:border-box;line-height:1.6" placeholder="Paste session transcript or notes here...">'+esc(tpCurrent.transcript)+'</textarea>';
  h+='<div style="display:flex;gap:10px;margin-top:14px">';
  h+='<button id="tp-back2" style="flex:1;padding:11px;border-radius:8px;border:1.5px solid var(--tan2);background:none;color:var(--navy);font-size:13px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif">\u2190 Back</button>';
  h+='<button id="tp-extract" style="flex:2;padding:11px;border-radius:8px;border:none;background:var(--navy);color:#fff;font-size:13px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif">\u2728 Extract Playbook with AI \u2192</button>';
  h+='</div></div></div>';
  body.innerHTML=h;
  document.getElementById("tp-back").addEventListener("click",function(){tpStep=1;rTraining(body);});
  document.getElementById("tp-back2").addEventListener("click",function(){tpStep=1;rTraining(body);});
  document.getElementById("tp-extract").addEventListener("click",function(){
    var t=document.getElementById("tp-transcript").value.trim();
    if(!t){alert("Paste a transcript first.");return;}
    tpCurrent.transcript=t;
    extractPlaybook(body);
  });
}

function extractPlaybook(body){
  body.innerHTML='<div style="max-width:700px;margin:80px auto;text-align:center;padding:40px">'
    +'<div style="font-size:40px;margin-bottom:16px">\ud83c\udfaf</div>'
    +'<div style="font-family:Playfair Display,serif;font-size:20px;color:var(--navy);margin-bottom:8px">Building your playbook...</div>'
    +'<div style="font-size:13px;color:var(--text3)">Reading the transcript and extracting topics, key points, watch-outs, and next steps</div></div>';

  var systemPrompt="You are a medical practice technology training specialist. Extract a structured training playbook from a session transcript. Return ONLY valid JSON, no markdown, no explanation. The JSON must have this exact structure:\n{\"title\":\"string\",\"sessionSummary\":\"2-3 sentence summary of what was covered\",\"topics\":[{\"name\":\"string\",\"keyPoints\":[\"string\"],\"demoSteps\":[\"string or empty array\"],\"watchOuts\":[\"string or empty array\"]}],\"homework\":[\"string\"],\"pending\":[\"string\"],\"nextSession\":\"string\",\"notes\":\"string\"}\n\nRules:\n- topics: each major area covered in the session, with key talking points the trainer emphasized\n- keyPoints: what staff need to know or remember about this topic\n- demoSteps: specific steps demonstrated (e.g. 'Right-click appointment > Edit > select status')\n- watchOuts: things Anna flagged as important caveats, common mistakes, or things to watch for\n- homework: tasks assigned to staff or client before next session\n- pending: items not yet set up or resolved that need follow-up\n- nextSession: what will be covered in the next training session\n- notes: any other context worth capturing";

  var userMsg="Session: "+tpCurrent.title+(tpCurrent.client?" for "+tpCurrent.client:"")+"\n\nTranscript:\n"+tpCurrent.transcript.slice(0,12000);

  fetch("https://api.anthropic.com/v1/messages",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      model:"claude-sonnet-4-6",
      max_tokens:2000,
      system:systemPrompt,
      messages:[{role:"user",content:userMsg}]
    })
  }).then(function(r){return r.json();}).then(function(data){
    var text=(data.content||[]).filter(function(b){return b.type==="text";}).map(function(b){return b.text;}).join("");
    try{
      var clean=text.replace(/```json|```/g,"").trim();
      var parsed=JSON.parse(clean);
      tpCurrent.title=parsed.title||tpCurrent.title;
      tpCurrent.sessionSummary=parsed.sessionSummary||"";
      tpCurrent.topics=parsed.topics||[];
      tpCurrent.homework=parsed.homework||[];
      tpCurrent.pending=parsed.pending||[];
      tpCurrent.nextSession=parsed.nextSession||"";
      tpCurrent.notes=parsed.notes||"";
      tpStep=3;rTraining(body);
    }catch(e){
      body.innerHTML='<div style="max-width:700px;margin:0 auto;padding:24px">'
        +'<div style="background:#FFF5F5;border:1px solid #FEE2E2;border-radius:10px;padding:16px;color:#DC2626;font-size:13px;margin-bottom:16px">Could not parse AI response. Try again or paste a more structured transcript.</div>'
        +'<button id="tp-retry" style="background:var(--navy);color:#fff;border:none;border-radius:8px;padding:10px 20px;font-size:13px;font-weight:700;cursor:pointer">Try Again</button></div>';
      if(document.getElementById("tp-retry"))document.getElementById("tp-retry").addEventListener("click",function(){tpStep=2;rTraining(body);});
    }
  }).catch(function(){
    tpStep=2;rTraining(body);
    alert("Network error. Check connection and try again.");
  });
}

function rTPReview(body){
  var h='<div style="max-width:860px;margin:0 auto">';
  h+='<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">';
  h+='<div><h2 style="font-family:Playfair Display,serif;font-size:20px;color:var(--navy);margin:0">Review Playbook</h2>';
  h+='<p style="font-size:11px;color:var(--text3);margin:4px 0 0">Check what the AI extracted. Edit anything that needs adjusting, then save.</p></div>';
  h+='<div style="display:flex;gap:8px">';
  h+='<button id="tp-back" style="background:none;border:1.5px solid var(--tan2);color:var(--navy);border-radius:8px;padding:8px 14px;font-size:12px;font-weight:700;cursor:pointer">\u2190 Back</button>';
  h+='<button id="tp-save" style="background:var(--gold);color:var(--navy);border:none;border-radius:8px;padding:8px 16px;font-size:12px;font-weight:700;cursor:pointer">\u2713 Save Playbook</button>';
  h+='</div></div>';

  // Title
  h+='<div style="background:#fff;border:1px solid var(--tan2);border-radius:12px;padding:18px;margin-bottom:10px">';
  h+='<label style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.4px;color:var(--navy);display:block;margin-bottom:6px">Title</label>';
  h+='<input id="tp-title" type="text" value="'+esc(tpCurrent.title)+'" style="width:100%;padding:8px 12px;border:1px solid var(--tan2);border-radius:7px;font-size:14px;font-weight:700;font-family:Inter,sans-serif;color:var(--navy);box-sizing:border-box">';
  if(tpCurrent.sessionSummary){
    h+='<p style="font-size:12px;color:var(--text2);margin:10px 0 0;line-height:1.6">'+esc(tpCurrent.sessionSummary)+'</p>';
  }
  h+='</div>';

  // Topics
  tpCurrent.topics.forEach(function(topic,ti){
    h+='<div style="background:#fff;border:1px solid var(--tan2);border-radius:12px;margin-bottom:8px;overflow:hidden">';
    h+='<div style="background:var(--navy);padding:10px 16px"><span style="font-size:13px;font-weight:700;color:#fff">'+esc(topic.name)+'</span></div>';
    h+='<div style="padding:12px 16px">';
    if(topic.keyPoints&&topic.keyPoints.length){
      h+='<div style="font-size:10px;font-weight:700;text-transform:uppercase;color:var(--gold);letter-spacing:.5px;margin-bottom:6px">Key Points</div>';
      topic.keyPoints.forEach(function(kp){h+='<div style="font-size:12px;color:var(--navy);padding:3px 0;padding-left:14px;position:relative">&#x2022; '+esc(kp)+'</div>';});
    }
    if(topic.demoSteps&&topic.demoSteps.length){
      h+='<div style="font-size:10px;font-weight:700;text-transform:uppercase;color:#3B82F6;letter-spacing:.5px;margin-top:10px;margin-bottom:6px">Demo Steps</div>';
      topic.demoSteps.forEach(function(ds,i){h+='<div style="font-size:11px;color:#1D4ED8;padding:2px 0;padding-left:14px">'+(i+1)+'. '+esc(ds)+'</div>';});
    }
    if(topic.watchOuts&&topic.watchOuts.length){
      h+='<div style="font-size:10px;font-weight:700;text-transform:uppercase;color:#DC2626;letter-spacing:.5px;margin-top:10px;margin-bottom:6px">\u26a0\ufe0f Watch-Outs</div>';
      topic.watchOuts.forEach(function(wo){h+='<div style="font-size:12px;color:#DC2626;padding:3px 0;padding-left:14px">&#x2022; '+esc(wo)+'</div>';});
    }
    h+='</div></div>';
  });

  // Homework, Pending, Next Session
  function reviewSection(title,items,color,id){
    if(!items||!items.length)return'';
    var s='<div style="background:#fff;border:1px solid var(--tan2);border-radius:10px;padding:14px 16px;margin-bottom:8px">';
    s+='<div style="font-size:10px;font-weight:800;text-transform:uppercase;color:'+color+';letter-spacing:.6px;margin-bottom:8px">'+title+'</div>';
    items.forEach(function(item){s+='<div style="font-size:12px;color:var(--navy);padding:3px 0">&#x2022; '+esc(item)+'</div>';});
    return s+'</div>';
  }
  if(tpCurrent.homework&&tpCurrent.homework.length)h+=reviewSection("\u{1F4CB} Homework Assigned",tpCurrent.homework,"#7C3AED","tp-hw");
  if(tpCurrent.pending&&tpCurrent.pending.length)h+=reviewSection("\u23f3 Pending Items",tpCurrent.pending,"#D97706","tp-pend");
  if(tpCurrent.nextSession){
    h+='<div style="background:#fff;border:1px solid var(--tan2);border-radius:10px;padding:14px 16px;margin-bottom:8px">';
    h+='<div style="font-size:10px;font-weight:800;text-transform:uppercase;color:#059669;letter-spacing:.6px;margin-bottom:6px">\u27a1\ufe0f Next Session</div>';
    h+='<div style="font-size:12px;color:var(--navy)">'+esc(tpCurrent.nextSession)+'</div></div>';
  }

  h+='<div style="display:flex;gap:10px;margin-top:6px;margin-bottom:40px">';
  h+='<button id="tp-save2" style="flex:1;padding:12px;border-radius:8px;border:none;background:var(--navy);color:#fff;font-size:13px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif">\u2713 Save Playbook</button>';
  h+='</div></div>';
  body.innerHTML=h;

  function doSave(){
    tpCurrent.title=document.getElementById("tp-title").value.trim()||tpCurrent.title;
    tpCurrent.ts=Date.now();
    saveTP();
    tpStep=4;rTraining(body);
  }
  document.getElementById("tp-back").addEventListener("click",function(){tpStep=2;rTraining(body);});
  document.getElementById("tp-save").addEventListener("click",doSave);
  if(document.getElementById("tp-save2"))document.getElementById("tp-save2").addEventListener("click",doSave);
}

function rTPRead(body){
  var pb=tpCurrent;
  var typeLabels={new_staff:"New Staff Onboarding",go_live:"Go-Live Training",refresher:"Refresher",feature:"Feature Deep Dive",general:"General Training"};
  var h='<div style="max-width:860px;margin:0 auto">';
  h+='<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">';
  h+='<button id="tp-back" style="background:none;border:none;color:var(--navy);font-size:12px;font-weight:700;cursor:pointer;padding:0">\u2190 All Playbooks</button>';
  h+='<button id="tp-edit" style="background:none;border:1.5px solid var(--tan2);color:var(--navy);border-radius:7px;padding:6px 14px;font-size:12px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif">\u270f Edit Playbook</button>';
  h+='</div>';

  // Cover
  h+='<div style="background:var(--navy);border-radius:12px;padding:24px;margin-bottom:12px">';
  h+='<div style="font-size:10px;font-weight:700;color:var(--gold);text-transform:uppercase;letter-spacing:.8px;margin-bottom:8px">ACG Practice Partners \u00b7 '+esc(pb.platform)+'</div>';
  h+='<div style="font-family:Playfair Display,serif;font-size:22px;color:#fff;margin-bottom:6px">'+esc(pb.title)+'</div>';
  if(pb.client)h+='<div style="font-size:12px;color:rgba(255,255,255,.5)">'+esc(pb.client)+' \u00b7 '+(typeLabels[pb.sessionType]||pb.sessionType)+' \u00b7 '+new Date(pb.ts).toLocaleDateString()+'</div>';
  h+='<div style="display:flex;gap:10px;margin-top:16px">';
  h+='<div style="background:rgba(255,255,255,.08);border-radius:8px;padding:10px 14px;text-align:center">';
  h+='<div style="font-size:20px;font-weight:800;color:#fff">'+(pb.topics||[]).length+'</div><div style="font-size:10px;color:rgba(255,255,255,.4)">Topics</div></div>';
  h+='<div style="background:rgba(255,255,255,.08);border-radius:8px;padding:10px 14px;text-align:center">';
  h+='<div style="font-size:20px;font-weight:800;color:#fff">'+(pb.homework||[]).length+'</div><div style="font-size:10px;color:rgba(255,255,255,.4)">Homework</div></div>';
  h+='<div style="background:rgba(255,255,255,.08);border-radius:8px;padding:10px 14px;text-align:center">';
  h+='<div style="font-size:20px;font-weight:800;color:#fff">'+(pb.pending||[]).length+'</div><div style="font-size:10px;color:rgba(255,255,255,.4)">Pending</div></div>';
  h+='</div></div>';

  if(pb.sessionSummary){
    h+='<div style="background:#fff;border:1px solid var(--tan2);border-radius:10px;padding:14px 16px;margin-bottom:10px">';
    h+='<div style="font-size:10px;font-weight:800;text-transform:uppercase;color:var(--text3);letter-spacing:.6px;margin-bottom:6px">Session Summary</div>';
    h+='<div style="font-size:13px;color:var(--navy);line-height:1.6">'+esc(pb.sessionSummary)+'</div></div>';
  }

  // Topics
  (pb.topics||[]).forEach(function(topic){
    h+='<div style="background:#fff;border:1px solid var(--tan2);border-radius:12px;margin-bottom:8px;overflow:hidden">';
    h+='<div style="background:var(--navy);padding:12px 16px"><span style="font-size:14px;font-weight:700;color:#fff">'+esc(topic.name)+'</span></div>';
    h+='<div style="padding:14px 16px">';
    if(topic.keyPoints&&topic.keyPoints.length){
      h+='<div style="font-size:10px;font-weight:700;text-transform:uppercase;color:var(--gold);letter-spacing:.5px;margin-bottom:8px">Key Points</div>';
      topic.keyPoints.forEach(function(kp){h+='<div style="font-size:12px;color:var(--navy);padding:4px 0;border-bottom:1px solid var(--tan);padding-left:16px">&#x2022; '+esc(kp)+'</div>';});
    }
    if(topic.demoSteps&&topic.demoSteps.length){
      h+='<div style="font-size:10px;font-weight:700;text-transform:uppercase;color:#1D4ED8;letter-spacing:.5px;margin-top:12px;margin-bottom:8px">Demo Steps</div>';
      topic.demoSteps.forEach(function(ds,i){
        h+='<div style="font-size:12px;color:#1D4ED8;padding:4px 0;border-bottom:1px solid #EFF6FF;padding-left:16px">'+(i+1)+'. '+esc(ds)+'</div>';
      });
    }
    if(topic.watchOuts&&topic.watchOuts.length){
      h+='<div style="font-size:10px;font-weight:700;text-transform:uppercase;color:#DC2626;letter-spacing:.5px;margin-top:12px;margin-bottom:8px">\u26a0\ufe0f Watch-Outs</div>';
      topic.watchOuts.forEach(function(wo){
        h+='<div style="font-size:12px;color:#DC2626;padding:4px 0;border-bottom:1px solid #FFF5F5;padding-left:16px">&#x2022; '+esc(wo)+'</div>';
      });
    }
    h+='</div></div>';
  });

  if(pb.homework&&pb.homework.length){
    h+='<div style="background:#fff;border:1px solid var(--tan2);border-radius:10px;padding:14px 16px;margin-bottom:8px">';
    h+='<div style="font-size:10px;font-weight:800;text-transform:uppercase;color:#7C3AED;letter-spacing:.6px;margin-bottom:8px">\ud83d\udccb Homework Assigned</div>';
    pb.homework.forEach(function(hw){h+='<div style="font-size:12px;color:var(--navy);padding:4px 0;border-bottom:1px solid var(--tan)">&#x2714; '+esc(hw)+'</div>';});
    h+='</div>';
  }
  if(pb.pending&&pb.pending.length){
    h+='<div style="background:#FFF5F5;border:1px solid #FEE2E2;border-radius:10px;padding:14px 16px;margin-bottom:8px">';
    h+='<div style="font-size:10px;font-weight:800;text-transform:uppercase;color:#DC2626;letter-spacing:.6px;margin-bottom:8px">\u23f3 Pending / Outstanding</div>';
    pb.pending.forEach(function(p){h+='<div style="font-size:12px;color:#DC2626;padding:4px 0;border-bottom:1px solid #FEE2E2">&#x2192; '+esc(p)+'</div>';});
    h+='</div>';
  }
  if(pb.nextSession){
    h+='<div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:10px;padding:14px 16px;margin-bottom:8px">';
    h+='<div style="font-size:10px;font-weight:800;text-transform:uppercase;color:#059669;letter-spacing:.6px;margin-bottom:6px">\u27a1\ufe0f Next Session</div>';
    h+='<div style="font-size:13px;color:var(--navy)">'+esc(pb.nextSession)+'</div></div>';
  }
  h+='<div style="margin-bottom:40px"></div></div>';
  body.innerHTML=h;
  document.getElementById("tp-back").addEventListener("click",function(){tpStep=0;rTraining(body);});
  if(document.getElementById("tp-edit"))document.getElementById("tp-edit").addEventListener("click",function(){tpStep=5;rTraining(body);});
}



function rTPEdit(body){
  var pb=tpCurrent;
  function ta(val,id,rows){
    rows=rows||3;
    return '<textarea id="'+id+'" rows="'+rows+'" style="width:100%;padding:8px 10px;border:1px solid var(--tan2);border-radius:6px;font-size:12px;font-family:Inter,sans-serif;color:var(--navy);resize:vertical;box-sizing:border-box;line-height:1.5">'+esc(val)+'</textarea>';
  }
  function inp(val,id){
    return '<input id="'+id+'" type="text" value="'+esc(val)+'" style="width:100%;padding:7px 10px;border:1px solid var(--tan2);border-radius:6px;font-size:13px;font-family:Inter,sans-serif;color:var(--navy);box-sizing:border-box">';
  }
  function lbl(text){
    return '<label style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.4px;color:var(--navy);display:block;margin-bottom:4px">'+text+'</label>';
  }
  function field(label,content){
    return '<div style="margin-bottom:12px">'+lbl(label)+content+'</div>';
  }
  function arrToLines(arr){return (arr||[]).join("\n");}

  var h='<div style="max-width:860px;margin:0 auto">';
  h+='<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">';
  h+='<button id="tpe-back" style="background:none;border:none;color:var(--navy);font-size:12px;font-weight:700;cursor:pointer;padding:0">\u2190 Cancel</button>';
  h+='<button id="tpe-save" style="background:var(--gold);color:var(--navy);border:none;border-radius:8px;padding:8px 18px;font-size:12px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif">\u2713 Save Changes</button>';
  h+='</div>';

  // Title + summary
  h+='<div style="background:#fff;border:1px solid var(--tan2);border-radius:12px;padding:18px;margin-bottom:10px">';
  h+=field("Title",inp(pb.title,"tpe-title"));
  h+=field("Session Summary (2-3 sentences)",ta(pb.sessionSummary||"","tpe-summary",3));
  h+='</div>';

  // Topics
  (pb.topics||[]).forEach(function(topic,ti){
    h+='<div style="background:#fff;border:1px solid var(--tan2);border-radius:12px;margin-bottom:8px;overflow:hidden">';
    h+='<div style="background:var(--navy);padding:10px 16px">';
    h+='<input class="tpe-topic-name" data-ti="'+ti+'" value="'+esc(topic.name)+'" style="width:100%;background:transparent;border:none;border-bottom:1px solid rgba(255,255,255,.2);color:#fff;font-size:13px;font-weight:700;font-family:Inter,sans-serif;padding:2px 0;outline:none">';
    h+='</div>';
    h+='<div style="padding:14px 16px">';
    h+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">';
    h+='<div>'+lbl("\u2022 Key Points (one per line)")+'<textarea class="tpe-kp" data-ti="'+ti+'" rows="6" style="width:100%;padding:7px 9px;border:1px solid var(--tan2);border-radius:6px;font-size:11px;font-family:Inter,sans-serif;color:var(--navy);resize:vertical;box-sizing:border-box;line-height:1.5">'+esc(arrToLines(topic.keyPoints))+'</textarea></div>';
    h+='<div>'+lbl("\u26a0\ufe0f Watch-Outs (one per line)")+'<textarea class="tpe-wo" data-ti="'+ti+'" rows="6" style="width:100%;padding:7px 9px;border:1px solid var(--tan2);border-radius:6px;font-size:11px;font-family:Inter,sans-serif;color:var(--navy);resize:vertical;box-sizing:border-box;line-height:1.5">'+esc(arrToLines(topic.watchOuts))+'</textarea></div>';
    h+='<div style="grid-column:span 2">'+lbl("\ud83c\udfaf Demo Steps (one per line)")+'<textarea class="tpe-ds" data-ti="'+ti+'" rows="4" style="width:100%;padding:7px 9px;border:1px solid var(--tan2);border-radius:6px;font-size:11px;font-family:Inter,sans-serif;color:var(--navy);resize:vertical;box-sizing:border-box;line-height:1.5">'+esc(arrToLines(topic.demoSteps))+'</textarea></div>';
    h+='</div></div></div>';
  });

  // Homework, Pending, Next Session, Notes
  h+='<div style="background:#fff;border:1px solid var(--tan2);border-radius:12px;padding:18px;margin-bottom:10px">';
  h+=field("\ud83d\udccb Homework Assigned (one per line)",ta(arrToLines(pb.homework),"tpe-hw",4));
  h+=field("\u23f3 Pending Items (one per line)",ta(arrToLines(pb.pending),"tpe-pending",4));
  h+=field("\u27a1\ufe0f Next Session",ta(pb.nextSession||"","tpe-next",2));
  h+=field("Notes",ta(pb.notes||"","tpe-notes",2));
  h+='</div>';

  h+='<div style="display:flex;gap:10px;margin-bottom:40px">';
  h+='<button id="tpe-save2" style="flex:1;padding:12px;border-radius:8px;border:none;background:var(--navy);color:#fff;font-size:13px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif">\u2713 Save Changes</button>';
  h+='</div></div>';
  body.innerHTML=h;

  function linesToArr(str){return str.split("\n").map(function(s){return s.trim();}).filter(Boolean);}

  function doSave(){
    tpCurrent.title=document.getElementById("tpe-title").value.trim()||tpCurrent.title;
    tpCurrent.sessionSummary=document.getElementById("tpe-summary").value.trim();
    tpCurrent.homework=linesToArr(document.getElementById("tpe-hw").value);
    tpCurrent.pending=linesToArr(document.getElementById("tpe-pending").value);
    tpCurrent.nextSession=document.getElementById("tpe-next").value.trim();
    tpCurrent.notes=document.getElementById("tpe-notes").value.trim();
    // Topics
    body.querySelectorAll(".tpe-topic-name").forEach(function(el){
      var ti=parseInt(el.dataset.ti);
      if(tpCurrent.topics[ti])tpCurrent.topics[ti].name=el.value.trim();
    });
    body.querySelectorAll(".tpe-kp").forEach(function(ta){
      var ti=parseInt(ta.dataset.ti);
      if(tpCurrent.topics[ti])tpCurrent.topics[ti].keyPoints=linesToArr(ta.value);
    });
    body.querySelectorAll(".tpe-wo").forEach(function(ta){
      var ti=parseInt(ta.dataset.ti);
      if(tpCurrent.topics[ti])tpCurrent.topics[ti].watchOuts=linesToArr(ta.value);
    });
    body.querySelectorAll(".tpe-ds").forEach(function(ta){
      var ti=parseInt(ta.dataset.ti);
      if(tpCurrent.topics[ti])tpCurrent.topics[ti].demoSteps=linesToArr(ta.value);
    });
    tpCurrent.ts=Date.now();
    saveTP();
    tpStep=4;rTraining(body);
  }

  document.getElementById("tpe-back").addEventListener("click",function(){tpStep=4;rTraining(body);});
  document.getElementById("tpe-save").addEventListener("click",doSave);
  if(document.getElementById("tpe-save2"))document.getElementById("tpe-save2").addEventListener("click",doSave);
}


if(typeof seedPlaybooks==="function"&&!trainingPlaybooks.length)seedPlaybooks();
init();