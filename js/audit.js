// ── VENDOR AUDIT TEMPLATES ───────────────────────────────────
// A platform's own native audit tool (e.g. Nextech's "Health Check") — when
// one exists, ACG folds its findings in rather than re-auditing the same
// ground. Category lists here just pre-fill the (editable) findings table in
// the Interview/Questionnaire step; any platform without a template starts
// with a blank table the user builds by hand.
var VENDOR_AUDIT_TEMPLATES={
  "Nextech w/ P+":{source:"Nextech Health Check",categories:["Financial Review","Data Setup","Administration / Data Integrity","Data Compliance","Clinical Documentation","Clinical Efficiencies"]},
  "Nextech Cloud":{source:"Nextech Health Check",categories:["Financial Review","Data Setup","Administration / Data Integrity","Data Compliance","Clinical Documentation","Clinical Efficiencies"]}
};

// ── SOFTWARE REVIEW TEMPLATES ─────────────────────────────────
// Platform-specific checklist for the Software Review mode.
// 4D is fully built. Others scaffolded — ready for data exercise.
var SOFTWARE_REVIEW_TEMPLATES={
  "4D":{
    ready:true,
    workingItems:[
      "Providers, doctors, and staff — set up correctly",
      "Consult Reasons and Marketing Referral Sources — configured",
      "Procedures — correctly split with CPT codes for insurance and cosmetic",
      "Staff Services Commissions — configured",
      "Permissions — set for each user",
      "Tax Rates — configured",
      "Calendar Groups — set up",
      "Appointment Types — set up with subtypes",
      "Appointments toggled to go to OPS",
      "Notifications — specific to each appointment type",
      "Payors — built and mapped in OPM",
      "Products and Services — built correctly, commissions set up",
      "Chart Notes — built out",
      "Consents, Correspondence, and Communication — configured"
    ],
    gapItems:[
      {id:"fac_fees",label:"Locations — Facility Fees",desc:"Verify Facility fee schedules are set up for all Surgery Centers and Hospitals. Check Anesthesia fees per facility."},
      {id:"sched_templates",label:"Scheduling — Templates",desc:"Review schedule templates — should be appointment-specific, not just time blocks. Insurance appointment types should be separated from general types in OPM."},
      {id:"numbing_buffer",label:"Scheduling — Numbing Prep Time",desc:"Check for pre/post appointment buffer time on numbing appointment types to prevent scheduling conflicts."},
      {id:"billing_encounters",label:"Billing — Encounters",desc:"Review encounter workflow — 4D shows encounters for all appointments. Staff should have a clear process for filtering to insurance-only."},
      {id:"inventory",label:"Inventory Management",desc:"Review inventory setup and quantities. Check for items showing 0 available. Toggle off items from Money screen that are inventory-tracked only (e.g. syringes)."},
      {id:"online_scheduling",label:"Online Scheduling",desc:"Confirm online scheduling is configured for all providers. Review appointment types exposed to patients and availability settings."},
      {id:"payment_methods",label:"Payment Methods",desc:"Review payment methods for duplicates or inactive entries. Confirm integrations (PatientFi, Cherry, CareCredit) are active and not duplicated."},
      {id:"forms_packets",label:"Forms — Pre/Post Op Packets",desc:"Check Forms Library for pre-op and post-op packets. Build procedure-specific consent packets using the Forms Set feature if missing."},
      {id:"portal",label:"Patient Portal",desc:"Review patient portal configuration — intake forms, consents, registration. Confirm portal is being sent to every patient consistently."},
      {id:"packages",label:"Packages Configuration",desc:"Review packages — correct services mapped, expiration dates set, deduction tracking working correctly."}
    ],
    opmItems:[
      {id:"incomplete_enc",label:"Incomplete Encounters",desc:"Review volume of incomplete encounters. Low volume is a good sign. High volume requires immediate attention."},
      {id:"rejected_claims",label:"Rejected Claims",desc:"Review and document count of rejected claims. Each should be worked and resubmitted or appealed."},
      {id:"claim_batch",label:"Last Claim Batch Date",desc:"Document when the last claim batch was sent. Flag if more than 3 business days behind."},
      {id:"statement_batches",label:"Statement Batches",desc:"Check statement batch status. All in CREATED status and not sent is a red flag — job scheduler may be creating but not uploading. Statements can be automated through OPM."},
      {id:"eras",label:"ERAs — Loaded Stems",desc:"Review how far back ERA loaded stems go. Backlog of more than 30 days requires immediate reconciliation."},
      {id:"eras_hold",label:"ERAs — On Hold",desc:"Document count of ERAs on hold. Review each for posting or denial action needed."},
      {id:"denials",label:"Denials Not Posted",desc:"Document count of denials not yet posted. Each should be reviewed and either posted or appealed."},
      {id:"escrow",label:"Payments in Escrow",desc:"Review payments in escrow — document oldest receipt date. Any escrow older than 30 days needs immediate reconciliation."},
      {id:"tinle",label:"TINLE Revenue",desc:"Review TINLE status and whether revenue is being generated. Flag if no profit yet."}
    ],
    reports:{
      daily:["Reference Batch","Encounter by Status"],
      weekly:["Interactive Aging","Aging by Patient"],
      monthly:["Aging by Patient","A/R Management","A/R Analysis","Executive Summary"]
    },
    platformIssues:[
      "Texting — Photo capability: Ability to text photos to patients not yet available. In development.",
      "Patient Portal: Not a true patient portal. Photos added do not sync into the system automatically.",
      "Insurance — Chart Note Hook: Chart note sent to OPM integration in development. End of year target.",
      "Insurance — Procedure & Diagnosis Mapping: Will reduce manual entry for visit charges. In development.",
      "Insurance — Global Period Days: Will display for surgery and procedures on appointment and patient chart. In development.",
      "Insurance — Days Post Op: Days post-op will display on the schedule. In development."
    ],
    onsiteQuestions:[
      "What workflows are creating the most friction — particularly from an insurance standpoint?",
      "Feedback on patient financing integrations — are they working as expected?",
      "Feedback on 4D Pay — have they activated ACH payments?",
      "Are providers charting in the room or catching up later?",
      "What report do you wish you had that you don't have today?"
    ]
  },
  "Nextech w/ P+":{
    ready:false,
    workingItems:[],
    gapItems:[
      {id:"template_library",label:"Template Library",desc:"Data exercise pending — add Nextech P+ specific items here."},
      {id:"quotes",label:"Quotes Feature",desc:"Data exercise pending."},
      {id:"portal",label:"Patient Portal",desc:"Data exercise pending."}
    ],
    opmItems:[],
    reports:{daily:[],weekly:[],monthly:[]},
    platformIssues:[],
    onsiteQuestions:["Data exercise pending — Nextech P+ specific questions to be added."]
  },
  "Nextech Cloud":{
    ready:false,
    workingItems:[],
    gapItems:[
      {id:"reporting",label:"Reporting Configuration",desc:"Data exercise pending — Nextech Cloud specific items here."},
      {id:"portal",label:"Patient Portal",desc:"Data exercise pending."}
    ],
    opmItems:[],
    reports:{daily:[],weekly:[],monthly:[]},
    platformIssues:[],
    onsiteQuestions:["Data exercise pending — Nextech Cloud specific questions to be added."]
  },
  "Symplast":{
    ready:false,
    workingItems:[],
    gapItems:[
      {id:"crm",label:"CRM Configuration",desc:"Data exercise pending — Symplast specific items here."},
      {id:"portal",label:"Patient Portal",desc:"Data exercise pending."}
    ],
    opmItems:[],
    reports:{daily:[],weekly:[],monthly:[]},
    platformIssues:[],
    onsiteQuestions:["Data exercise pending — Symplast specific questions to be added."]
  },
  "ModMed":{
    ready:false,
    workingItems:[],
    gapItems:[
      {id:"templates",label:"Template Configuration",desc:"Data exercise pending — ModMed specific items here."}
    ],
    opmItems:[],
    reports:{daily:[],weekly:[],monthly:[]},
    platformIssues:[],
    onsiteQuestions:["Data exercise pending — ModMed specific questions to be added."]
  },
  "AestheticsPro":{
    ready:false,
    workingItems:[],
    gapItems:[
      {id:"config",label:"System Configuration",desc:"Data exercise pending — AestheticsPro specific items here."}
    ],
    opmItems:[],
    reports:{daily:[],weekly:[],monthly:[]},
    platformIssues:[],
    onsiteQuestions:["Data exercise pending — AestheticsPro specific questions to be added."]
  },
  "Podium AI OS":{
    ready:false,
    workingItems:[],
    gapItems:[
      {id:"config",label:"System Configuration",desc:"Data exercise pending — Podium AI OS specific items here."}
    ],
    opmItems:[],
    reports:{daily:[],weekly:[],monthly:[]},
    platformIssues:[],
    onsiteQuestions:["Data exercise pending — Podium AI OS specific questions to be added."]
  }
};

// ── STAFF QUESTIONNAIRE (reference) ─────────────────────────
// Draft question set for staff, grouped by area. Reference-only — displayed
// alongside the manual transcription fields in the Interview/Questionnaire
// step so ACG knows what to ask/send; answers are still captured as free-text
// notes per respondent, not per-question.
var STAFF_QUESTIONNAIRE=[
  {area:"Technology & Device Usage",qs:[
    "Do you use the iPad/mobile check-in or in-room?",
    "Do you use dictation or transcription tools?",
    "Do you use e-prescribing?"
  ]},
  {area:"Patient-Facing Tools",qs:[
    "Do you use the patient portal? How actively?",
    "Are you using TouchMD (or equivalent imaging/consult software)?",
    "Do you offer patient financing, and is it integrated with the EMR/PM system?"
  ]},
  {area:"Practice Operations",qs:[
    "What CRM (if any) are you using?",
    "Is your marketing platform integrated with the EMR/PM system?",
    "Is inventory/supply management handled through the EMR/PM system?"
  ]},
  {area:"Billing",qs:[
    "Do you bill to insurance, cash-pay, or both?",
    "Is RCM/billing handled in-house or outsourced?"
  ]},
  {area:"Practice Context",qs:[
    "Provider count and staff count by role",
    "When was the last major system update or formal staff training?",
    "What other systems touch the EMR/PM system (website, financing, marketing platform, etc.)?"
  ]}
];

// ── FEATURE UTILIZATION QUESTIONS ──────────────────────────
// Sourced from ACG Practice Assessment template. Each ties to a stack category
// and is scored as part of the "Underutilized" gap analysis.
// effort: "Quick Win" (ACG can flip a setting/short training) or "Project" (workflow redesign, multi-week)
// acgFix: true = ACG-led engagement opportunity, false = practice behavior change needed
var UTIL_QUESTIONS=[
  {cat:"scheduling",area:"Scheduling & Front Desk",q:"Does staff use a CRM to track and nurture leads?",effort:"Project",acgFix:true,impact:"High",rec:"Leads going untracked is the single highest-leverage gap. A CRM layer (Dewy, Aesthetix, Zone DM, or native) with nurture sequences typically recovers 15-25% of leads that would otherwise go cold."},
  {cat:"scheduling",area:"Scheduling & Front Desk",q:"Is there a recall system for patients due for recurring/ongoing treatment?",effort:"Quick Win",acgFix:true,impact:"High",rec:"Most EMRs/CRMs already include recall automation — often just needs to be configured and turned on. High ROI for injectable and ongoing-treatment practices."},
  {cat:"scheduling",area:"Scheduling & Front Desk",q:"Are schedule templates used for consults, pre-ops, post-ops, and treatments?",effort:"Project",acgFix:true,impact:"Medium",rec:"Building out the appointment-type matrix is implementation work most practices skip and regret. This is foundational to almost every other scheduling feature working correctly."},
  {cat:"scheduling",area:"Scheduling & Front Desk",q:"Is a resource/device scheduling feature used to prevent device double-booking?",effort:"Quick Win",acgFix:true,impact:"Low",rec:"Usually a toggle in the PM system. Quick to configure if the platform supports it and isn't being used."},
  {cat:"scheduling",area:"Scheduling & Front Desk",q:"Is payment or card-on-file required to book an appointment?",effort:"Quick Win",acgFix:true,impact:"Medium",rec:"Reduces no-shows meaningfully. Usually a setting change in the online booking flow."},
  {cat:"scheduling",area:"Scheduling & Front Desk",q:"Are new patient forms completed electronically through a HIPAA-compliant portal?",effort:"Quick Win",acgFix:true,impact:"Medium",rec:"If the EMR has this built in and it's not active, this is pure front-desk time savings waiting to be unlocked."},
  {cat:"scheduling",area:"Scheduling & Front Desk",q:"Are text/email appointment reminders utilized?",effort:"Quick Win",acgFix:true,impact:"High",rec:"One of the highest ROI quick wins available. If not active, this should be priority one in any cleanup engagement."},
  {cat:"scheduling",area:"Scheduling & Front Desk",q:"Is insurance eligibility verified electronically?",effort:"Project",acgFix:true,impact:"Medium",rec:"Requires clearinghouse setup if not already connected. Meaningful front-desk time savings and fewer denied claims once live."},
  {cat:"scheduling",area:"Scheduling & Front Desk",q:"Is the credit card system integrated with the practice management system?",effort:"Project",acgFix:true,impact:"Medium",rec:"Manual payment posting is a common source of reconciliation errors. Integration is usually available but requires a setup project."},
  {cat:"scheduling",area:"Scheduling & Front Desk",q:"Is the package management feature used correctly?",effort:"Project",acgFix:true,impact:"Medium",rec:"Package tracking is frequently underused even when the platform supports it well (Symplast, Nextech P+). Worth a dedicated training session."},

  {cat:"surgery",area:"Surgery Coordination",q:"Does the PM system distinguish surgical deposits/prepayments from other credit balances?",effort:"Quick Win",acgFix:true,impact:"Medium",rec:"Usually a configuration fix, not a platform limitation. Misclassified deposits create real accounting headaches."},
  {cat:"surgery",area:"Surgery Coordination",q:"Is the surgical pipeline tracked in the PM system rather than a separate Excel file?",effort:"Project",acgFix:true,impact:"High",rec:"If the team is using Excel alongside the EMR for surgery tracking, that's a clear signal the platform's native surgical scheduling isn't being used to capacity. Migrating this is a strong consulting engagement."},
  {cat:"surgery",area:"Surgery Coordination",q:"Is hospital/surgery center paperwork completed electronically?",effort:"Project",acgFix:false,impact:"Low",rec:"Depends on the facility's systems as much as the practice's. Worth investigating but lower priority."},

  {cat:"revenue",area:"Revenue Cycle",q:"Are claims submitted electronically and the edit report worked daily?",effort:"Quick Win",acgFix:false,impact:"High",rec:"If electronic claims aren't active, this is foundational RCM infrastructure that should be fixed immediately — not really a 'nice to have.'"},
  {cat:"revenue",area:"Revenue Cycle",q:"Are electronic payment posting functions utilized?",effort:"Quick Win",acgFix:true,impact:"High",rec:"Manual payment posting is slow and error-prone. Most modern PM systems support this — frequently just needs to be turned on."},
  {cat:"revenue",area:"Revenue Cycle",q:"Is an electronic patient statement system used for billing cycles?",effort:"Project",acgFix:true,impact:"Medium",rec:"Paper statements are a clear sign of underutilized billing automation. A real opportunity for a billing workflow cleanup engagement."},
  {cat:"revenue",area:"Revenue Cycle",q:"Is an automated patient collections module used?",effort:"Project",acgFix:true,impact:"Medium",rec:"Often included but unconfigured. A/R follow-up automation is a strong upsell into a revenue cycle cleanup project."},
  {cat:"revenue",area:"Revenue Cycle",q:"Is the notes feature used so all staff can review account status?",effort:"Quick Win",acgFix:false,impact:"Low",rec:"Process/training fix more than a software fix. Quick to address in a staff training session."},

  {cat:"medspa",area:"Med Spa",q:"Is inventory tracked through the practice management system (not a separate spreadsheet)?",effort:"Project",acgFix:true,impact:"Medium",rec:"Spreadsheet-based inventory tracking alongside an EMR that supports native inventory is a clear underutilization signal. Migration is a clean, scoped project."},
  {cat:"medspa",area:"Med Spa",q:"Are before/after photos uploaded directly into the patient chart?",effort:"Quick Win",acgFix:false,impact:"Medium",rec:"Usually a workflow/training fix — the feature exists in nearly every EMR on this list, it's a matter of staff habit."},
  {cat:"medspa",area:"Med Spa",q:"Are lot numbers for injectables and device consumables recorded in the medical record?",effort:"Quick Win",acgFix:false,impact:"High",rec:"Critical for recall compliance. If this isn't happening consistently, it's a training and workflow fix, not a software gap — flag as urgent regardless."},

  {cat:"financial",area:"Financial Management",q:"Are total payments posted to the PM system reconciled against QuickBooks monthly?",effort:"Project",acgFix:false,impact:"High",rec:"A foundational financial control. If this reconciliation isn't happening, it's a process gap ACG can help establish even if the software itself isn't the issue."},

  {cat:"compliance",area:"Compliance",q:"Does each employee have their own individual EHR login (not shared credentials)?",effort:"Quick Win",acgFix:true,impact:"High",rec:"Shared logins are a HIPAA and audit-trail risk. Fixing this is usually just account provisioning — fast, low-cost, high-importance cleanup item."},
  {cat:"compliance",area:"Compliance",q:"Do employees communicate through secure, HIPAA-compliant channels (not personal text/email)?",effort:"Project",acgFix:true,impact:"High",rec:"If staff are using personal phones or non-secure channels for patient-related communication, this is a real compliance exposure. Strong candidate for a secure messaging rollout project."}
];

// ── QUICK ANSWERS ────────────────────────────────────────────

function toggleFaqTag(id,title){
  var e=brainEntries.filter(function(b){return b.id===id;})[0];
  if(!e)return;
  if(e.faq){
    updateBrainEntry(id,{faq:false,faqTitle:""});
  } else {
    var t=title||prompt("Short question title for Quick Answers (e.g. 'Why Cherry over CareCredit?')",e.text.slice(0,50));
    if(t===null)return;
    updateBrainEntry(id,{faq:true,faqTitle:t});
  }
  if(view==="brain")render();
}

function renderUtilCategories(){
  var allQ=getAllUtilQuestions();
  var areas={};
  allQ.forEach(function(uq){if(!areas[uq.area])areas[uq.area]=[];areas[uq.area].push(uq);});
  // Include empty custom categories (no questions yet, just one-off items)
  (auditData.customCategories||[]).forEach(function(c){if(!areas[c])areas[c]=[];});

  return Object.keys(areas).map(function(area){
    var qs=areas[area];
    var oneOffs=(auditData.customAuditItems||[]).filter(function(c){return c.area===area;});
    return '<div style="margin-bottom:16px">'
      +'<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--gold);background:var(--gold-bg);padding:6px 12px;border-radius:6px 6px 0 0;border:1px solid var(--gold-l);border-bottom:none;display:flex;justify-content:space-between;align-items:center">'
      +'<span>'+esc(area)+'</span>'
      +'<button class="add-item-btn" data-area="'+esc(area)+'" style="background:none;border:1px solid var(--amber);color:var(--amber);border-radius:5px;padding:2px 9px;font-size:10px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif;text-transform:none;letter-spacing:0">+ Item</button>'
      +'</div>'
      +'<div style="border:1px solid var(--tan2);border-radius:0 0 8px 8px;overflow:hidden">'
      +qs.map(function(uq,qi){
        var val=(auditData.utilization||{})[uq.q]||"";
        var note=(auditData.utilizationNotes||{})[uq.q]||"";
        var isCustomPermanent=customUtilQ.some(function(c){return c.q===uq.q;});
        return '<div style="padding:10px 14px;border-top:'+(qi===0?"none":"1px solid var(--tan)")+';background:#fff">'
          +'<div style="display:flex;align-items:center;justify-content:space-between;gap:12px">'
          +'<div style="font-size:12px;color:var(--text);flex:1;line-height:1.5">'+esc(uq.q)+(isCustomPermanent?' <span style="font-size:9px;color:var(--gold);font-weight:700">\u2605 CUSTOM</span>':'')+'</div>'
          +'<div style="display:flex;gap:4px;flex-shrink:0">'
          +['yes','no','skip'].map(function(opt){
            var lbl=opt==="skip"?"?":opt==="yes"?"Y":"N";
            var isOn=val===opt||(opt==="skip"&&!val);
            var col=opt==="yes"?"var(--green)":opt==="no"?"var(--red)":"var(--text3)";
            return '<button class="util-ans" data-q="'+esc(uq.q)+'" data-v="'+(opt==="skip"?"":opt)+'" style="width:26px;height:26px;border-radius:5px;border:1.5px solid '+(isOn?col:"var(--tan2)")+';background:'+(isOn?col:"transparent")+';color:'+(isOn?"#fff":"var(--text3)")+';font-size:11px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif">'+lbl+'</button>';
          }).join("")
          +'<button class="util-note-toggle" data-q="'+esc(uq.q)+'" title="Add note" style="width:26px;height:26px;border-radius:5px;border:1.5px solid '+(note?"var(--blue)":"var(--tan2)")+';background:'+(note?"var(--blue-bg)":"transparent")+';color:'+(note?"var(--blue)":"var(--text3)")+';font-size:11px;cursor:pointer;font-family:Inter,sans-serif">\u270e</button>'
          +'</div></div>'
          +'<div class="util-note-field" data-q="'+esc(uq.q)+'" style="display:'+(note?"block":"none")+';margin-top:7px">'
          +'<input type="text" class="util-note-inp" data-q="'+esc(uq.q)+'" value="'+esc(note)+'" placeholder="Add context (e.g. switching platforms next quarter)..." style="width:100%;padding:6px 9px;border-radius:5px;border:1px solid var(--tan2);font-size:11px;font-family:Inter,sans-serif;outline:none;box-sizing:border-box">'
          +'</div>'
          +'</div>';
      }).join("")
      +oneOffs.map(function(item,oi){
        return '<div style="padding:10px 14px;border-top:1px solid var(--tan);background:var(--gold-bg);display:flex;justify-content:space-between;align-items:flex-start;gap:10px">'
          +'<div style="flex:1">'
          +'<div style="font-size:12px;color:var(--text);margin-bottom:3px">'+esc(item.q)+' <span style="font-size:9px;color:var(--amber);font-weight:700">ONE-OFF</span></div>'
          +'<div style="display:flex;gap:5px"><span style="font-size:9px;background:'+(item.effort==="Quick Win"?"var(--green)":"#D97706")+';color:#fff;border-radius:3px;padding:1px 6px;font-weight:700">'+esc(item.effort)+'</span><span style="font-size:9px;color:var(--text3)">'+esc(item.impact)+' impact</span></div>'
          +'</div>'
          +'<button class="del-oneoff-btn" data-area="'+esc(area)+'" data-idx="'+oi+'" style="background:none;border:none;color:var(--red);cursor:pointer;font-size:15px">\u00d7</button>'
          +'</div>';
      }).join("")
      +'</div></div>';
  }).join("");
}

function wireUtilCategories(body){
  body.querySelectorAll(".util-ans").forEach(function(btn){
    btn.addEventListener("click",function(){
      var q=btn.getAttribute("data-q"),v=btn.getAttribute("data-v");
      if(v){auditData.utilization[q]=v;}else{delete auditData.utilization[q];}
      var group=btn.parentElement.querySelectorAll(".util-ans");
      group.forEach(function(b){
        var opt=b.getAttribute("data-v")||"skip";
        var isOn=(v||"skip")===opt;
        var col=opt==="yes"?"var(--green)":opt==="no"?"var(--red)":"var(--text3)";
        b.style.borderColor=isOn?col:"var(--tan2)";
        b.style.background=isOn?col:"transparent";
        b.style.color=isOn?"#fff":"var(--text3)";
      });
    });
  });
  body.querySelectorAll(".util-note-toggle").forEach(function(btn){
    btn.addEventListener("click",function(){
      var q=btn.getAttribute("data-q");
      var field=body.querySelector('.util-note-field[data-q="'+CSS.escape(q)+'"]');
      if(field){
        var showing=field.style.display==="block";
        field.style.display=showing?"none":"block";
        if(!showing){var inp=field.querySelector("input");if(inp)inp.focus();}
      }
    });
  });
  body.querySelectorAll(".util-note-inp").forEach(function(inp){
    inp.addEventListener("input",function(){
      var q=inp.getAttribute("data-q");
      auditData.utilizationNotes[q]=inp.value;
    });
  });
  body.querySelectorAll(".add-item-btn").forEach(function(btn){
    btn.addEventListener("click",function(){openAddUtilItemModal(btn.getAttribute("data-area"),body);});
  });
  body.querySelectorAll(".del-oneoff-btn").forEach(function(btn){
    btn.addEventListener("click",function(){
      var area=btn.getAttribute("data-area"),idx=parseInt(btn.getAttribute("data-idx"));
      var items=auditData.customAuditItems.filter(function(c){return c.area===area;});
      var item=items[idx];
      auditData.customAuditItems=auditData.customAuditItems.filter(function(c){return c!==item;});
      document.getElementById("util-cats-wrap").innerHTML=renderUtilCategories();
      wireUtilCategories(body);
    });
  });
}

function openAddUtilItemModal(area,parentBody){
  document.getElementById("eov").style.display="block";
  var mo=document.getElementById("emo");mo.style.display="flex";
  document.getElementById("emtag").textContent="PRACTICE-SPECIFIC ITEM \u2014 "+area.toUpperCase();
  document.getElementById("emttl").textContent="Add Custom Item";
  var bd=document.getElementById("embd");
  bd.innerHTML='<div class="em-field"><label class="em-lbl">Observation / Question *</label>'
    +'<textarea id="cu-q" class="em-ta" placeholder="e.g. Front desk re-keys insurance info manually instead of using eligibility check..." style="min-height:70px"></textarea></div>'
    +'<div class="em-field"><label class="em-lbl">Effort</label><select id="cu-effort" class="fsel"><option>Quick Win</option><option>Project</option></select></div>'
    +'<div class="em-field"><label class="em-lbl">Impact</label><select id="cu-impact" class="fsel"><option>High</option><option>Medium</option><option>Low</option></select></div>'
    +'<div class="em-field"><label class="em-lbl">ACG can fix this directly?</label><select id="cu-acgfix" class="fsel"><option value="true">Yes</option><option value="false">No \u2014 requires practice behavior change</option></select></div>'
    +'<div class="em-field"><label class="em-lbl">ACG Recommendation</label>'
    +'<textarea id="cu-rec" class="em-ta" placeholder="What would you tell the client to do about this?"></textarea></div>'
    +'<button id="cu-save-oneoff" class="em-save" style="margin-bottom:8px">Add to This Audit Only</button>'
    +'<button id="cu-save-permanent" class="em-save" style="background:var(--gold);color:var(--navy)">\u2605 Add to This Audit + Save as Permanent Question</button>';

  function buildItem(){
    var q=document.getElementById("cu-q").value.trim();
    if(!q)return null;
    return{
      cat:area.toLowerCase().replace(/\s+/g,""),area:area,q:q,
      effort:document.getElementById("cu-effort").value,
      impact:document.getElementById("cu-impact").value,
      acgFix:document.getElementById("cu-acgfix").value==="true",
      rec:document.getElementById("cu-rec").value.trim()
    };
  }

  document.getElementById("cu-save-oneoff").addEventListener("click",function(){
    var item=buildItem();if(!item)return;
    auditData.customAuditItems.push(item);
    closeEdit();
    document.getElementById("util-cats-wrap").innerHTML=renderUtilCategories();
    wireUtilCategories(parentBody);
  });
  document.getElementById("cu-save-permanent").addEventListener("click",function(){
    var item=buildItem();if(!item)return;
    promoteUtilQuestion(item);
    closeEdit();
    document.getElementById("util-cats-wrap").innerHTML=renderUtilCategories();
    wireUtilCategories(parentBody);
  });
}

function getAllUtilQuestions(){
  return UTIL_QUESTIONS.concat(customUtilQ);
}

function getUtilizationGaps(intake){
  var answers=intake.utilization||{};
  var notes=intake.utilizationNotes||{};
  var allQ=getAllUtilQuestions();
  // One-off custom items added for this specific audit only
  var oneOffs=(intake.customAuditItems||[]).map(function(c){return Object.assign({},c,{isOneOff:true});});
  var flagged=allQ.filter(function(uq){return answers[uq.q]==="no";}).map(function(uq){
    return Object.assign({},uq,{note:notes[uq.q]||""});
  }).concat(oneOffs.filter(function(c){return c.flagged!==false;}));
  // Score per category
  var catScores={};
  var catTotals={};
  allQ.forEach(function(uq){
    if(!catTotals[uq.area])catTotals[uq.area]=0;
    catTotals[uq.area]++;
    if(answers[uq.q]==="yes"){
      if(!catScores[uq.area])catScores[uq.area]=0;
      catScores[uq.area]++;
    }
  });
  var scores={};
  Object.keys(catTotals).forEach(function(area){
    var answered=Object.keys(answers).filter(function(q){
      return allQ.some(function(uq){return uq.q===q&&uq.area===area;});
    }).length;
    scores[area]={pct:answered?Math.round(((catScores[area]||0)/answered)*100):null,answered:answered,total:catTotals[area]};
  });
  return{flagged:flagged,scores:scores};
}

function promoteUtilQuestion(q){
  customUtilQ.push(q);
  save(SK+"_customutil",customUtilQ);
  syncToSheet({action:"customutil",q:JSON.stringify(q),ts:Date.now()});
}

var KNOWN_ISSUES_DEFAULT={
  "4D":[
    {cat:"CLINICAL",sev:"Significant",status:"Active",issue:"Units entered on injectable chart notes do not auto-pull into checkout charges or inventory.",workaround:"Staff must manually enter units at checkout separately. High training dependency for injector practices."},
    {cat:"WORKFLOW",sev:"Watch",status:"Active",issue:"No dedicated mobile app — browser-based only via Chrome/Safari.",workaround:"Works on iPad/phone browser but is not a native app experience. Set expectation with providers upfront."},
    {cat:"INTEGRATION",sev:"Watch",status:"Active",issue:"Canfield integration runs via a Webhook download that must stay running on one computer.",workaround:"Dedicate a front desk machine that stays powered on. Document restart procedure for staff."},
    {cat:"WORKFLOW",sev:"Watch",status:"Active",issue:"Native 2-way texting limited — no photo support, weak notifications.",workaround:"Most practices pair 4D with Weave for full texting capability. Budget $40-75/user/month add-on."},
    {cat:"CLINICAL",sev:"Watch",status:"Active",issue:"Telehealth notification link not sent to patient until appointment time.",workaround:"Front desk can manually send the link earlier. Ask 4D support if this has been resolved in current version."},
    {cat:"IMPLEMENTATION",sev:"Watch",status:"Active",issue:"Consent forms require Word document format and manual upload. Heavy lift at implementation.",workaround:"Pay $275 one-time ASPS integration fee. Allocate 2-3 weeks for consent library build before go-live."}
  ],
  "Nextech w/ P+":[
    {cat:"CONTRACT",sev:"Critical",status:"Active",issue:"Auto-renewing contracts with difficult cancellation process. Clients consistently caught by automatic renewal.",workaround:"Get cancellation process in writing before signing. Calendar the renewal date. Request 90-day written cancellation window."},
    {cat:"REPORTING",sev:"Significant",status:"Active",issue:"Reporting significantly limited vs Nextech Cloud — cannot create custom reports, only presets.",workaround:"For analytics-heavy practices either upgrade to Cloud or add a third-party BI tool. Document required reports before go-live."},
    {cat:"CLINICAL",sev:"Significant",status:"Active",issue:"Units on injectable chart notes do not auto-map to checkout charges like Nextech Cloud does.",workaround:"Consider upgrading to Cloud for injector-heavy practices. Meaningful workflow improvement."},
    {cat:"IMPLEMENTATION",sev:"Significant",status:"Active",issue:"Consent forms require Word documents, manual upload. ASPS library not included.",workaround:"Budget dedicated time. Pay $275 one-time ASPS integration fee."},
    {cat:"WORKFLOW",sev:"Watch",status:"Active",issue:"Online booking requires appointment types and templates built out before activation.",workaround:"Plan appointment type matrix as dedicated implementation project. Allow 2-3 weeks before go-live."}
  ],
  "Nextech Cloud":[
    {cat:"CONTRACT",sev:"Critical",status:"Active",issue:"Same auto-renewal risk as P+. 48-hour downtime window for switchover.",workaround:"Get cancellation in writing. Schedule switchover for low-volume period, off-hours. Notify all staff."},
    {cat:"IMPLEMENTATION",sev:"Significant",status:"Active",issue:"Consent form upload same heavy lift as P+.",workaround:"ASPS integration ($275 one-time) + dedicated content project starting week 1 of implementation."}
  ],
  "Symplast":[
    {cat:"CONTRACT",sev:"Significant",status:"Active",issue:"Sales process can be aggressive on contract terms. Pressure to sign same day as demo.",workaround:"Never sign day of demo. Take 48-72 hours minimum. Have attorney or ACG review before signing."},
    {cat:"IMPLEMENTATION",sev:"Significant",status:"Active",issue:"Consent library requires 7-14 day Dev Team lead time. Cannot self-upload.",workaround:"Submit all consent content to Dev Team in week 1 of implementation. Treat as parallel project."},
    {cat:"CLINICAL",sev:"Watch",status:"Vendor Acknowledged",issue:"AI scribe stores data recordings — potential legal liability depending on state law.",workaround:"Get written data retention policy from Symplast legal. Confirm with client's malpractice carrier."},
    {cat:"WORKFLOW",sev:"Watch",status:"Active",issue:"Appointment reminder types limited and hard to configure without deep training.",workaround:"Allocate specific reminder training during onboarding. Build staff reference documentation."}
  ],
  "ModMed":[
    {cat:"IMPLEMENTATION",sev:"Critical",status:"Active",issue:"Consent forms via Klara require 14-21 day lead time from Klara team. Most common implementation surprise.",workaround:"Submit all consent content to Klara in week 1. Treat as a parallel project track, not an afterthought."},
    {cat:"PRICING",sev:"Significant",status:"Active",issue:"Pricing not publicly disclosed. Clients report variance between initial quote and final contract cost.",workaround:"Request fully itemized quote. Ask specifically about Klara, add-ons, and per-user fees. Get everything in the contract."},
    {cat:"REPORTING",sev:"Watch",status:"Active",issue:"Reporting interface clunky despite strong underlying data. Common report types hard to locate.",workaround:"Request dedicated reporting training during onboarding. Build a reference guide for common reports."},
    {cat:"WORKFLOW",sev:"Watch",status:"Active",issue:"Klara reminder workflow end-to-end not always clear. Practices unsure what fires when.",workaround:"Get a live demo of full reminder flow — booking through confirmation through reminder — before go-live."}
  ],
  "Podium AI OS":[
    {cat:"CLINICAL",sev:"Critical",status:"Active",issue:"New EMR layer (Jan 2026). No independent clinical reviews. Depth completely unproven.",workaround:"Do not recommend as primary EMR for surgical or complex clinical practices. Medspa-only until track record exists."},
    {cat:"CLINICAL",sev:"Critical",status:"Active",issue:"No injectable tracking, no before/after photo management, no surgical scheduling.",workaround:"Not appropriate as primary EMR for any practice doing injectables at scale or surgery."},
    {cat:"PRICING",sev:"Significant",status:"Active",issue:"Pricing fully opaque. Add-on fees flagged in Podium platform reviews.",workaround:"Require fully itemized quote in writing before any recommendation."},
    {cat:"WORKFLOW",sev:"Significant",status:"Active",issue:"Phone reliability and support responsiveness complaints on main Podium platform.",workaround:"Verify SLA specifically for aesthetics product. Get support response time in writing."}
  ],
  "Weave":[
    {cat:"INTEGRATION",sev:"Watch",status:"Active",issue:"Schedule sync with EMR can occasionally desync and require manual refresh.",workaround:"Train front desk to verify sync status at start of each day. Document manual refresh process."},
    {cat:"PRICING",sev:"Watch",status:"Active",issue:"$40-75/user/month is higher than competitors for basic phone functionality.",workaround:"Value is in EMR integration — if that's not being used, reconsider. Negotiate on user count."}
  ],
  "Nextech CRM":[{cat:"MATURITY",sev:"Watch",status:"Active",issue:"New product with limited real-world production reviews.",workaround:"Request client references specifically for CRM module. Verify in live demo with real data."}],
  "Dewy":[{cat:"SCOPE",sev:"Watch",status:"Active",issue:"Primarily ModMed-focused. Integration depth with other EMRs varies.",workaround:"Verify specific integration depth with client's EMR before recommending."}],
  "AestheticsPro":[
    {cat:"CLINICAL",sev:"Critical",status:"Active",issue:"Not designed for surgical practices. No OR scheduling, no surgical pre-op workflow, no insurance billing. Wrong platform for any practice with surgical caseload.",workaround:"Rule out immediately for surgical or hybrid practices. Medspa-only use cases only."},
    {cat:"INTEGRATION",sev:"Significant",status:"Active",issue:"Limited third-party integrations. Only 10 confirmed third-party tools. Canfield, TouchMD, and Klara not confirmed.",workaround:"Verify specific integration requirements before recommending. AP Focus is the native imaging solution -- does not integrate with external imaging platforms."},
    {cat:"PRICING",sev:"Significant",status:"Active",issue:"Per-user fee structure on Pro-Plus plan escalates quickly. $160/mo for 2 users, $85/additional user, capped at 3 users. Executive at $285/mo for unlimited users is the practical choice for most practices.",workaround:"Model out total cost at realistic user count before quoting. Push practices toward Executive plan if more than 3 staff users."},
    {cat:"WORKFLOW",sev:"Watch",status:"Active",issue:"UI described as dated by multiple reviewers. Navigation less intuitive than modern alternatives.",workaround:"Request a live demo with a real practice workflow scenario before recommending. Set expectations with clients upfront."},
    {cat:"INTEGRATION",sev:"Watch",status:"Active",issue:"Payment processor options restricted. Users report compatibility issues with certain credit card processors.",workaround:"Verify payment processor compatibility with AP Payments, Clover, or Gravity Forms before go-live."}
  ]
};


// ══════════════════════════════════════════════════════════════════════════════
// STACK AUDIT — v2 (Gap Analysis + Checklist + Client Report)
// ══════════════════════════════════════════════════════════════════════════════

var auditStep=0; // 0=home, 1=intake, 2=interview/questionnaire, 3=checklist, 4=report
var auditData={
  name:"",type:"hybrid",providers:"1",budget:"medium",insurance:"no",
  startup:"no",timeline:"standard",training:"standard",contract:"flexible",
  aiscribe:"no",crm_priority:"no",reporting:"no",
  currentStack:{emr:"None",phone:"None",financing:"None",imaging:"None",crm:"None",ai:"None"},
  painPoints:{
    communication:false,scheduling:false,billing:false,documentation:false,
    inventory:false,training:false,marketing:false,reporting:false
  },
  checklist:{},   // {categoryId: {itemId: {status, currentState, notes, priority}}}
  customCategories:[], // [{id,name,items:[{id,text}]}]
  notes:""
};

// ── CHECKLIST DATA ────────────────────────────────────────────────────────────
var AUDIT_CATEGORIES=[
  {id:"scheduling",label:"Scheduling & Front Desk",icon:"📅",always:true,items:[
    {id:"crm",text:"CRM / lead management system in place and being used"},
    {id:"reminder",text:"Reminder report worked daily — unconfirmed patients contacted"},
    {id:"waitlist",text:"Cancellation / waitlist actively managed"},
    {id:"preregistration",text:"Pre-registration sent to all patients at time of booking (24-48hrs min)"},
    {id:"portal",text:"Patient portal sent to every patient consistently"},
    {id:"history",text:"Patient history completed before appointment — not in office"},
    {id:"packages",text:"Packages configured correctly with expiration dates"},
    {id:"checkin",text:"Check-in / check-out protocol followed consistently"},
    {id:"dailyclose",text:"Daily close policy documented and followed every business day"},
    {id:"schedtemplates",text:"Scheduling templates built — appointment types, duration, block time per provider"},
    {id:"schedulesop",text:"SOP exists for which appointment type to book on which day per provider"}
  ]},
  {id:"registration",label:"Registration & Check-In",icon:"📋",always:true,items:[
    {id:"preregprotocol",text:"Pre-registration protocol automated — not completed day of in office"},
    {id:"historyfields",text:"Patient history fields fully completed before provider enters room"},
    {id:"demographics",text:"Patient demographics verified at each visit — address, phone, email, DOB"},
    {id:"insurance_verify",text:"Insurance verified before appointment if applicable"},
    {id:"notes_reviewed",text:"Patient chart notes reviewed by front desk before each appointment"},
    {id:"arrived",text:"Patient marked Arrived in EMR immediately upon check-in"},
    {id:"notification",text:"Clinical staff notified via defined channel — not verbally"},
    {id:"consents",text:"Consents sent and completed before arrival — not in waiting room"}
  ]},
  {id:"checkout",label:"Check-Out & Billing",icon:"💳",always:true,items:[
    {id:"copay",text:"Insurance copay collected at check-out every time"},
    {id:"cardonfile",text:"Correct card on file verified and updated at each visit"},
    {id:"charges",text:"Charges entered correctly — cosmetic and insurance split properly"},
    {id:"receipt",text:"Patient receipt provided when requested"},
    {id:"packages_applied",text:"Packages applied correctly at check-out — units deducted"},
    {id:"dailyclose_billing",text:"Daily close reconciliation completed — discrepancies flagged same day"},
    {id:"billing_handoff",text:"Billing team handoff clean — no open questions from front desk"}
  ]},
  {id:"documentation",label:"Clinical Documentation & Templates",icon:"📝",always:true,items:[
    {id:"templates_reviewed",text:"Treatment record templates reviewed, standardized, outdated ones retired"},
    {id:"chart_audit",text:"Chart audit process in place — monthly, assigned owner"},
    {id:"same_day",text:"Charting completed same day — non-negotiable policy"},
    {id:"lot_numbers",text:"Lot numbers entered in every injectable note — mandatory field"},
    {id:"gfe",text:"GFE template built and in use — state-compliant"},
    {id:"treatment_plan",text:"Annual treatment plan template in use — follow-up tracked"},
    {id:"provider_ease",text:"Provider can chart in the room — not after hours or on weekends"},
    {id:"superuser",text:"Template superuser assigned — owns and maintains template library"},
    {id:"inoffice_consents",text:"In-office procedure consents built — current, procedure-specific"},
    {id:"consult_templates",text:"Clinical consult templates built and in use"}
  ]},
  {id:"inventory",label:"Inventory Management",icon:"📦",always:true,items:[
    {id:"inv_tracked",text:"Inventory tracked in EMR — all products entered, quantities current"},
    {id:"weekly_counts",text:"Weekly inventory counts completed and documented"},
    {id:"lot_numbers_inv",text:"Lot numbers entered in every injectable note AND inventory record"},
    {id:"lot_report",text:"Lot number report available — can pull by product, date, provider"},
    {id:"lot_log",text:"Separate lot number log maintained outside the EMR"},
    {id:"inv_owner",text:"Inventory owner assigned — named person, accountable, trained"},
    {id:"par_levels",text:"Par levels set for all products — reorder triggers defined"},
    {id:"expired_process",text:"Expired product process in place — dates checked weekly"},
    {id:"receiving",text:"Product receiving documented — lot numbers recorded at receipt"},
    {id:"variance_process",text:"Variance process defined — how counted-vs-expected discrepancies get resolved"}
  ]},
  {id:"photography",label:"Photography & Imaging",icon:"📸",always:true,items:[
    {id:"photo_software",text:"Photo software in place and configured — TouchMD, Image Assist, or equivalent"},
    {id:"photo_every",text:"Before/after photos taken at every appointment — non-negotiable policy"},
    {id:"photo_sameday",text:"Photos uploaded same day — no backlog on devices"},
    {id:"photo_sop",text:"Photo SOP documented — covers each procedure type"},
    {id:"injectable_photos",text:"Injectable photo protocol — specific angles, lighting, distance defined"},
    {id:"face_photos",text:"Face photo protocol — standardized views, consistent lighting"},
    {id:"body_photos",text:"Body photo protocol — standardized positioning, gown/drape policy"},
    {id:"breast_photos",text:"Breast photo protocol — standardized positioning, consistent measurement markers"},
    {id:"staff_trained_photos",text:"All staff trained on photo protocol — competency verified"},
    {id:"canon_connect",text:"Canon Connect configured — camera-to-chart transfer working"},
    {id:"photos_linked",text:"Photos linked to patient chart correctly — date-stamped, provider tagged"},
    {id:"social_media_workflow",text:"Social media workflow defined — consent + selection process for using photos"}
  ]},
  {id:"marketing",label:"Marketing & Lead Management",icon:"📣",always:true,items:[
    {id:"lead_system",text:"Lead tracking system in place — all leads in one unified platform"},
    {id:"lead_understanding",text:"Staff understands what a lead is — formal funnel defined"},
    {id:"followup_protocol",text:"7-9 touchpoint follow-up protocol documented and assigned to owner"},
    {id:"response_time",text:"Response time to new leads under 1 hour during business hours"},
    {id:"referral_source",text:"Referral source tracked for every new patient — mandatory field"},
    {id:"referral_report",text:"Referral source report pulled and reviewed monthly"},
    {id:"online_booking",text:"Online scheduling configured correctly — on website and Google Business Profile"},
    {id:"reviews",text:"Review request process automated — sent after every appointment"},
    {id:"conversion",text:"Consultation conversion rate tracked as monthly KPI"}
  ]},
  {id:"financing",label:"Patient Financing",icon:"💰",always:true,items:[
    {id:"multiple_platforms",text:"Multiple financing platforms offered — CareCredit + PatientFi + Cherry"},
    {id:"website_financing",text:"Financing visible on website — logos, apply link, prominently placed"},
    {id:"office_signage",text:"Financing signage displayed in waiting room and consultation room"},
    {id:"pcc_presents",text:"PCC / front desk trained to present financing proactively at consultation"},
    {id:"emr_integration",text:"EMR integration confirmed for active financing platforms"},
    {id:"staff_knows_order",text:"Staff knows which platform to lead with — CareCredit first, PatientFi high-cost, Cherry for gap"},
    {id:"declined_alternative",text:"Declined patients offered alternative platform — Cherry as backup"},
    {id:"financing_tracked",text:"Monthly financing utilization tracked as KPI"}
  ]},
  {id:"emrconfig",label:"EMR Configuration & Templates",icon:"⚙️",always:true,items:[
    {id:"note_signoff",text:"Note sign-off process defined — provider signs same day"},
    {id:"signoff_report",text:"Open notes report pulled weekly — assigned owner"},
    {id:"template_library",text:"Template library reviewed and current — superuser assigned"},
    {id:"templates_maximized",text:"Templates maximized — provider charting in room, not around the template"},
    {id:"provider_feedback",text:"Provider feedback on templates collected — they were consulted in build"},
    {id:"quick_texts",text:"Quick texts / smart phrases configured for common phrases"},
    {id:"appt_types",text:"Appointment types built correctly — duration, provider-specific rules"},
    {id:"services_packages",text:"Services and packages configured — all services in EMR, packages correct"},
    {id:"quotes_config",text:"Quotes feature configured — converts to invoice, emailed to patient"},
    {id:"portal_config",text:"Patient portal configured — intake forms, consents, registration active"},
    {id:"emr_works_for_team",text:"EMR is working FOR the team — staff would miss it if it went away"}
  ]},
  {id:"training",label:"Staff Training & Workflows",icon:"👥",always:true,items:[
    {id:"formal_training",text:"All staff formally trained on EMR at onboarding — written plan, competency verified"},
    {id:"training_docs",text:"Training documentation exists — SOPs for every role, updated with software changes"},
    {id:"tech_sentiment",text:"Staff feels technology works for them — not working around it"},
    {id:"pain_collected",text:"Pain points actively collected from staff — regular check-ins"},
    {id:"easy_wins",text:"Easy wins identified and implemented — staff requests acted on quickly"},
    {id:"superuser_training",text:"Super user assigned per location — trained power user for questions"},
    {id:"new_hire_training",text:"New staff training process defined — structured EMR onboarding"},
    {id:"vendor_support",text:"Staff knows how to submit support tickets and escalate issues"},
    {id:"what_would_change",text:"'What would you change?' question asked of every staff member"}
  ]},
  // Conditional — surgical only
  {id:"surgical",label:"Surgical Workflows",icon:"🏥",always:false,trigger:"surgical",items:[
    {id:"preop_template",text:"Pre-op template built with checklist — digital, signed off before every case"},
    {id:"postop_template",text:"Post-op template built — standardized wound check, instructions"},
    {id:"surgical_consents",text:"Surgical consent forms built — procedure-specific, current, legally reviewed"},
    {id:"or_scheduling",text:"OR / surgical day scheduling configured — block time, duration rules"},
    {id:"quotes_surgical",text:"Quotes created and converted correctly for surgical cases"},
    {id:"preop_process",text:"Pre-op process defined — labs, clearances, pre-op call tracked in EMR"}
  ]},
  // Conditional — communication pain point
  {id:"communication",label:"Internal Communication (Teams/Planner)",icon:"💬",always:false,trigger:"communication",items:[
    {id:"teams_setup",text:"Microsoft Teams set up — channels organized by function"},
    {id:"staff_using_teams",text:"Staff actively using Teams — not defaulting to text or phone"},
    {id:"provider_responsive",text:"Providers responsive on Teams — response time expectations set"},
    {id:"planner_used",text:"Microsoft Planner or Tasks used for project/task management"},
    {id:"communication_sop",text:"Internal communication SOP defined — what goes in Teams vs email vs call"}
  ]}
];

var STATUS_OPTIONS=[
  {value:"ok",label:"✅ In place",color:"#059669"},
  {value:"partial",label:"⚠️ Needs work",color:"#D97706"},
  {value:"missing",label:"❌ Not in place",color:"#DC2626"},
  {value:"na",label:"🔵 N/A",color:"#6B7280"}
];

function rAudit(body){
  if(auditMode==="review"){
    if(swReviewStep===0)rSWRHome(body);
    else if(swReviewStep===1)rSWRIntake(body);
    else if(swReviewStep===2)rSWRChecklist(body);
    else rSWRReport(body);
  } else {
    if(auditStep===0)rAuditHome(body);
    else if(auditStep===1)rAuditIntake(body);
    else if(auditStep===2)rAuditInterview(body);
    else if(auditStep===3)rAuditChecklist(body);
    else rAuditReport(body);
  }
}

function rAuditHome(body){
  var saved=Object.keys(audits);
  var h='<div style="max-width:800px;margin:0 auto;padding:16px">';
  h+='<div style="display:flex;gap:0;margin-bottom:20px;border:2px solid var(--navy);border-radius:10px;overflow:hidden">';
  h+='<button id="mode-full" style="flex:1;padding:12px;border:none;background:'+(auditMode==="full"?"var(--navy)":"#fff")+';color:'+(auditMode==="full"?"#fff":"var(--navy)")+';font-size:13px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif">📊 Full Technology Audit</button>';
  h+='<button id="mode-review" style="flex:1;padding:12px;border:none;border-left:2px solid var(--navy);background:'+(auditMode==="review"?"var(--navy)":"#fff")+';color:'+(auditMode==="review"?"#fff":"var(--navy)")+';font-size:13px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif">🔍 Software Review</button>';
  h+='</div>';
  if(auditMode==="full"){
  h+='<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">';
  h+='<div><p style="font-size:12px;color:var(--text3);margin:0">Full 10-category gap analysis — client-facing deliverable</p></div>';
  h+='<button id="audit-new" style="background:var(--navy);color:#fff;border:none;border-radius:8px;padding:10px 18px;font-size:13px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif">+ New Audit</button></div>';
  } else {
  h+='<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">';
  h+='<div><p style="font-size:12px;color:var(--text3);margin:0">EMR-specific review — pre-onsite prep, internal briefings, client-ready output</p></div>';
  h+='<button id="swr-new" style="background:var(--navy);color:#fff;border:none;border-radius:8px;padding:10px 18px;font-size:13px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif">+ New Review</button></div>';
  }

  // How it works — only show for full audit mode
  if(auditMode==="full"){
    if(!saved.length){
      h+='<div style="background:var(--navy);border-radius:12px;padding:22px;margin-bottom:20px">';
      h+='<div style="font-size:10px;font-weight:700;color:var(--gold);text-transform:uppercase;letter-spacing:.6px;margin-bottom:12px">How it works</div>';
      h+='<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px">';
      [{n:"1",t:"Practice intake",d:"Name, type, current stack, pain points"},{n:"2",t:"Checklist assessment",d:"10 categories, status per item, notes"},{n:"3",t:"Custom items",d:"Add categories and items on the fly"},{n:"4",t:"Client report",d:"Branded PDF matching ACG deliverable format"}].forEach(function(s){
        h+='<div><div style="width:28px;height:28px;background:var(--gold);color:var(--navy);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;margin-bottom:8px">'+s.n+'</div>';
        h+='<div style="font-size:12px;font-weight:700;color:#fff;margin-bottom:3px">'+s.t+'</div>';
        h+='<div style="font-size:11px;color:rgba(255,255,255,.5)">'+s.d+'</div></div>';
      });
      h+='</div></div>';
    }
  }

  // Previous audits — full audit mode only
  if(auditMode==="full"&&saved.length){
    h+='<div style="margin-bottom:16px"><div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:var(--text3);margin-bottom:10px">Previous Audits ('+saved.length+')</div>';
    saved.forEach(function(name){
      var a=audits[name];
      var checklist=a.intake.checklist||{};
      var totalItems=0,missingItems=0,partialItems=0;
      Object.values(checklist).forEach(function(cat){
        Object.values(cat).forEach(function(item){
          totalItems++;
          if(item.status==="missing")missingItems++;
          if(item.status==="partial")partialItems++;
        });
      });
      h+='<div style="background:#fff;border:1px solid var(--tan2);border-radius:10px;padding:14px 16px;margin-bottom:8px;display:flex;align-items:center;gap:14px">';
      h+='<div style="flex:1"><div style="font-size:14px;font-weight:700;color:var(--navy)">'+esc(name)+'</div>';
      h+='<div style="font-size:11px;color:var(--text3);margin-top:3px">'+(a.intake.type||"")+(a.intake.providers?' · '+a.intake.providers+' provider'+(a.intake.providers!=="1"?"s":""):"")+' · '+(a.ts?new Date(a.ts).toLocaleDateString():"")+'</div>';
      if(totalItems){h+='<div style="display:flex;gap:8px;margin-top:6px">';
        if(missingItems)h+='<span style="font-size:10px;background:#FEE2E2;color:#DC2626;padding:2px 7px;border-radius:6px;font-weight:700">❌ '+missingItems+' missing</span>';
        if(partialItems)h+='<span style="font-size:10px;background:#FEF3C7;color:#D97706;padding:2px 7px;border-radius:6px;font-weight:700">⚠️ '+partialItems+' need work</span>';
        h+='</div>';}
      h+='</div>';
      h+='<div style="display:flex;gap:8px">';
      h+='<button class="s-btn audit-continue" data-name="'+esc(name)+'">Continue</button>';
      h+='<button class="s-btn audit-report" data-name="'+esc(name)+'">Report</button>';
      h+='<button class="s-btn danger audit-del" data-name="'+esc(name)+'">\xd7</button>';
      h+='</div></div>';
    });
    h+='</div>';
  }
  h+='</div>';

  // Software Review list
  if(auditMode==="review"){
    var savedReviews=Object.keys(softwareReviews);
    if(savedReviews.length){
      h+='<div style="margin-bottom:16px"><div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:var(--text3);margin-bottom:10px">Previous Software Reviews ('+savedReviews.length+')</div>';
      savedReviews.forEach(function(rid){
        var r=softwareReviews[rid];
        var tpl=SOFTWARE_REVIEW_TEMPLATES[r.emr];
        h+='<div style="background:#fff;border:1px solid var(--tan2);border-radius:10px;padding:14px 16px;margin-bottom:8px;display:flex;align-items:center;gap:14px">';
        h+='<div style="flex:1"><div style="font-size:14px;font-weight:700;color:var(--navy)">'+esc(r.name||"Untitled")+'</div>';
        h+='<div style="font-size:11px;color:var(--text3);margin-top:3px">'+esc(r.emr)+(tpl&&!tpl.ready?' · <span style="color:var(--amber)">⚠ Data exercise pending</span>':'')+'  ·  '+(r.ts?new Date(r.ts).toLocaleDateString():"")+'</div></div>';
        h+='<div style="display:flex;gap:8px">';
        h+='<button class="s-btn swr-continue" data-id="'+esc(rid)+'">Continue</button>';
        h+='<button class="s-btn swr-report" data-id="'+esc(rid)+'">Report</button>';
        h+='<button class="s-btn danger swr-del" data-id="'+esc(rid)+'">×</button>';
        h+='</div></div>';
      });
      h+='</div>';
    } else {
      h+='<div style="background:#fff;border:1px solid var(--tan2);border-radius:12px;padding:24px;text-align:center;color:var(--text3);font-size:13px">No software reviews yet. Click + New Review to start.</div>';
    }
  }

  h+='</div>';
  body.innerHTML=h;

  document.getElementById("mode-full").addEventListener("click",function(){auditMode="full";render();});
  document.getElementById("mode-review").addEventListener("click",function(){auditMode="review";render();});
  if(document.getElementById("audit-new"))document.getElementById("audit-new").addEventListener("click",function(){
    auditData={name:"",type:"hybrid",providers:"1",budget:"medium",insurance:"no",startup:"no",timeline:"standard",training:"standard",contract:"flexible",aiscribe:"no",crm_priority:"no",reporting:"no",currentStack:{emr:"None",phone:"None",financing:"None",imaging:"None",crm:"None",ai:"None"},painPoints:{communication:false,scheduling:false,billing:false,documentation:false,inventory:false,training:false,marketing:false,reporting:false},checklist:{},customCategories:[],notes:""};
    auditStep=1;saveAuditCurrent();render();
  });
  if(document.getElementById("swr-new"))document.getElementById("swr-new").addEventListener("click",function(){
    swReviewData={id:uid(),name:"",emr:"4D",notes:"",checklist:{},ts:Date.now()};
    swReviewStep=1;render();
  });
  body.querySelectorAll(".audit-continue").forEach(function(btn){
    btn.addEventListener("click",function(){
      var n=btn.dataset.name;
      if(audits[n]){auditData=JSON.parse(JSON.stringify(audits[n].intake));auditStep=3;saveAuditCurrent();render();}
    });
  });
  body.querySelectorAll(".audit-report").forEach(function(btn){
    btn.addEventListener("click",function(){
      var n=btn.dataset.name;
      if(audits[n]){auditData=JSON.parse(JSON.stringify(audits[n].intake));auditStep=4;render();}
    });
  });
  body.querySelectorAll(".audit-del").forEach(function(btn){
    btn.addEventListener("click",function(){
      if(!confirm("Delete this audit?"))return;
      delete audits[btn.dataset.name];
      save(SK+"_audits",audits);render();
    });
  });
  body.querySelectorAll(".swr-continue").forEach(function(btn){
    btn.addEventListener("click",function(){
      var r=softwareReviews[btn.dataset.id];
      if(r){swReviewData=JSON.parse(JSON.stringify(r));swReviewStep=2;render();}
    });
  });
  body.querySelectorAll(".swr-report").forEach(function(btn){
    btn.addEventListener("click",function(){
      var r=softwareReviews[btn.dataset.id];
      if(r){swReviewData=JSON.parse(JSON.stringify(r));swReviewStep=3;render();}
    });
  });
  body.querySelectorAll(".swr-del").forEach(function(btn){
    btn.addEventListener("click",function(){
      if(!confirm("Delete this review?"))return;
      delete softwareReviews[btn.dataset.id];
      save(SK+"_swreviews",softwareReviews);render();
    });
  });
}

