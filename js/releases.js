// ── RELEASE NOTE MODAL & AI PARSING ──────────────────────────────────────────
function openReleaseNoteModal(practice){
  var overlay=document.createElement('div');
  overlay.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:400;display:flex;align-items:center;justify-content:center;padding:20px';
  var emrOptions=["4D","Nextech w/ P+","Nextech Cloud","Symplast","ModMed","AestheticsPro","Other"];
  var modal='<div style="background:#fff;border-radius:14px;padding:24px;max-width:600px;width:100%;max-height:90vh;overflow-y:auto">';
  modal+='<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">';
  modal+='<h3 style="font-family:Playfair Display,serif;font-size:18px;color:var(--navy);margin:0">Paste Release Note</h3>';
  modal+='<button id="rn-close" style="background:none;border:none;font-size:20px;cursor:pointer;color:var(--text3)">×</button></div>';
  modal+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px">';
  modal+='<div><label style="font-size:10px;font-weight:700;color:var(--navy);display:block;margin-bottom:4px;text-transform:uppercase;letter-spacing:.4px">Platform *</label>';
  modal+='<select id="rn-platform" style="width:100%;padding:8px;border:1px solid var(--tan2);border-radius:6px;font-size:13px;font-family:Inter,sans-serif;color:var(--navy)">';
  emrOptions.forEach(function(o){modal+='<option'+(practice.emr===o?' selected':'')+'>'+o+'</option>';});
  modal+='</select></div>';
  modal+='<div><label style="font-size:10px;font-weight:700;color:var(--navy);display:block;margin-bottom:4px;text-transform:uppercase;letter-spacing:.4px">Version / Date</label>';
  modal+='<input id="rn-version" type="text" placeholder="e.g. 8.2 or June 2025" style="width:100%;padding:8px;border:1px solid var(--tan2);border-radius:6px;font-size:13px;font-family:Inter,sans-serif;color:var(--navy);box-sizing:border-box"></div></div>';
  modal+='<div style="margin-bottom:12px"><label style="font-size:10px;font-weight:700;color:var(--navy);display:block;margin-bottom:4px;text-transform:uppercase;letter-spacing:.4px">Paste Release Note Text *</label>';
  modal+='<textarea id="rn-text" style="width:100%;height:180px;padding:10px;border:1px solid var(--tan2);border-radius:6px;font-size:12px;font-family:Inter,sans-serif;color:var(--navy);resize:vertical;box-sizing:border-box" placeholder="Paste the full release note text here..."></textarea></div>';
  modal+='<div id="rn-status" style="font-size:12px;color:var(--text3);margin-bottom:12px;display:none"></div>';
  modal+='<div id="rn-results" style="display:none;margin-bottom:14px"></div>';
  modal+='<div style="display:flex;gap:10px">';
  modal+='<button id="rn-parse" style="background:var(--navy);color:#fff;border:none;border-radius:8px;padding:10px 20px;font-size:13px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif">✨ Parse with AI</button>';
  modal+='<button id="rn-save" style="display:none;background:var(--gold);color:var(--navy);border:none;border-radius:8px;padding:10px 20px;font-size:13px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif">Save to Profile</button></div>';
  modal+='</div>';
  overlay.innerHTML=modal;
  document.body.appendChild(overlay);

  var parsedItems=null;

  document.getElementById('rn-close').addEventListener('click',function(){document.body.removeChild(overlay);});
  overlay.addEventListener('click',function(e){if(e.target===overlay)document.body.removeChild(overlay);});

  document.getElementById('rn-parse').addEventListener('click',function(){
    var text=document.getElementById('rn-text').value.trim();
    var platform=document.getElementById('rn-platform').value;
    if(!text){alert('Please paste release note text first.');return;}
    var btn=document.getElementById('rn-parse');
    var status=document.getElementById('rn-status');
    btn.disabled=true;btn.textContent='Parsing...';
    status.style.display='block';status.textContent='AI is analyzing the release note...';

    var flags=(practice.flags||[]).map(function(f){return f.feature+(f.platform?' ('+f.platform+')':'');}).join(', ');
    var prompt='You are analyzing a software release note for a medical practice management system.\n\nRelease note text:\n'+text+'\n\nPractice feature flags (things they are waiting for):\n'+(flags||'None')+'\n\nExtract each distinct feature or change from the release note. For each item return:\n- title: short title (max 8 words)\n- description: one sentence description\n- category: one of: Clinical, Scheduling, Billing, Reporting, Integration, UI/UX, Performance, Security, Other\n- flagMatch: true/false — does this match any of the practice\'s feature flags?\n- flagNote: if flagMatch is true, which flag it matches\n\nReturn ONLY a JSON array of objects with these exact keys. No other text.';

    fetch('https://api.anthropic.com/v1/messages',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        model:'claude-sonnet-4-6',
        max_tokens:1000,
        messages:[{role:'user',content:prompt}]
      })
    })
    .then(function(r){return r.json();})
    .then(function(data){
      var raw=data.content&&data.content[0]?data.content[0].text:'';
      try{
        var clean=raw.replace(/```json|```/g,'').trim();
        parsedItems=JSON.parse(clean);
        status.textContent='Found '+parsedItems.length+' items. '+(parsedItems.filter(function(i){return i.flagMatch;}).length)+' match your feature flags.';
        status.style.color='#059669';
        // Show results
        var res=document.getElementById('rn-results');
        var rh='<div style="border:1px solid var(--tan2);border-radius:8px;overflow:hidden;margin-bottom:4px">';
        var matched=parsedItems.filter(function(i){return i.flagMatch;});
        var other=parsedItems.filter(function(i){return !i.flagMatch;});
        if(matched.length){
          rh+='<div style="padding:8px 12px;background:#D1FAE5"><div style="font-size:10px;font-weight:800;color:#065F46;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">✅ Matches your flags ('+matched.length+')</div>';
          matched.forEach(function(item){
            rh+='<div style="padding:5px 0;border-bottom:1px solid #A7F3D0"><div style="font-size:12px;font-weight:700;color:#065F46">'+esc(item.title)+'</div>';
            rh+='<div style="font-size:11px;color:#047857">'+esc(item.description)+'</div>';
            if(item.flagNote)rh+='<div style="font-size:10px;color:#065F46;margin-top:2px">→ Matches: '+esc(item.flagNote)+'</div>';
            rh+='</div>';
          });
          rh+='</div>';
        }
        if(other.length){
          rh+='<div style="padding:8px 12px"><div style="font-size:10px;font-weight:800;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">Other items ('+other.length+')</div>';
          other.slice(0,5).forEach(function(item){
            rh+='<div style="padding:4px 0;border-bottom:1px solid var(--tan)"><div style="font-size:11px;font-weight:700;color:var(--navy)">'+esc(item.title)+'</div>';
            rh+='<div style="font-size:10px;color:var(--text3)">'+esc(item.description)+'</div></div>';
          });
          if(other.length>5)rh+='<div style="font-size:10px;color:var(--text3);margin-top:4px">+'+(other.length-5)+' more items</div>';
          rh+='</div>';
        }
        rh+='</div>';
        res.innerHTML=rh;res.style.display='block';
        document.getElementById('rn-save').style.display='';
      } catch(e){
        status.textContent='Parse error — try again or check the release note format.';
        status.style.color='#dc2626';
      }
      btn.disabled=false;btn.textContent='✨ Parse with AI';
    })
    .catch(function(){
      status.textContent='AI parsing failed. Check your connection.';
      status.style.color='#dc2626';
      btn.disabled=false;btn.textContent='✨ Parse with AI';
    });
  });

  document.getElementById('rn-save').addEventListener('click',function(){
    var idx=profiles.findIndex(function(x){return x.id===practice.id;});
    if(idx<0)return;
    var release={
      id:uid(),
      platform:document.getElementById('rn-platform').value,
      version:document.getElementById('rn-version').value.trim(),
      rawText:document.getElementById('rn-text').value.trim(),
      items:parsedItems||[],
      created:Date.now()
    };
    if(!profiles[idx].releases)profiles[idx].releases=[];
    profiles[idx].releases.unshift(release);
    profiles[idx].updated=Date.now();
    saveProfiles();
    document.body.removeChild(overlay);
    render();
  });
}

function generateReleasePdf(practice,release){
  var matched=(release.items||[]).filter(function(i){return i.flagMatch;});
  var win=window.open('','_blank');
  if(!win){alert('Allow pop-ups to generate PDF.');return;}
  var css='@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Playfair+Display:wght@600&display=swap");*{box-sizing:border-box;margin:0;padding:0}body{font-family:Inter,sans-serif;color:#1c2b3a;font-size:13px;line-height:1.65;background:#fff}.page{max-width:680px;margin:0 auto;padding:48px 40px}.cover{background:#1c2b3a;border-radius:12px;padding:32px;margin-bottom:32px}.cover-tag{font-size:10px;font-weight:700;color:#c9a84c;letter-spacing:1px;text-transform:uppercase;margin-bottom:12px}.cover-title{font-family:"Playfair Display",serif;font-size:26px;color:#fff;margin-bottom:8px}.cover-sub{font-size:13px;color:rgba(255,255,255,.6)}.match-card{background:#f0fdf4;border:1px solid #a7f3d0;border-radius:10px;padding:16px 20px;margin-bottom:14px}.match-title{font-size:15px;font-weight:700;color:#065f46;margin-bottom:4px}.match-desc{font-size:13px;color:#047857;margin-bottom:6px}.match-flag{font-size:11px;color:#065f46;background:#d1fae5;padding:2px 8px;border-radius:8px;display:inline-block}.footer{margin-top:40px;padding-top:16px;border-top:1px solid #f0e4bf;font-size:10px;color:#999;display:flex;justify-content:space-between}.no-print{position:fixed;bottom:20px;right:20px}@media print{.no-print{display:none}.cover{-webkit-print-color-adjust:exact;print-color-adjust:exact}.match-card{-webkit-print-color-adjust:exact;print-color-adjust:exact}}';

  win.document.write('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>What\'s New — '+practice.name+'</title><style>'+css+'</style></head><body><div class="page">');
  win.document.write('<div class="cover"><div class="cover-tag">ACG Practice Partners \u2014 Release Intelligence</div>');
  win.document.write('<div class="cover-title">What\'s New for Your Practice</div>');
  win.document.write('<div class="cover-sub">'+esc(release.platform)+(release.version?' \u00b7 Version '+esc(release.version):'')+' \u00b7 Prepared for '+esc(practice.name)+'</div>');
  win.document.write('<div style="font-size:11px;color:rgba(255,255,255,.35);margin-top:16px">'+new Date().toLocaleDateString()+' \u00b7 ACG Practice Partners</div></div>');
  win.document.write('<div style="font-size:13px;color:#1c2b3a;margin-bottom:20px">Based on your technology goals and the latest '+esc(release.platform)+' release, ACG has identified <strong>'+matched.length+' update'+(matched.length!==1?'s':'')+' relevant to your practice</strong>:</div>');
  matched.forEach(function(item){
    win.document.write('<div class="match-card"><div class="match-title">'+esc(item.title)+'</div><div class="match-desc">'+esc(item.description)+'</div>');
    if(item.flagNote)win.document.write('<span class="match-flag">\u2713 Addresses: '+esc(item.flagNote)+'</span>');
    win.document.write('</div>');
  });
  win.document.write('<div class="footer"><span>ACG Practice Partners \u00a9 '+new Date().getFullYear()+'</span><span>acgpracticepartners.com</span></div>');
  win.document.write('<div class="no-print"><button onclick="window.print()" style="background:#1c2b3a;color:#fff;border:none;border-radius:8px;padding:10px 22px;font-size:13px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif">Print / Save PDF</button></div>');
  win.document.write('</div></body></html>');
  win.document.close();
}


// ══════════════════════════════════════════════════════════════════════════════
// RELEASE NOTES (EMR-wide)
// ══════════════════════════════════════════════════════════════════════════════

var releaseView="list"; // list | paste | result
var releaseActiveId=null;

function rReleases(body){
  if(releaseView==="paste"){rReleasePaste(body);return;}
  if(releaseView==="result"&&releaseActiveId){
    var r=globalReleases.filter(function(x){return x.id===releaseActiveId;})[0];
    if(r){rReleaseResult(body,r);return;}
    releaseView="list";
  }
  rReleaseList(body);
}

function rReleaseList(body){
  try{
  var emrGroups={};
  globalReleases.forEach(function(r){
    if(!emrGroups[r.platform])emrGroups[r.platform]=[];
    emrGroups[r.platform].push(r);
  });

  var h='<div style="max-width:860px;margin:0 auto;padding:16px">';
  h+='<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">';
  h+='<div><h2 style="font-family:Playfair Display,serif;font-size:20px;color:var(--navy);margin:0">Release Intelligence</h2>';
  h+='<p style="font-size:11px;color:var(--text3);margin:3px 0 0">Paste a vendor release note once — AI matches it against all client feature flags automatically</p></div>';
  h+='<button id="rel-new" style="background:var(--navy);color:#fff;border:none;border-radius:8px;padding:9px 16px;font-size:12px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif">+ Paste Release Note</button></div>';

  // How it works banner (shown when empty)
  if(!globalReleases.length){
    h+='<div style="background:var(--navy);border-radius:12px;padding:24px;margin-bottom:16px;color:#fff">';
    h+='<div style="font-size:10px;font-weight:700;color:var(--gold);text-transform:uppercase;letter-spacing:.6px;margin-bottom:12px">How it works</div>';
    h+='<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px">';
    [
      {n:"1",t:"Paste a release note",d:"Copy the full release note from any EMR vendor — Nextech, 4D, Symplast, ModMed, or AestheticsPro."},
      {n:"2",t:"AI parses it",d:"Claude extracts every feature and change into structured items and matches them against your clients\' feature flags."},
      {n:"3",t:"Send client PDFs",d:"One-click branded PDF for each matching practice — only the items relevant to them, with ACG context."}
    ].forEach(function(s){
      h+='<div><div style="width:28px;height:28px;background:var(--gold);color:var(--navy);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;margin-bottom:8px">'+s.n+'</div>';
      h+='<div style="font-size:13px;font-weight:700;color:#fff;margin-bottom:4px">'+s.t+'</div>';
      h+='<div style="font-size:11px;color:rgba(255,255,255,.6)">'+s.d+'</div></div>';
    });
    h+='</div></div>';
  }

  if(globalReleases.length){
    Object.keys(emrGroups).sort().forEach(function(plat){
      var platRels=emrGroups[plat].slice().sort(function(a,b){return b.created-a.created;});
      var pl=PLATS.filter(function(p){return p.label===plat;})[0];
      var bg=pl?pl.color:"#1C2B3A";
      h+='<div style="margin-bottom:20px">';
      h+='<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">';
      h+='<span style="background:'+bg+';color:#fff;border-radius:5px;padding:3px 10px;font-size:11px;font-weight:700">'+esc(plat)+'</span>';
      h+='<span style="font-size:10px;color:var(--text3)">'+platRels.length+' release'+(platRels.length!==1?'s':'')+'</span></div>';
      platRels.forEach(function(r){
        var matched=r.matchedProfiles||[];
        var totalFlags=matched.reduce(function(sum,m){return sum+m.matches.length;},0);
        var isParsed=r.parsed!==false&&r.items&&r.items.length;
        h+='<div class="rel-card" data-id="'+r.id+'" style="background:#fff;border:1px solid var(--tan2);border-radius:10px;padding:14px 16px;margin-bottom:8px;cursor:pointer;display:flex;align-items:center;gap:14px">';
        h+='<div style="flex:1">';
        h+='<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;flex-wrap:wrap">';
        h+='<span style="font-size:13px;font-weight:700;color:var(--navy)">'+esc(plat)+(r.version?' v'+esc(r.version):'')+'</span>';
        if(!isParsed)h+='<span style="font-size:10px;background:#FEF3C7;color:#92400E;font-weight:700;padding:2px 8px;border-radius:8px">Saved · Not parsed</span>';
        if(totalFlags)h+='<span style="font-size:10px;background:#D1FAE5;color:#065F46;font-weight:700;padding:2px 8px;border-radius:8px">'+totalFlags+' flag match'+(totalFlags!==1?'es':'')+'</span>';
        h+='</div>';
        h+='<div style="font-size:11px;color:var(--text3)">'+(isParsed?(r.items.length+' items · '):'Saved ')+new Date(r.created).toLocaleDateString();
        if(matched.length)h+=' · Matched '+matched.length+' client'+(matched.length!==1?'s':'');
        h+='</div></div>';
        if(!isParsed){
          h+='<button class="rel-parse-now" data-id="'+r.id+'" style="background:var(--navy);color:#fff;border:none;border-radius:7px;padding:6px 12px;font-size:11px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif;flex-shrink:0">✨ Parse</button>';
        } else {
          h+='<div style="font-size:11px;color:var(--text3);flex-shrink:0">View →</div>';
        }
        h+='</div>';
      });
      h+='</div>';
    });
  }
  h+='</div>';
  body.innerHTML=h;

  document.getElementById('rel-new').addEventListener('click',function(){releaseView='paste';releaseActiveId=null;render();});
  body.querySelectorAll('.rel-card').forEach(function(card){
    card.addEventListener('click',function(e){
      if(e.target.classList.contains('rel-parse-now'))return;
      var r=globalReleases.filter(function(x){return x.id===card.dataset.id;})[0];
      if(r&&!r.parsed&&(!r.items||!r.items.length)){
        // Unparsed — go to paste/edit view
        releaseActiveId=card.dataset.id;releaseView='paste';render();
      } else {
        releaseActiveId=card.dataset.id;releaseView='result';render();
      }
    });
  });
  body.querySelectorAll('.rel-parse-now').forEach(function(btn){
    btn.addEventListener('click',function(e){
      e.stopPropagation();
      releaseActiveId=btn.dataset.id;releaseView='paste';render();
    });
  });
  }catch(e){body.innerHTML='<div style="padding:20px;color:#dc2626;font-family:Inter,sans-serif"><strong>Error in Release Notes:</strong> '+e.message+'</div>';}
}

function rReleasePaste(body){
  var emrOptions=["4D","Nextech w/ P+","Nextech Cloud","Symplast","ModMed","AestheticsPro","Other"];
  // If editing an existing unparsed release, pre-fill
  var editing=releaseActiveId?globalReleases.filter(function(x){return x.id===releaseActiveId&&!x.parsed;})[0]:null;

  var h='<div style="max-width:680px;margin:0 auto;padding:16px">';
  h+='<button id="rel-back" style="background:none;border:none;color:var(--navy);font-size:12px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif;padding:0;margin-bottom:14px">\u2190 Release Notes</button>';
  h+='<div style="background:#fff;border:1px solid var(--tan2);border-radius:12px;padding:24px">';
  h+='<h2 style="font-family:Playfair Display,serif;font-size:18px;color:var(--navy);margin:0 0 6px">'+(editing?'Edit Release Note':'New Release Note')+'</h2>';
  h+='<p style="font-size:11px;color:var(--text3);margin:0 0 18px">Save now and parse later, or parse immediately to match against client flags.</p>';

  h+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px">';
  h+='<div><label style="font-size:10px;font-weight:700;color:var(--navy);display:block;margin-bottom:4px;text-transform:uppercase;letter-spacing:.4px">EMR / Platform *</label>';
  h+='<select id="rel-plat" style="width:100%;padding:8px 11px;border:1px solid var(--tan2);border-radius:6px;font-size:13px;font-family:Inter,sans-serif;color:var(--navy)">';
  emrOptions.forEach(function(o){h+='<option'+(editing&&editing.platform===o?' selected':'')+'>'+o+'</option>';});
  h+='</select></div>';
  h+='<div><label style="font-size:10px;font-weight:700;color:var(--navy);display:block;margin-bottom:4px;text-transform:uppercase;letter-spacing:.4px">Version / Date</label>';
  h+='<input id="rel-version" type="text" value="'+(editing?esc(editing.version||''):'')+'" placeholder="e.g. 8.2 or June 2025" style="width:100%;padding:8px 11px;border:1px solid var(--tan2);border-radius:6px;font-size:13px;font-family:Inter,sans-serif;color:var(--navy);box-sizing:border-box"></div></div>';

  h+='<div style="margin-bottom:14px"><label style="font-size:10px;font-weight:700;color:var(--navy);display:block;margin-bottom:4px;text-transform:uppercase;letter-spacing:.4px">Paste Release Note *</label>';
  h+='<textarea id="rel-text" style="width:100%;height:200px;padding:10px;border:1px solid var(--tan2);border-radius:6px;font-size:12px;font-family:Inter,sans-serif;color:var(--navy);resize:vertical;box-sizing:border-box" placeholder="Paste the full release note text here...">'+esc(editing?editing.rawText:'')+'</textarea></div>';

  h+='<div id="rel-status" style="font-size:12px;color:var(--text3);margin-bottom:12px;display:none"></div>';
  h+='<div style="display:flex;gap:10px;flex-wrap:wrap">';
  h+='<button id="rel-save-only" style="background:none;border:1.5px solid var(--tan2);color:var(--navy);border-radius:8px;padding:10px 18px;font-size:13px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif">\ud83d\udcbe Save for Later</button>';
  h+='<button id="rel-parse" style="background:var(--navy);color:#fff;border:none;border-radius:8px;padding:10px 22px;font-size:13px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif">\u2728 Parse &amp; Match</button>';
  h+='</div></div></div>';
  body.innerHTML=h;

  document.getElementById('rel-back').addEventListener('click',function(){releaseView='list';releaseActiveId=null;render();});

  // Save without parsing
  document.getElementById('rel-save-only').addEventListener('click',function(){
    var plat=document.getElementById('rel-plat').value;
    var version=document.getElementById('rel-version').value.trim();
    var text=document.getElementById('rel-text').value.trim();
    if(!text){alert('Paste the release note text first.');return;}
    if(editing){
      // Update existing
      var idx=globalReleases.findIndex(function(x){return x.id===editing.id;});
      if(idx>=0){globalReleases[idx].platform=plat;globalReleases[idx].version=version;globalReleases[idx].rawText=text;globalReleases[idx].updated=Date.now();}
    } else {
      globalReleases.unshift({id:uid(),platform:plat,version:version,rawText:text,items:null,parsed:false,matchedProfiles:[],created:Date.now()});
    }
    saveGlobalReleases();
    releaseView='list';releaseActiveId=null;render();
  });

  // Parse & Match
  document.getElementById('rel-parse').addEventListener('click',function(){
    var plat=document.getElementById('rel-plat').value;
    var version=document.getElementById('rel-version').value.trim();
    var text=document.getElementById('rel-text').value.trim();
    if(!text){alert('Paste the release note text first.');return;}
    var btn=document.getElementById('rel-parse');
    var status=document.getElementById('rel-status');
    btn.disabled=true;btn.textContent='Parsing...';
    status.style.display='block';status.textContent='AI is analyzing the release note...';

    var relevantProfiles=profiles.filter(function(p){
      return p.emr&&(p.emr===plat||p.emr.toLowerCase().indexOf(plat.toLowerCase())>=0||plat.toLowerCase().indexOf(p.emr.toLowerCase())>=0);
    });
    var allFlags=[];
    relevantProfiles.forEach(function(p){
      (p.flags||[]).forEach(function(f){
        allFlags.push({practice:p.name,feature:f.feature,platform:f.platform||plat});
      });
    });
    var flagsText=allFlags.length?allFlags.map(function(f){return '- '+f.practice+': '+f.feature;}).join('\n'):'No feature flags found for '+plat+' clients. Items will still be parsed.';
    var prompt='You are analyzing a software release note for '+plat+'.\n\nRelease note:\n'+text+'\n\nClient feature flags (things practices are waiting for):\n'+flagsText+'\n\nExtract each distinct feature or change. For each item return:\n- title: short title (max 8 words)\n- description: one clear sentence\n- category: Clinical, Scheduling, Billing, Reporting, Integration, UI/UX, Performance, Security, or Other\n- dbFeature: the closest matching feature name from this list if relevant: Online Booking, Injectable Documentation, Before & After Photos, AI Scribe / Voice-to-Text, Appointment Reminders, CRM & Lead Management, Patient Portal, E-Prescribing, Telehealth, Memberships, Reporting & Analytics (or null if no match)\n- flagMatches: array of practice names whose flags this matches (empty array if none)\n- flagNotes: brief note on why it matches each practice (same order as flagMatches)\n\nReturn ONLY a JSON array. No other text.';

    var aiEndpoint=AZURE_API_URL||'https://api.anthropic.com/v1/messages';
    var aiBody=AZURE_API_URL?JSON.stringify({action:'parseRelease',prompt:prompt}):JSON.stringify({model:'claude-sonnet-4-6',max_tokens:1500,messages:[{role:'user',content:prompt}]});
    var aiHeaders=AZURE_API_URL?{'Content-Type':'application/json'}:{'Content-Type':'application/json'};
    fetch(aiEndpoint,{method:'POST',headers:aiHeaders,body:aiBody})
    .then(function(r){return r.json();})
    .then(function(data){
      var raw=AZURE_API_URL?(data.content&&data.content[0]?data.content[0].text:''):(data.content&&data.content[0]?data.content[0].text:'');
      try{
        var items=JSON.parse(raw.replace(/```json|```/g,'').trim());
        var matchMap={};
        items.forEach(function(item){
          (item.flagMatches||[]).forEach(function(pracName,i){
            if(!matchMap[pracName])matchMap[pracName]={name:pracName,matches:[]};
            matchMap[pracName].matches.push({title:item.title,note:(item.flagNotes||[])[i]||''});
          });
        });
        var matchedProfiles=Object.keys(matchMap).map(function(k){return matchMap[k];});
        // Save or update release with parsed items
        var relId=editing?editing.id:uid();
        var rel={id:relId,platform:plat,version:version,rawText:text,items:items,parsed:true,matchedProfiles:matchedProfiles,created:editing?editing.created:Date.now(),updated:Date.now()};
        if(editing){
          var ei=globalReleases.findIndex(function(x){return x.id===relId;});
          if(ei>=0)globalReleases[ei]=rel; else globalReleases.unshift(rel);
        } else {
          globalReleases.unshift(rel);
        }
        saveGlobalReleases();
        matchedProfiles.forEach(function(mp){
          var idx=profiles.findIndex(function(p){return p.name===mp.name;});
          if(idx>=0){
            if(!profiles[idx].releases)profiles[idx].releases=[];
            var profRel=JSON.parse(JSON.stringify(rel));
            profRel.items=(profRel.items||[]).map(function(item){item.flagMatch=!!(item.flagMatches||[]).indexOf(mp.name)>=0;return item;});
            var existIdx=profiles[idx].releases.findIndex(function(x){return x.id===relId;});
            if(existIdx>=0)profiles[idx].releases[existIdx]=profRel; else profiles[idx].releases.unshift(profRel);
            profiles[idx].updated=Date.now();
          }
        });
        if(matchedProfiles.length)saveProfiles();
        releaseActiveId=rel.id;releaseView='result';render();
      }catch(e){
        status.textContent='Parse error — try again.';status.style.color='#dc2626';
        btn.disabled=false;btn.textContent='\u2728 Parse & Match';
      }
    })
    .catch(function(){
      status.textContent='AI parsing failed. Check connection.';status.style.color='#dc2626';
      btn.disabled=false;btn.textContent='\u2728 Parse & Match';
    });
  });
}


function rReleaseResult(body,r){
  var matched=r.matchedProfiles||[];
  var unmatched=(r.items||[]).filter(function(i){return !(i.flagMatches&&i.flagMatches.length);});
  var pl=PLATS.filter(function(p){return p.label===r.platform;})[0];
  var bg=pl?pl.color:"#1C2B3A";

  var h='<div style="max-width:860px;margin:0 auto;padding:16px">';
  h+='<button id="rel-back" style="background:none;border:none;color:var(--navy);font-size:12px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif;padding:0;margin-bottom:14px">\u2190 Release Notes</button>';

  // Header
  h+='<div style="background:var(--navy);border-radius:12px;padding:20px 24px;margin-bottom:14px">';
  h+='<div style="display:flex;align-items:baseline;gap:10px;margin-bottom:6px">';
  h+='<span style="background:'+bg+';color:#fff;border-radius:5px;padding:3px 10px;font-size:12px;font-weight:700">'+esc(r.platform)+'</span>';
  if(r.version)h+='<span style="font-size:13px;color:rgba(255,255,255,.6)">v'+esc(r.version)+'</span>';
  h+='<span style="font-size:11px;color:rgba(255,255,255,.3);margin-left:auto">'+new Date(r.created).toLocaleDateString()+'</span></div>';
  h+='<div style="font-size:13px;color:rgba(255,255,255,.8)">'+(r.items||[]).length+' items parsed · ';
  h+=matched.length?'<strong style="color:var(--gold)">'+matched.length+' client'+(matched.length!==1?'s':'')+' have matching flags</strong>':'No flag matches found';
  h+='</div></div>';

  // Matched clients — the money section
  if(matched.length){
    h+='<div style="margin-bottom:16px">';
    h+='<div style="font-size:10px;font-weight:800;color:var(--text3);text-transform:uppercase;letter-spacing:.7px;margin-bottom:10px">Client Flag Matches</div>';
    matched.forEach(function(mp){
      var prof=profiles.filter(function(p){return p.name===mp.name;})[0];
      h+='<div style="background:#fff;border:1px solid var(--tan2);border-radius:10px;padding:14px 16px;margin-bottom:8px">';
      h+='<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">';
      h+='<div><div style="font-size:14px;font-weight:700;color:var(--navy)">&#x1F3E5; '+esc(mp.name)+'</div>';
      h+='<div style="font-size:11px;color:var(--text3)">'+mp.matches.length+' item'+(mp.matches.length!==1?'s':'')+' match their flags</div></div>';
      h+='<button class="rel-pdf-btn" data-name="'+esc(mp.name)+'" style="background:var(--gold);border:none;border-radius:7px;padding:7px 14px;font-size:11px;font-weight:700;cursor:pointer;color:var(--navy);font-family:Inter,sans-serif">\u2193 Client PDF</button></div>';
      mp.matches.forEach(function(m){
        h+='<div style="padding:6px 0;border-top:1px solid var(--tan);display:flex;gap:10px;align-items:baseline">';
        h+='<span style="font-size:11px;font-weight:700;color:#065F46;flex:1">'+esc(m.title)+'</span>';
        if(m.note)h+='<span style="font-size:10px;color:var(--text3)">'+esc(m.note)+'</span>';
        h+='</div>';
      });
      h+='</div>';
    });
    h+='</div>';
  }

  // All items
  h+='<div style="background:#fff;border:1px solid var(--tan2);border-radius:10px;overflow:hidden">';
  h+='<div style="padding:10px 16px;background:var(--tan);font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.5px">All '+(r.items||[]).length+' Items</div>';
  var catGroups={};
  (r.items||[]).forEach(function(item){
    var cat=item.category||'Other';
    if(!catGroups[cat])catGroups[cat]=[];
    catGroups[cat].push(item);
  });
  Object.keys(catGroups).forEach(function(cat){
    h+='<div style="padding:8px 16px;background:rgba(28,43,58,.03);font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.4px">'+esc(cat)+'</div>';
    catGroups[cat].forEach(function(item){
      var hasMatch=item.flagMatches&&item.flagMatches.length;
      h+='<div style="padding:9px 16px;border-top:1px solid var(--tan)">';
      h+='<div style="display:flex;align-items:flex-start;gap:10px">';
      if(hasMatch)h+='<span style="font-size:14px;flex-shrink:0">✅</span>';
      else h+='<span style="width:18px;flex-shrink:0"></span>';
      h+='<div style="flex:1">';
      h+='<div style="font-size:12px;font-weight:700;color:var(--navy)">'+esc(item.title)+'</div>';
      h+='<div style="font-size:11px;color:var(--text3);margin-top:2px">'+esc(item.description)+'</div>';
      if(hasMatch)h+='<div style="font-size:10px;color:#059669;margin-top:3px;font-weight:600">Matches: '+esc((item.flagMatches||[]).join(', '))+'</div>';
      h+='<div style="display:flex;gap:6px;margin-top:6px">';
      h+='<button class="rel-promote-take" data-plat="'+esc(r.platform)+'" data-title="'+esc(item.title)+'" data-desc="'+esc(item.description)+'" data-dbf="'+esc(item.dbFeature||'')+'" style="background:none;border:1px solid var(--tan2);border-radius:5px;padding:3px 8px;font-size:10px;font-weight:700;cursor:pointer;color:var(--navy);font-family:Inter,sans-serif">→ ACG Take</button>';
      h+='<button class="rel-promote-article" data-title="'+esc(item.title)+'" data-desc="'+esc(item.description)+'" data-plat="'+esc(r.platform)+'" style="background:none;border:1px solid var(--tan2);border-radius:5px;padding:3px 8px;font-size:10px;font-weight:700;cursor:pointer;color:var(--navy);font-family:Inter,sans-serif">→ Help Article</button>';
      h+='</div></div></div>';
    });
  });
  h+='</div>';

  // Delete
  h+='<div style="margin-top:12px;text-align:right">';
  h+='<button id="rel-delete" style="background:none;border:1px solid #fca5a5;color:#dc2626;border-radius:7px;padding:6px 14px;font-size:11px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif">Delete Release Note</button></div>';
  h+='</div>';
  body.innerHTML=h;

  document.getElementById('rel-back').addEventListener('click',function(){releaseView='list';releaseActiveId=null;render();});
  document.getElementById('rel-delete').addEventListener('click',function(){
    if(!confirm('Delete this release note?'))return;
    globalReleases=globalReleases.filter(function(x){return x.id!==r.id;});
    saveGlobalReleases();releaseView='list';releaseActiveId=null;render();
  });

  // Per-client PDF
  body.querySelectorAll('.rel-pdf-btn').forEach(function(btn){
    btn.addEventListener('click',function(){
      var pracName=btn.dataset.name;
      var mp=matched.filter(function(m){return m.name===pracName;})[0];
      var prof=profiles.filter(function(p){return p.name===pracName;})[0];
      if(!mp)return;
      generateGlobalReleasePdf(prof||{name:pracName},r,mp);
    });
  // Promote to ACG Take
  body.querySelectorAll('.rel-promote-take').forEach(function(btn){
    btn.addEventListener('click',function(e){
      e.stopPropagation();
      var plat=btn.dataset.plat;
      var title=btn.dataset.title;
      var desc=btn.dataset.desc;
      var dbf=btn.dataset.dbf;
      // Find matching DB entry
      var matchedEntry=null;
      if(dbf){matchedEntry=DB.filter(function(e){return e.s==="Dashboard"&&e.f.toLowerCase().indexOf(dbf.toLowerCase())>=0;})[0];}
      if(!matchedEntry){matchedEntry=DB.filter(function(e){return e.s==="Dashboard"&&e.f.toLowerCase().indexOf(title.toLowerCase().split(" ").slice(0,3).join(" "))>=0;})[0];}
      var feature=matchedEntry?matchedEntry.f:prompt("Which feature does this update? (will create new if not found)",title);
      if(!feature)return;
      var takeText=prompt("ACG Take text for "+plat+" · "+feature+":",desc);
      if(!takeText)return;
      // Update override with ACG Take
      var key=("Dashboard|"+feature+"|"+plat);
      if(!overrides[key])overrides[key]={};
      overrides[key].acgTake=takeText;
      save(SK+"_overrides",overrides);
      syncToSheet({action:"override",sheet:"Dashboard",feature:feature,platform:plat,data:JSON.stringify(overrides[key]),ts:Date.now()});
      btn.textContent="✓ Saved as ACG Take";
      btn.style.background="var(--gold)";
      btn.style.color="var(--navy)";
    });
  });
  // Promote to Help Article
  body.querySelectorAll('.rel-promote-article').forEach(function(btn){
    btn.addEventListener('click',function(e){
      e.stopPropagation();
      var newArt={
        id:uid(),
        title:btn.dataset.title+" — "+btn.dataset.plat,
        category:btn.dataset.plat,
        tags:["release note",btn.dataset.plat],
        body:"## What Changed\n\n"+btn.dataset.desc+"\n\n## ACG Notes\n\n",
        author:settings.name||"ACG",
        clientReady:false,published:false,
        created:Date.now(),updated:Date.now()
      };
      helpArticles.unshift(newArt);
      saveHelp();
      helpSelectedId=newArt.id;
      helpView="edit";
      helpSubView="articles";
      navSection="knowledge";
      updateNavSections();
      SV("help");
    });
  });
  });
}

function generateGlobalReleasePdf(practice,r,mp){
  var matchedItems=(r.items||[]).filter(function(i){
    return i.flagMatches&&i.flagMatches.indexOf(practice.name)>=0;
  });
  if(!matchedItems.length){alert('No matched items for this practice.');return;}
  var pl=PLATS.filter(function(p){return p.label===r.platform;})[0];
  var bg=pl?pl.color:"#1c2b3a";

  var win=window.open('','_blank');
  if(!win){alert('Allow pop-ups to generate PDF.');return;}
  var css='@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Playfair+Display:wght@600&display=swap");*{box-sizing:border-box;margin:0;padding:0}body{font-family:Inter,sans-serif;color:#1c2b3a;font-size:13px;line-height:1.65;background:#fff}.page{max-width:680px;margin:0 auto;padding:48px 40px}.cover{background:#1c2b3a;border-radius:12px;padding:32px;margin-bottom:28px}.cover-tag{font-size:10px;font-weight:700;color:#c9a84c;letter-spacing:1px;text-transform:uppercase;margin-bottom:12px}.cover-title{font-family:"Playfair Display",serif;font-size:24px;color:#fff;margin-bottom:8px}.cover-sub{font-size:13px;color:rgba(255,255,255,.6)}.item-card{background:#f0fdf4;border:1px solid #a7f3d0;border-radius:10px;padding:16px 20px;margin-bottom:12px}.item-title{font-size:14px;font-weight:700;color:#065f46;margin-bottom:5px}.item-desc{font-size:13px;color:#047857}.footer{margin-top:40px;padding-top:16px;border-top:1px solid #e5dcc8;font-size:10px;color:#999;display:flex;justify-content:space-between}.no-print{position:fixed;bottom:20px;right:20px}@media print{.no-print{display:none}.cover,.item-card{-webkit-print-color-adjust:exact;print-color-adjust:exact}}';
  win.document.write('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>What\'s New \u2014 '+esc(practice.name)+'</title><style>'+css+'</style></head><body><div class="page">');
  win.document.write('<div class="cover"><div class="cover-tag">ACG Practice Partners \u2014 Release Intelligence</div>');
  win.document.write('<div class="cover-title">What\'s New in '+esc(r.platform)+(r.version?' v'+esc(r.version):'')+'</div>');
  win.document.write('<div class="cover-sub">Prepared for: <strong style="color:#fff">'+esc(practice.name)+'</strong></div>');
  win.document.write('<div style="font-size:11px;color:rgba(255,255,255,.35);margin-top:14px">'+matchedItems.length+' update'+(matchedItems.length!==1?'s':'')+' relevant to your practice \u00b7 '+new Date().toLocaleDateString()+' \u00b7 ACG Practice Partners</div></div>');
  win.document.write('<div style="font-size:13px;color:#1c2b3a;margin-bottom:20px">Based on the latest <strong>'+esc(r.platform)+'</strong> release, ACG has identified the following updates relevant to your practice goals:</div>');
  matchedItems.forEach(function(item){
    var note=(item.flagNotes||[])[(item.flagMatches||[]).indexOf(practice.name)]||'';
    win.document.write('<div class="item-card"><div class="item-title">'+esc(item.title)+'</div><div class="item-desc">'+esc(item.description)+'</div>');
    if(note)win.document.write('<div style="font-size:11px;color:#047857;margin-top:6px;font-style:italic">'+esc(note)+'</div>');
    win.document.write('</div>');
  });
  win.document.write('<div class="footer"><span>ACG Practice Partners \u00a9 '+new Date().getFullYear()+'</span><span>acgpracticepartners.com</span></div>');
  win.document.write('<div class="no-print"><button onclick="window.print()" style="background:#1c2b3a;color:#fff;border:none;border-radius:8px;padding:10px 22px;font-size:13px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif">Print / Save as PDF</button></div>');
  win.document.write('</div></body></html>');
  win.document.close();
}


// ══════════════════════════════════════════════════════════════════════════════
// HOME / LANDING
// ══════════════════════════════════════════════════════════════════════════════