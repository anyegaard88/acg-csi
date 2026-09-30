function rProfiles(body){
  if(profileView==="edit"){rProfileEdit(body,profileSelectedId?profiles.filter(function(p){return p.id===profileSelectedId;})[0]:null);return;}
  if(profileView==="detail"&&profileSelectedId){
    var sp=profiles.filter(function(p){return p.id===profileSelectedId;})[0];
    if(sp){rProfileDetail(body,sp);return;}
    profileView="list";
  }
  rProfileList(body);
}

function rProfileList(body){
  var h='<div style="max-width:900px;margin:0 auto;padding:16px">';
  h+='<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">';
  h+='<div><h2 style="font-family:Playfair Display,serif;font-size:20px;color:var(--navy);margin:0">Client Profiles</h2>';
  h+='<p style="font-size:11px;color:var(--text3);margin:3px 0 0">Track EMR stacks, feature flags, and release notes by practice</p></div>';
  h+='<div style="display:flex;gap:8px"><button id="pr-new" style="background:var(--navy);color:#fff;border:none;border-radius:8px;padding:9px 16px;font-size:12px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif">+ New Profile</button>';
  h+='<button id="pr-quick-release" style="background:var(--gold);color:var(--navy);border:none;border-radius:8px;padding:9px 16px;font-size:12px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif">&#x1F4CB; Paste Release Note</button></div></div>';

  var statuses=["active","prospect","past"];
  var statusLabels={active:"Active Client",prospect:"Prospect",past:"Past Client"};
  var statusColors={active:"#059669",prospect:"#D97706",past:"#6B7280"};

  if(!profiles.length){
    h+='<div style="text-align:center;padding:60px 20px;color:var(--text3)">';
    h+='<div style="font-size:36px;margin-bottom:12px">🏥</div>';
    h+='<div style="font-weight:700;font-size:15px;margin-bottom:6px">No client profiles yet</div>';
    h+='<div style="font-size:12px;max-width:360px;margin:0 auto">Create a profile for each practice you work with. Track their stack, flag features they\'re waiting for, and log release notes relevant to them.</div></div>';
  } else {
    statuses.forEach(function(status){
      var group=profiles.filter(function(p){return (p.status||"active")===status;});
      if(!group.length)return;
      h+='<div style="margin-bottom:20px"><div style="font-size:10px;font-weight:800;color:var(--text3);letter-spacing:.8px;text-transform:uppercase;margin-bottom:8px;padding-bottom:5px;border-bottom:1px solid var(--tan2)">'+statusLabels[status]+' ('+group.length+')</div>';
      group.forEach(function(p){
        var flagCount=(p.flags||[]).length;
        var releaseCount=(p.releases||[]).length;
        var brainCount=(p.brainIds||[]).length;
        h+='<div class="pr-card" data-id="'+p.id+'" style="background:#fff;border:1px solid var(--tan2);border-radius:10px;padding:14px 16px;margin-bottom:8px;cursor:pointer;display:flex;align-items:center;gap:14px">';
        h+='<div style="width:40px;height:40px;background:var(--navy);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">🏥</div>';
        h+='<div style="flex:1;min-width:0">';
        h+='<div style="display:flex;align-items:center;gap:8px;margin-bottom:3px">';
        h+='<div style="font-size:14px;font-weight:700;color:var(--navy)">'+esc(p.name)+'</div>';
        h+='<span style="font-size:10px;font-weight:700;color:'+statusColors[status]+';background:'+statusColors[status]+'18;border-radius:8px;padding:1px 7px">'+statusLabels[status]+'</span></div>';
        var tags=[];
        if(p.emr)tags.push(esc(p.emr));
        if(p.phone)tags.push(esc(p.phone));
        if(p.financing)tags.push(esc(p.financing));
        if(tags.length)h+='<div style="font-size:11px;color:var(--text3)">'+tags.join(' · ')+'</div>';
        h+='<div style="display:flex;gap:10px;margin-top:5px">';
        if(flagCount)h+='<span style="font-size:10px;background:#FEF3C7;color:#92400E;padding:2px 7px;border-radius:8px;font-weight:700">🚩 '+flagCount+' flag'+(flagCount!==1?'s':'')+'</span>';
        if(releaseCount)h+='<span style="font-size:10px;background:#EFF6FF;color:#1E40AF;padding:2px 7px;border-radius:8px;font-weight:700">📋 '+releaseCount+' release'+(releaseCount!==1?'s':'')+'</span>';
        if(brainCount)h+='<span style="font-size:10px;background:var(--gold-bg);color:var(--amber);padding:2px 7px;border-radius:8px;font-weight:700">🥷 '+brainCount+' note'+(brainCount!==1?'s':'')+'</span>';
        h+='</div></div>';
        h+='<div style="font-size:11px;color:var(--text3);flex-shrink:0">'+new Date(p.updated||p.created).toLocaleDateString()+'</div></div>';
      });
      h+='</div>';
    });
  }
  h+='</div>';
  body.innerHTML=h;

  document.getElementById('pr-new').addEventListener('click',function(){profileSelectedId=null;profileView='edit';render();});
  var qrBtn=document.getElementById('pr-quick-release');
  if(qrBtn)qrBtn.addEventListener('click',function(){
    if(!profiles.length){alert('Create a client profile first, then paste release notes from their profile.');return;}
    // Show practice picker then open release modal
    var sel=profiles.length===1?profiles[0]:null;
    if(!sel){
      var names=profiles.map(function(p){return p.name;}).join('\n');
      var name=prompt('Which practice is this release note for?\n\n'+names);
      if(!name)return;
      sel=profiles.filter(function(p){return p.name.toLowerCase().indexOf(name.toLowerCase())>=0;})[0];
      if(!sel){alert('Practice not found. Open the profile directly to paste a release note.');return;}
    }
    profileSelectedId=sel.id;
    profileView='detail';
    render();
    setTimeout(function(){openReleaseNoteModal(sel);},200);
  });
  body.querySelectorAll('.pr-card').forEach(function(card){
    card.addEventListener('click',function(){profileSelectedId=card.dataset.id;profileView='detail';render();});
  });
}

function rProfileDetail(body,p){
  var h='<div style="max-width:800px;margin:0 auto;padding:16px">';
  h+='<button id="pr-back" style="background:none;border:none;color:var(--navy);font-size:12px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif;padding:0;margin-bottom:14px">\u2190 All Profiles</button>';

  // Header
  var statusColors={active:"#059669",prospect:"#D97706",past:"#6B7280"};
  var statusLabels={active:"Active Client",prospect:"Prospect",past:"Past Client"};
  var status=p.status||"active";
  h+='<div style="background:var(--navy);border-radius:12px;padding:20px 24px;margin-bottom:14px">';
  h+='<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px">';
  h+='<div><div style="font-size:11px;font-weight:700;color:'+statusColors[status]+';text-transform:uppercase;letter-spacing:.5px;margin-bottom:5px">'+statusLabels[status]+'</div>';
  h+='<h1 style="font-family:Playfair Display,serif;font-size:22px;color:#fff;margin:0 0 8px">'+esc(p.name)+'</h1>';
  var stackItems=[];
  if(p.emr)stackItems.push('EMR: '+esc(p.emr));
  if(p.phone)stackItems.push('Phone: '+esc(p.phone));
  if(p.financing)stackItems.push('Financing: '+esc(p.financing));
  if(p.crm)stackItems.push('CRM: '+esc(p.crm));
  if(p.imaging)stackItems.push('Imaging: '+esc(p.imaging));
  if(p.ai)stackItems.push('AI: '+esc(p.ai));
  if(stackItems.length)h+='<div style="font-size:12px;color:rgba(255,255,255,.6)">'+stackItems.join(' · ')+'</div>';
  h+='</div>';
  h+='<div style="display:flex;gap:8px;flex-shrink:0"><button id="pr-edit" style="background:rgba(255,255,255,.1);border:none;border-radius:6px;padding:6px 12px;color:#fff;font-size:11px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif">Edit</button>';
  h+='<button id="pr-run-audit" style="background:var(--gold);border:none;border-radius:6px;padding:6px 12px;color:var(--navy);font-size:11px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif">🔍 Tech Audit</button>';
  h+='<button id="pr-ctx" style="background:var(--gold);border:none;border-radius:6px;padding:6px 12px;color:var(--navy);font-size:11px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif">Set as Call Context</button></div></div></div>';

  // Notes
  if(p.notes){
    h+='<div style="background:#fff;border:1px solid var(--tan2);border-radius:10px;padding:14px 16px;margin-bottom:10px">';
    h+='<div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">Notes</div>';
    h+='<div style="font-size:13px;color:var(--navy);line-height:1.6;white-space:pre-wrap">'+esc(p.notes)+'</div></div>';
  }

  // Contacts
  if(p.contacts&&p.contacts.length){
    h+='<div style="background:#fff;border:1px solid var(--tan2);border-radius:10px;padding:14px 16px;margin-bottom:10px">';
    h+='<div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">Contacts</div>';
    p.contacts.forEach(function(c){
      if(!c.name)return;
      h+='<div style="display:flex;gap:10px;padding:6px 0;border-bottom:1px solid var(--tan)">';
      h+='<div style="flex:1"><span style="font-size:13px;font-weight:700;color:var(--navy)">'+esc(c.name)+'</span>';
      if(c.role)h+=' <span style="font-size:11px;color:var(--text3)">· '+esc(c.role)+'</span></div>';
      if(c.email)h+='<a href="mailto:'+esc(c.email)+'" style="font-size:11px;color:var(--blue)">'+esc(c.email)+'</a>';
      h+='</div>';
    });
    h+='</div>';
  }

  // Feature Flags
  var flags=p.flags||[];
  h+='<div style="background:#fff;border:1px solid var(--tan2);border-radius:10px;padding:14px 16px;margin-bottom:10px">';
  h+='<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">';
  h+='<div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.5px">Feature Flags <span style="font-weight:400">(waiting for these)</span></div>';
  h+='<button id="pr-add-flag" style="background:none;border:1px solid var(--tan2);border-radius:5px;padding:3px 9px;font-size:11px;font-weight:700;cursor:pointer;color:var(--navy);font-family:Inter,sans-serif">+ Add Flag</button></div>';
  if(!flags.length){
    h+='<div style="font-size:12px;color:var(--text3);padding:4px 0">No feature flags yet. Add flags for features this practice is waiting for — they\'ll be matched against release notes automatically.</div>';
  } else {
    flags.forEach(function(f,fi){
      h+='<div style="display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid var(--tan)">';
      h+='<span style="font-size:18px">🚩</span>';
      h+='<div style="flex:1"><div style="font-size:12px;font-weight:700;color:var(--navy)">'+esc(f.feature)+'</div>';
      if(f.platform)h+='<div style="font-size:10px;color:var(--text3)">'+esc(f.platform)+(f.note?' · '+esc(f.note):'')+'</div>';
      h+='</div>';
      h+='<button class="pr-del-flag" data-fi="'+fi+'" style="background:none;border:none;color:#dc2626;cursor:pointer;font-size:14px;padding:0">×</button></div>';
    });
  }
  h+='</div>';

  // Release Notes
  var releases=p.releases||[];
  h+='<div style="background:#fff;border:1px solid var(--tan2);border-radius:10px;padding:14px 16px;margin-bottom:10px">';
  h+='<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">';
  h+='<div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.5px">Release Notes</div>';
  h+='<button id="pr-add-release" style="background:var(--navy);border:none;border-radius:5px;padding:4px 10px;font-size:11px;font-weight:700;cursor:pointer;color:#fff;font-family:Inter,sans-serif">+ Paste Release Note</button></div>';
  if(!releases.length){
    h+='<div style="font-size:12px;color:var(--text3)">No release notes pasted yet. Paste release notes from vendors and AI will parse them and match against this practice\'s feature flags.</div>';
  } else {
    releases.slice().reverse().forEach(function(r){
      var matched=(r.items||[]).filter(function(item){return item.flagMatch;});
      h+='<div style="padding:8px 0;border-bottom:1px solid var(--tan)">';
      h+='<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">';
      h+='<span style="font-size:12px;font-weight:700;color:var(--navy)">'+esc(r.platform)+(r.version?' v'+esc(r.version):'')+'</span>';
      h+='<span style="font-size:10px;color:var(--text3)">'+new Date(r.created).toLocaleDateString()+'</span>';
      if(matched.length)h+='<span style="font-size:10px;background:#D1FAE5;color:#065F46;font-weight:700;padding:2px 7px;border-radius:8px">'+matched.length+' flag match'+(matched.length!==1?'es':'')+'</span>';
      h+='</div>';
      h+='<div style="font-size:11px;color:var(--text3)">'+(r.items||[]).length+' items parsed</div>';
      if(matched.length){
        h+='<button class="pr-pdf-release" data-rid="'+r.id+'" style="margin-top:4px;background:var(--gold);border:none;border-radius:5px;padding:4px 10px;font-size:10px;font-weight:700;cursor:pointer;color:var(--navy);font-family:Inter,sans-serif">↓ Client PDF</button>';
      }
      h+='</div>';
    });
  }
  h+='</div>';

  // Brain captures
  var linkedBrain=brainEntries.filter(function(be){return (p.brainIds||[]).indexOf(be.id)>=0;});
  if(linkedBrain.length){
    h+='<div style="background:#fff;border:1px solid var(--tan2);border-radius:10px;padding:14px 16px;margin-bottom:10px">';
    h+='<div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">🥷 MyAnna Notes</div>';
    linkedBrain.slice(0,3).forEach(function(be){
      h+='<div style="padding:6px 0;border-bottom:1px solid var(--tan)">';
      h+='<div style="font-size:12px;color:var(--navy);line-height:1.5">'+esc(be.text.slice(0,120))+(be.text.length>120?'…':'')+'</div>';
      h+='<div style="font-size:10px;color:var(--text3);margin-top:2px">'+timeAgo(be.ts)+'</div></div>';
    });
    if(linkedBrain.length>3)h+='<div style="font-size:11px;color:var(--text3);margin-top:6px">+' +(linkedBrain.length-3)+' more</div>';
    h+='</div>';
  }

  h+='</div>';
  body.innerHTML=h;

  document.getElementById('pr-back').addEventListener('click',function(){profileView='list';render();});
  document.getElementById('pr-edit').addEventListener('click',function(){profileView='edit';render();});
  // Technology Audit from profile
  var auditFromProfileBtn=document.getElementById('pr-run-audit');
  if(auditFromProfileBtn)auditFromProfileBtn.addEventListener('click',function(){
    // Pre-populate audit with this practice's data
    auditData={name:p.name,type:p.emr&&["4D","Nextech w/ P+","Nextech Cloud","Symplast","ModMed","AestheticsPro"].indexOf(p.emr)>=0?"medspa":"medspa",currentStack:{emr:p.emr||"",phone:p.phone||"",financing:p.financing||"",crm:p.crm||"",imaging:p.imaging||"",ai:p.ai||""},budget:"",mobile:"",insurance:"",notes:""};
    auditStep=1;
    saveAuditCurrent();
    SV("audit");
  });
  document.getElementById('pr-ctx').addEventListener('click',function(){
    practiceCtx.name=p.name;practiceCtx.emr=p.emr||'';
    save(SK+'_ctx',practiceCtx);updateCtxBar();
    alert('Call context set to '+p.name+'!');
  });

  // Flag management
  document.getElementById('pr-add-flag').addEventListener('click',function(){
    var feat=prompt('Feature the practice is waiting for (e.g. "injectable unit rounding"):');
    if(!feat)return;
    var plat=p.emr||'';
    var note=prompt('Any context? (optional):');
    var idx=profiles.findIndex(function(x){return x.id===p.id;});
    if(idx>=0){
      if(!profiles[idx].flags)profiles[idx].flags=[];
      profiles[idx].flags.push({id:uid(),feature:feat.trim(),platform:plat,note:note||'',created:Date.now()});
      profiles[idx].updated=Date.now();
      saveProfiles();
      profileSelectedId=p.id;render();
    }
  });
  body.querySelectorAll('.pr-del-flag').forEach(function(btn){
    btn.addEventListener('click',function(){
      var fi=parseInt(btn.dataset.fi);
      var idx=profiles.findIndex(function(x){return x.id===p.id;});
      if(idx>=0){profiles[idx].flags.splice(fi,1);profiles[idx].updated=Date.now();saveProfiles();render();}
    });
  });

  // Release note PDF
  body.querySelectorAll('.pr-pdf-release').forEach(function(btn){
    btn.addEventListener('click',function(){
      var r=(p.releases||[]).filter(function(r){return r.id===btn.dataset.rid;})[0];
      if(r)generateReleasePdf(p,r);
    });
  });

  // Paste release note
  document.getElementById('pr-add-release').addEventListener('click',function(){
    openReleaseNoteModal(p);
  });
}

function rProfileEdit(body,p){
  var isNew=!p;
  var pr=p||{id:uid(),name:'',status:'active',emr:'',phone:'',financing:'',imaging:'',ai:'',crm:'',contacts:[{name:'',role:'',email:''}],notes:'',flags:[],brainIds:[],pathIds:[],releases:[],created:Date.now(),updated:Date.now()};
  var emrOptions=["4D","Nextech w/ P+","Nextech Cloud","Symplast","ModMed","AestheticsPro","Podium AI OS","None","Other"];
  var phoneOptions=["Weave","Podium Phones","RingCentral","Dialpad","Zoom Phone","Other","None"];
  var finOptions=["Cherry","CareCredit","Alphaeon Credit","PatientFi","None","Other"];

  var h='<div style="max-width:700px;margin:0 auto;padding:16px">';
  h+='<button id="pr-back" style="background:none;border:none;color:var(--navy);font-size:12px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif;padding:0;margin-bottom:14px">\u2190 Back</button>';
  h+='<div style="background:#fff;border:1px solid var(--tan2);border-radius:12px;padding:22px">';
  h+='<h2 style="font-family:Playfair Display,serif;font-size:18px;color:var(--navy);margin:0 0 18px">'+(isNew?'New Client Profile':'Edit Profile')+'</h2>';

  // Name + Status
  h+='<div style="display:grid;grid-template-columns:1fr 160px;gap:12px;margin-bottom:14px">';
  h+='<div><label style="font-size:10px;font-weight:700;color:var(--navy);display:block;margin-bottom:4px;text-transform:uppercase;letter-spacing:.4px">Practice Name *</label>';
  h+='<input id="pr-name" type="text" value="'+esc(pr.name)+'" placeholder="e.g. Elle Aesthetic Arts" style="width:100%;padding:8px 11px;border:1px solid var(--tan2);border-radius:6px;font-size:13px;font-family:Inter,sans-serif;color:var(--navy);box-sizing:border-box"></div>';
  h+='<div><label style="font-size:10px;font-weight:700;color:var(--navy);display:block;margin-bottom:4px;text-transform:uppercase;letter-spacing:.4px">Status</label>';
  h+='<select id="pr-status" style="width:100%;padding:8px 11px;border:1px solid var(--tan2);border-radius:6px;font-size:13px;font-family:Inter,sans-serif;color:var(--navy)">';
  [{v:"active",l:"Active Client"},{v:"prospect",l:"Prospect"},{v:"past",l:"Past Client"}].forEach(function(o){
    h+='<option value="'+o.v+'"'+(pr.status===o.v?' selected':'')+'>'+o.l+'</option>';
  });
  h+='</select></div></div>';

  // Stack
  h+='<div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">Tech Stack</div>';
  h+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">';
  [
    {id:'pr-emr',label:'EMR',val:pr.emr,opts:emrOptions},
    {id:'pr-phone',label:'Phone System',val:pr.phone,opts:phoneOptions},
    {id:'pr-financing',label:'Financing',val:pr.financing,opts:finOptions},
    {id:'pr-crm',label:'CRM',val:pr.crm,opts:["Nextech CRM","SymplastCRM","Podium AI OS","Zone DM","Dewy","Aesthetix CRM","None","Other"]},
    {id:'pr-imaging',label:'Imaging',val:pr.imaging,opts:["Canfield VECTRA","Canfield Mirror","Touch MD","Image Assist","VISIA","None","Other"]},
    {id:'pr-ai',label:'AI Tool',val:pr.ai,opts:["ModMed Scribe","Nextech AI","Symplast AI","4D AI / Knowtex","Doximity DoxGPT","None","Other"]}
  ].forEach(function(f){
    h+='<div><label style="font-size:10px;font-weight:700;color:var(--navy);display:block;margin-bottom:4px;text-transform:uppercase;letter-spacing:.4px">'+f.label+'</label>';
    h+='<select id="'+f.id+'" style="width:100%;padding:7px 10px;border:1px solid var(--tan2);border-radius:6px;font-size:12px;font-family:Inter,sans-serif;color:var(--navy)">';
    h+='<option value="">Not set</option>';
    f.opts.forEach(function(o){h+='<option'+(f.val===o?' selected':'')+'>'+o+'</option>';});
    h+='</select></div>';
  });
  h+='</div>';

  // Contacts
  h+='<div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">Primary Contact</div>';
  var con=pr.contacts&&pr.contacts.length?pr.contacts[0]:{name:'',role:'',email:''};
  h+='<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:14px">';
  h+='<div><label style="font-size:10px;font-weight:700;color:var(--navy);display:block;margin-bottom:4px">Name</label><input id="pr-con-name" type="text" value="'+esc(con.name||'')+'" placeholder="Jane Smith" style="width:100%;padding:7px 10px;border:1px solid var(--tan2);border-radius:6px;font-size:12px;font-family:Inter,sans-serif;color:var(--navy);box-sizing:border-box"></div>';
  h+='<div><label style="font-size:10px;font-weight:700;color:var(--navy);display:block;margin-bottom:4px">Role</label><input id="pr-con-role" type="text" value="'+esc(con.role||'')+'" placeholder="Practice Manager" style="width:100%;padding:7px 10px;border:1px solid var(--tan2);border-radius:6px;font-size:12px;font-family:Inter,sans-serif;color:var(--navy);box-sizing:border-box"></div>';
  h+='<div><label style="font-size:10px;font-weight:700;color:var(--navy);display:block;margin-bottom:4px">Email</label><input id="pr-con-email" type="email" value="'+esc(con.email||'')+'" placeholder="jane@practice.com" style="width:100%;padding:7px 10px;border:1px solid var(--tan2);border-radius:6px;font-size:12px;font-family:Inter,sans-serif;color:var(--navy);box-sizing:border-box"></div>';
  h+='</div>';

  // Notes
  h+='<div style="margin-bottom:18px"><label style="font-size:10px;font-weight:700;color:var(--navy);display:block;margin-bottom:4px;text-transform:uppercase;letter-spacing:.4px">Notes</label>';
  h+='<textarea id="pr-notes" style="width:100%;height:80px;padding:8px 11px;border:1px solid var(--tan2);border-radius:6px;font-size:12px;font-family:Inter,sans-serif;color:var(--navy);resize:vertical;box-sizing:border-box">'+esc(pr.notes||'')+'</textarea></div>';

  // Buttons
  h+='<div style="display:flex;gap:10px">';
  h+='<button id="pr-save" style="background:var(--navy);color:#fff;border:none;border-radius:8px;padding:10px 22px;font-size:13px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif">'+(isNew?'Create Profile':'Save Changes')+'</button>';
  if(!isNew)h+='<button id="pr-delete" style="background:none;border:1px solid #fca5a5;color:#dc2626;border-radius:8px;padding:10px 16px;font-size:13px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif">Delete</button>';
  h+='</div></div></div>';
  body.innerHTML=h;

  document.getElementById('pr-back').addEventListener('click',function(){profileView=profileSelectedId?'detail':'list';render();});
  document.getElementById('pr-save').addEventListener('click',function(){
    var name=document.getElementById('pr-name').value.trim();
    if(!name){alert('Practice name is required.');return;}
    var now=Date.now();
    var data={
      id:pr.id,name:name,
      status:document.getElementById('pr-status').value,
      emr:document.getElementById('pr-emr').value,
      phone:document.getElementById('pr-phone').value,
      financing:document.getElementById('pr-financing').value,
      crm:document.getElementById('pr-crm').value,
      imaging:document.getElementById('pr-imaging').value,
      ai:document.getElementById('pr-ai').value,
      contacts:[{name:document.getElementById('pr-con-name').value.trim(),role:document.getElementById('pr-con-role').value.trim(),email:document.getElementById('pr-con-email').value.trim()}],
      notes:document.getElementById('pr-notes').value.trim(),
      flags:pr.flags||[],brainIds:pr.brainIds||[],pathIds:pr.pathIds||[],
      releases:pr.releases||[],
      created:pr.created||now,updated:now
    };
    if(isNew){
      profiles.unshift(data);
    } else {
      var idx=profiles.findIndex(function(x){return x.id===pr.id;});
      if(idx>=0)profiles[idx]=data;
    }
    saveProfiles();
    profileSelectedId=data.id;profileView='detail';render();
  });
  var delBtn=document.getElementById('pr-delete');
  if(delBtn)delBtn.addEventListener('click',function(){
    if(!confirm('Delete this profile?'))return;
    profiles=profiles.filter(function(x){return x.id!==pr.id;});
    saveProfiles();profileSelectedId=null;profileView='list';render();
  });
}
