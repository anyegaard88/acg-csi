// ─── SEED DATA ────────────────────────────────────────────────────────────────
const SEED = [{
  id:'fg_4d_s1',
  platform:'4D Practice Management',
  title:'New Staff Onboarding',
  sessionLabel:'Session 1',
  duration:'45–60 min',
  audience:'Front-desk staff · New hires',
  meta:'A field guide for the trainer — not a script to read aloud. Your job is to know this material well enough that you can teach it in your own words, answer questions that go off-script, and adapt to where staff get stuck.',
  intentNote:'"The goal isn\'t to get through these slides — it\'s to leave staff confident enough to use the system on a real patient tomorrow."',
  footer:'ACG Practice Partners · Confidential · Internal trainer use only',
  createdAt:Date.now(), updatedAt:Date.now(),
  sections:[
    {id:'s_pre',num:'PRE',title:'Before You Start',timing:'5 min',theme:'default',blocks:[
      {id:'b0',type:'checklist',content:['All attendees logged into 4D — get credentials from the office manager ahead of time','You\'re screen-sharing your own login — staff follow along on their own screens','You know the client\'s provider name(s) — reference the real calendar, not a placeholder','Test patient exists — if not, create: First = [YourName], Last = Test','Gusto clock-in resolved (confirm with Davina if unsure — separate issue, don\'t let it derail the session)']}
    ]},
    {id:'s1',num:'01',title:'Scheduling & Calendar',timing:'12 min',theme:'default',blocks:[
      {id:'b1',type:'why',content:'This is where staff live every day. The schedule is the first thing they\'ll open in the morning and the last thing they\'ll check before going home. A mistake here — booking the wrong provider, wrong appointment type, wrong time — doesn\'t just inconvenience the patient. It can cascade into a billing error or a provider double-book. Getting comfortable with the calendar isn\'t optional.'},
      {id:'b2',type:'understand',content:['Multiple providers, multiple views. The calendar can show one provider or all of them simultaneously. Staff toggle providers on and off using the list in the left rail. Views range from daily all the way to 6-month — use whatever makes sense for the task at hand.','\"Find Openings\" is the underutilized gem. Most staff don\'t know it exists. When appointment templates are configured properly, Find Openings scans the entire schedule and surfaces available slots for a specific appointment type. It\'s the fastest way to fill new patient slots without scrolling through weeks of calendar. Make sure staff leave knowing this exists.','The price list lives on the schedule. There\'s a price list feature showing all surgical procedure fees — surgeon fee only, explicitly excluding facility and anesthesia. Staff will see this when they\'re booking or quoting. It\'s useful but incomplete until facility/anesthesia fees are added (see Open Items).','Online booking is live. Patients can book through the online portal link. These bookings land in the schedule as pending and need staff approval before they\'re confirmed. Nobody sees them as confirmed until someone clicks approve.','Templates control the structure. Appointment templates set which appointment types are available, when they can be booked, and whether simultaneous bookings are allowed. Templates can also be used for non-patient recurring events — team meetings, block times, anything. Staff don\'t need to build templates; that\'s admin work. But they should understand that the template is why the schedule looks the way it does.','Refresh matters in a multi-user office. If two staff members are looking at the schedule at the same time, changes made by one don\'t automatically appear for the other. The Refresh button syncs it. Teach staff to hit Refresh before assuming a slot is open.']},
      {id:'b3',type:'demo',note:'Adapt the order — if staff are immediately curious about something, follow their interest.',content:['Toggle a provider on and off in the left rail — show how the calendar clears and refills','Switch between Day, 3-Month, and 6-Month views','Walk through Find Openings — pick an appointment type and show the results','Show the price list feature on the schedule','Right-click an appointment — walk through the options menu (cancel by office vs by patient, reschedule, contact patient, send portal invite, go to money screen, view appointment history)','Point out the Refresh button and explain when to use it']},
      {id:'b4',type:'watch',content:['Staff clicking into appointment templates — that\'s admin territory. Show them where it lives and that it\'s not their job to edit it.','Find Openings returns nothing: templates may not be configured for that type. Don\'t troubleshoot live — flag it for the consultant after the session.','Patient names disappear from the calendar — Privacy Mode is toggled on. Check it first before assuming something is broken.','The "cancel by office" vs "cancel by patient" distinction matters for reporting. Staff should use the right one — it affects who the cancellation is attributed to.']}
    ]},
    {id:'s2',num:'02',title:'New Patient Registration & Portal',timing:'12 min',theme:'default',blocks:[
      {id:'b5',type:'why',content:'Registration is the foundation of everything downstream. A wrong date of birth affects billing. A wrong email means the patient never gets their portal invitation or appointment reminders. Getting registration right is how you avoid a mess six weeks later when someone\'s insurance claim kicks back or a patient says they never got their intake forms.'},
      {id:'b6',type:'understand',content:['"Never Before Seen" vs "Previously Seen." Never Before Seen is what staff use for brand new patients. Previously Seen is almost exclusively for patients migrated from a different EMR — staff won\'t use it often, if ever. Make sure they know which one is the default.','Email and mobile number are the two critical fields. Both drive the portal invitation (email) and appointment reminders (text). Missing either one means the patient falls out of the automated communication loop. If they don\'t have an email, staff will need to walk them through the portal in-office using the staff-side login.','\"Save and Send Portal Invitation\" does two things at once. It sends an email AND a text to the patient simultaneously. The patient gets a link to create their portal account. Staff can resend this at any time — including when a returning patient needs to update their health history.','The health history form is the most important portal form. It captures medications, allergies, surgeries, health conditions, and family history. Staff need to know this is where that information lives — not in a paper form somewhere. The portal saves page by page, so patients can complete it in multiple sessions without losing progress.','The marketing opt-in is separate from appointment notifications. If a patient opts out of marketing texts on the portal, they still get appointment reminders. These are different systems. Staff don\'t need to explain this in detail — but they should know it so they don\'t panic when a patient says "I opted out of texts" and they\'re still getting reminders.','Reminder timing is set at registration. 4D sends reminders at 10 days and 2 days before the appointment. This is configured when the patient is created. Don\'t skip those fields.','Referral source is a required habit, not optional. It feeds marketing reports. Make it non-negotiable from day one — it\'s much harder to go back and fill in retrospectively.']},
      {id:'b7',type:'demo',content:['Walk through the new patient form field by field — DOB format, preferred language, referral source, reminder timing, emergency contact','Click "Save and Send Portal Invitation" — explain what lands in the patient\'s inbox and on their phone','Open the staff-side portal login — walk through health history and consent forms as if you were the patient','Show that the portal saves page by page (navigate away mid-form, come back — progress is still there)','Show how to resend a portal invitation from an existing patient\'s chart']},
      {id:'b8',type:'watch',content:['Portal invitation email doesn\'t arrive immediately during demo — this happened in a real session. Wait 2 minutes, check spam, resend. If still broken, flag for the consultant — it\'s a system issue, not user error.','Staff confusing marketing opt-out with appointment reminder opt-out — they\'re completely separate. Remind staff when it comes up.','Patient with no email — use the staff-side portal login to walk them through intake forms in the office. This is a documented workaround, not a gap.']}
    ]},
    {id:'s3',num:'03',title:'Patient Status Workflow',timing:'8 min',theme:'default',blocks:[
      {id:'b9',type:'why',content:'Patient status is the hand-off signal between scheduling, clinical, and billing. If it doesn\'t get updated, billing doesn\'t know the patient was seen. For surgical patients especially, this is non-negotiable — an appointment that never gets checked out can hold up a claim for weeks.'},
      {id:'b10',type:'understand',content:['Three stages, in order: Arrived → Roomed → Checked Out. Each one is a separate action in 4D, and each one matters. Skipping Roomed and jumping straight to Checked Out is common and creates reporting gaps.','Roomed requires a room selection. This isn\'t optional if the practice is tracking room utilization. Staff need to select the specific room from the dropdown — not just click Roomed and move on.','Checked Out is what closes the billing loop. Especially for surgical patients. Billing can\'t finalize a claim until the appointment has a Checked Out status. If a claim is stuck, this is often why.','The candy cane stripe is a signal for the provider, not staff. It appears on the schedule when a patient is checked out but the chart note hasn\'t been signed. Staff see it and often wonder what it means — now you can tell them. It\'s a prompt for the provider to finish their note, not something staff need to act on.','Appointment History is the accountability log. Every status change, every reschedule, every cancellation — who did it and when. This is the tool to pull when there\'s a dispute about what happened to an appointment.','All of this lives in the right-click menu. Right-click any appointment and you get: status updates, cancel options, reschedule, contact the patient, send portal invite, go to money screen, view appointment history.']},
      {id:'b11',type:'demo',content:['Right-click a test appointment → "Patient Arrived"','Right-click → "Roomed" → select a room from the dropdown (show what happens if you skip the room selection)','Right-click → "Checked Out" — make the connection to billing explicitly','Show the candy cane stripe and explain what it signals','Open Appointment History — walk through the log so staff know it\'s there']},
      {id:'b12',type:'watch',content:['Rooming without selecting a room — blank in reports. Correct it in the moment so it becomes a habit.','Staff checking out a patient before the appointment ends — especially for surgical cases where billing is sensitive. Not a broken process, just a timing thing to be aware of.','Staff panicking about the candy cane — it\'s not theirs to fix. It\'s a provider task.']}
    ]},
    {id:'s4',num:'04',title:'Patient Chart: Summary, Timeline & Profile',timing:'10 min',theme:'default',blocks:[
      {id:'b13',type:'why',content:'The chart is where everything about a patient lives — their demographics, their clinical history, every message ever sent to them. For front-desk staff, it\'s primarily a communication and context tool. Knowing where to look in the chart is how staff answer patient calls quickly, catch duplicate messages before they send, and prove what happened when something is disputed.'},
      {id:'b14',type:'understand',content:['The Summary tab is the at-a-glance view. It shows demographics, the most recent chart note, allergy information, any alerts set for this patient, cosmetic balance, insurance balance, and past surgeries. Staff should check here before jumping into calls with patients.','The Timeline is the communication record. Every email, text message, portal invitation, and appointment reminder — timestamped and logged automatically. This is the tool to pull when a patient says "I never got that text." The timestamp is definitive.','Text message templates save time. Staff can create reusable text templates for common messages — post-visit follow-ups, appointment prep reminders, whatever comes up repeatedly.','Unread message badges show by user. If a patient replies to a message, the unread indicator shows up next to the staff member\'s name in the system. It\'s not a shared inbox — messages don\'t auto-assign. Staff need to check their own queue.','\"Y\" replies are intentionally suppressed. When the system sends an appointment reminder and the patient texts back "Y" to confirm, that reply doesn\'t generate a notification. This is deliberate — to avoid notification overload. Staff sometimes wonder why they\'re not seeing confirmation replies. That\'s why.','The Profile tab has persistent admin comments. These are practice-wide alerts that fire every time the chart is opened. An admin comment that\'s no longer relevant needs to be manually cleared or it\'ll keep showing up.']},
      {id:'b15',type:'demo',content:['Open the test patient chart → walk through Summary tab and name each section','Point out cosmetic balance vs insurance balance — explain they come from different places','Open Timeline → scroll through, point out timestamps and message types','Show the text message box → demonstrate creating a template (don\'t send)','Click Profile tab → show the admin comment field and explain what "persistent alert" means in practice','Point out where unread message badges appear in the navigation']},
      {id:'b16',type:'watch',content:['Admin comments used as general notes — they don\'t age out. If staff add something situational, they need to clear it when it\'s resolved.','Staff assuming unread messages are shared — they\'re not. Each staff member needs to check their own.','Patient disputes a reminder — pull the Timeline before getting into a back-and-forth. The log settles it.']}
    ]},
    {id:'s5',num:'05',title:'Financials — Overview',timing:'8 min',theme:'default',blocks:[
      {id:'b17',type:'why',content:'Front-desk staff don\'t own financial management — but they do touch it every day. Collecting copays, applying consultation credits, taking deposits. Knowing where those transactions live and which ledger is which prevents staff from working in the wrong place and creating errors the billing team has to untangle later.'},
      {id:'b18',type:'understand',content:['Two ledgers, two systems. The Patient Ledger handles cosmetic transactions — charges, prepayments, credits, gift cards, cosmetic balances. The Insurance Ledger handles insurance transactions and flows through a separate system called OpenPM, managed by the billing company Octus. Staff will work almost exclusively in the Patient Ledger.','The Money Screen is the day-to-day hub. This is where staff process payments, apply credits, void receipts, accept returns, and issue refunds. It\'s accessible from the right-click appointment menu and from the patient chart. Staff should use the Money Screen, not the Financials tab, for their daily transactions.','Discounts always need a reason. When applying any discount, 4D requires a discount reason. This is mandatory — not optional — for audit purposes. Staff should get in the habit of always entering one.','The $100 consultation credit is already configured. This is pre-built in the system. Staff don\'t need to create it — they just need to know how to apply it when appropriate.','Insurance is automated between 4D and OpenPM. Data flows between the two systems. Staff don\'t need to do anything to make that happen — and they shouldn\'t try to manually reconcile it. If something looks wrong, that\'s a conversation for the consultant or Octus.']},
      {id:'b18c',type:'callout',content:'Insurance setup via OpenPM is still being completed by Octus. The Insurance Ledger may look incomplete until that configuration is done — that\'s expected.'},
      {id:'b19',type:'demo',content:['From the patient chart, click through to the Money Screen','Walk through the Patient Ledger — name each column, explain what it tracks','Show where a payment would be entered (don\'t process a real charge)','Show the discount field and the required reason dropdown','Click to the Insurance Ledger — explain it\'s there but managed elsewhere']},
      {id:'b20',type:'watch',content:['Discount applied without a reason — the system may allow it, but it\'s bad practice and hurts audit trails. Make it a hard habit from day one.','Staff poking around in the Insurance Ledger trying to fix something — redirect them. That\'s Octus territory.','Confusing the Money Screen with the Financials tab — they look similar but serve different purposes. Daily transactions go through the Money Screen.']}
    ]},
    {id:'s_hw',num:'HW',title:'Homework — Before Session 2',timing:'',theme:'green',blocks:[
      {id:'b21',type:'checklist',content:['Create a test patient (first name + "Test" as last name) in 4D','Send yourself a portal invitation and complete the full health history + consent forms','Walk the test patient through all three status stages (Arrived → Roomed → Checked Out)','Explore the quoting feature — create a test quote on the test patient','Write down anything that felt confusing — bring questions to Session 2']},
      {id:'b21c',type:'callout',content:'Tell them: "You can\'t break anything on a test patient. The best way to learn this system is to click around." This reduces anxiety and gets them actually practicing.'}
    ]},
    {id:'s_close',num:'END',title:'Closing the Session',timing:'5 min',theme:'default',blocks:[
      {id:'b22',type:'principles',content:['📍|Where to start tomorrow. They should be able to open the schedule, find their provider\'s calendar, and understand what they\'re looking at. That\'s the baseline.','🔑|The test patient is their sandbox. Reinforce that practicing on a test patient is safe and encouraged. Self-guided practice between sessions is how they get comfortable faster than any training can achieve.','📅|What Session 2 will cover. Quoting in depth, text and email templates, appointment reminders, and answers to anything that came up between sessions. Give them something to look forward to.']},
      {id:'b22p',type:'preview-pills',content:['💰 Quoting in depth','📱 Text & email templates','🔔 Appointment reminders','❓ Open Q&A from Session 1']}
    ]},
    {id:'s_open',num:'⚠',title:'Open Items — Know Before You Train',timing:'',theme:'red',blocks:[
      {id:'b23',type:'open-items',content:['Facility and anesthesia fees — not yet in 4D. Surgical quotes will show surgeon fees only until these are added. Set the expectation so staff know the quote is intentionally incomplete for now.','Quest integration — in final testing, not yet live. In the meantime, staff complete requisition forms manually and scan them back into 4D under Forms & Scans.','Insurance setup (OpenPM/Octus) — still being configured. Insurance Ledger may look thin. Expected to be complete within days.','Supply/inventory list — Dr. Anderson finalizing. Needed for inventory setup in 4D; no action for staff yet.','Portal invitation email delay — a delay was observed in a live training session. If the email doesn\'t arrive quickly, wait 2 minutes, check spam, then resend. Flag to consultant if still not working.']}
    ]}
  ]
}];

// ─── STORAGE ─────────────────────────────────────────────────────────────────
const LS_GUIDES = 'acg_fg_v1';
const LS_CHECKS = 'acg_fg_chk_v1';

function loadGuides(){
  try{const r=localStorage.getItem(LS_GUIDES);if(r)return JSON.parse(r);}catch(e){}
  return JSON.parse(JSON.stringify(SEED));
}
function saveGuides(g){try{localStorage.setItem(LS_GUIDES,JSON.stringify(g));}catch(e){}}
function loadChecks(){try{const r=localStorage.getItem(LS_CHECKS);if(r)return JSON.parse(r);}catch(e){}return{};}
function saveChecks(c){try{localStorage.setItem(LS_CHECKS,JSON.stringify(c));}catch(e){}}

// ─── STATE ────────────────────────────────────────────────────────────────────
let guides=loadGuides();
let checks=loadChecks();
let mode='library'; // library | view | edit | transcript | merge-tx | merge
let activeId=null;
let editDraft=null;
let openEditorSections=new Set();
let mergeState=null; // {targetId, newGuide, decisions}

function getGuide(id){return guides.find(g=>g.id===id);}
function uid(){return 'id_'+Math.random().toString(36).slice(2,9);}
function escH(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function fmt(s){return escH(s).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>');}

// ─── RENDER ───────────────────────────────────────────────────────────────────
function fgRender(){
  var _fgRoot=document.getElementById("fg-app");if(!_fgRoot)return;
  _fgRoot.innerHTML=
    mode==='library'?renderLibrary():
    mode==='view'?renderViewer(getGuide(activeId)):
    mode==='transcript'?renderTranscript():
    mode==='merge-tx'?renderMergeTranscript():
    mode==='merge'?renderMerge():
    renderEditor(editDraft);
  bindEvents();
  if(mode==='view') loadViewerChecks();
}

// ── LIBRARY ──
function renderLibrary(){
  const cards=guides.length?guides.map(renderGuideCard).join(''):`
    <div class="empty-state">
      <div class="empty-icon">📋</div>
      <div class="empty-title">No field guides yet</div>
      <div class="empty-sub">Create your first training guide to get started.</div>
      <button class="btn-primary" onclick="newGuide()">+ New Guide</button>
    </div>`;
  return `
    <div class="top-bar">
      <div class="top-bar-row">
        <div><div class="top-title">ACG Field Guides</div><div class="top-sub">Trainer field guides for platform onboarding</div></div>
        <div style="display:flex;gap:6px">
          <button class="top-btn ghost" onclick="openTranscript()">From Transcript</button>
          <button class="top-btn gold" onclick="newGuide()">+ New Guide</button>
        </div>
      </div>
    </div>
    <div class="main">${cards}</div>`;
}

function renderGuideCard(g){
  return `
    <div class="guide-card">
      <div class="guide-card-header">
        <span class="guide-platform-badge">${escH(g.platform)}</span>
        <div class="guide-card-actions">
          <button class="btn-edit" onclick="openMergeFlow('${g.id}')" title="Update from transcript">↑ Update</button>
          <button class="btn-edit" onclick="startEdit('${g.id}')">Edit</button>
          <button class="btn-delete" onclick="deleteGuide('${g.id}')" title="Delete guide">✕</button>
        </div>
      </div>
      <div>
        <div class="guide-title">${escH(g.title)}</div>
        <div class="guide-session">${escH(g.sessionLabel||'')}${g.audience?` · ${escH(g.audience)}`:''}</div>
      </div>
      <div class="guide-meta-row">
        ${g.duration?`<span class="guide-tag">⏱ ${escH(g.duration)}</span>`:''}
        <span class="guide-tag">${g.sections.length} sections</span>
      </div>
      <button class="btn-view" onclick="openGuide('${g.id}')">View Guide →</button>
    </div>`;
}

// ── VIEWER ──
function renderViewer(g){
  if(!g)return'';
  const pills=g.sections.map((s,i)=>`<div class="pill${i===0?' active':''}" data-idx="${i}" onclick="jumpTo('vs_${s.id}')">${escH(s.num||s.title.split(' ')[0])}</div>`).join('');
  const secs=g.sections.map((s,si)=>renderViewerSection(s,g.id,si)).join('');
  const checkId=g.id+'_pre';
  const preChecks=checks[checkId]||{};
  const preCount=Object.values(preChecks).filter(Boolean).length;
  const firstSec=g.sections[0];
  const totalPre=firstSec&&firstSec.blocks.find(b=>b.type==='checklist')?
    (firstSec.blocks.find(b=>b.type==='checklist').content||[]).length:0;
  return `
    <div class="top-bar">
      <div class="top-bar-row">
        <div style="display:flex;align-items:center;gap:10px;min-width:0">
          <button class="top-btn-icon" onclick="goLibrary()">←</button>
          <div style="min-width:0"><div class="top-title" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${escH(g.title)}</div>
          <div class="top-sub">${escH(g.sessionLabel||'')} · ${escH(g.platform)}</div></div>
        </div>
        <div style="display:flex;gap:6px">
          <button class="top-btn ghost" onclick="openMergeFlow('${g.id}')">↑ Update</button>
          <button class="top-btn ghost" onclick="startEdit('${g.id}')">Edit</button>
        </div>
      </div>
      <div class="pills-row" id="viewer-pills">${pills}</div>
    </div>
    <div class="main" id="viewer-main">
      <div class="meta-card">
        <div class="meta-item"><span class="meta-label">Session length</span><span class="meta-value">${escH(g.duration||'—')}</span></div>
        <div class="meta-item"><span class="meta-label">Platform</span><span class="meta-value">${escH(g.platform)}</span></div>
        ${g.audience?`<div class="meta-item full"><span class="meta-label">Audience</span><span class="meta-value normal">${escH(g.audience)}</span></div>`:''}
        ${g.meta?`<div class="meta-item full"><span class="meta-label">What this is</span><span class="meta-value normal">${escH(g.meta)}</span></div>`:''}
      </div>
      <div class="how-card">
        <div class="how-title">How to use this guide</div>
        <div class="how-grid">
          <div class="how-row"><span class="how-icon">💡</span><span><strong>WHY IT MATTERS</strong> — context so you can explain it</span></div>
          <div class="how-row"><span class="how-icon">🧠</span><span><strong>UNDERSTAND THIS</strong> — the deeper picture</span></div>
          <div class="how-row"><span class="how-icon">🖱</span><span><strong>SHOW THIS</strong> — loose demo waypoints</span></div>
          <div class="how-row"><span class="how-icon">⚠️</span><span><strong>WATCH-OUTS</strong> — what goes wrong</span></div>
        </div>
        ${g.intentNote?`<div class="intent-note">${escH(g.intentNote)}</div>`:''}
      </div>
      ${secs}
      <div class="complete-banner${totalPre>0&&preCount>=totalPre?' show':''}" id="complete-banner">
        <span style="font-size:20px">✅</span><span>Pre-session checklist complete — you're ready to train.</span>
      </div>
      ${g.footer?`<div class="viewer-footer">${escH(g.footer)}</div>`:''}
    </div>`;
}

function renderViewerSection(s,gid,si){
  const themeClass=s.theme==='green'?'green-bg':s.theme==='red'?'red-bg':'';
  const blocks=s.blocks.map((b,bi)=>renderViewerBlock(b,gid,s.id,si,bi)).join('');
  return `
    <div class="section-card${si===0?' open':''}" id="vs_${s.id}">
      <div class="section-header ${themeClass}" onclick="this.closest('.section-card').classList.toggle('open')">
        <div class="section-left">
          ${s.num?`<span class="section-num">${escH(s.num)}</span>`:''}
          <span class="section-title-text">${escH(s.title)}</span>
        </div>
        ${s.timing?`<span class="section-time">${escH(s.timing)}</span>`:''}
        <span class="chevron">▾</span>
      </div>
      <div class="section-body">${blocks}</div>
    </div>`;
}

function renderViewerBlock(b,gid,sid,si,bi){
  switch(b.type){
    case 'why':return`<div class="block why"><div class="block-label">Why It Matters</div><p>${fmt(b.content)}</p></div>`;
    case 'understand':return`<div class="block understand"><div class="block-label">Understand This</div><ul class="tip-list">${(b.content||[]).map(i=>`<li>${fmt(i)}</li>`).join('')}</ul></div>`;
    case 'demo':return`<div class="block demo"><div class="block-label">Show This</div>${b.note?`<div class="block-note">${escH(b.note)}</div>`:''}<ul class="tip-list">${(b.content||[]).map(i=>`<li>${fmt(i)}</li>`).join('')}</ul></div>`;
    case 'watch':return`<div class="block watch"><div class="block-label">Watch-Outs</div><ul class="tip-list">${(b.content||[]).map(i=>`<li>${fmt(i)}</li>`).join('')}</ul></div>`;
    case 'checklist':{
      const ck=checks[gid+'_'+sid]||{};
      const items=(b.content||[]).map((it,idx)=>{
        const chk=ck[idx]?'checked':'';
        return`<li class="check-item ${chk}" onclick="toggleCheck('${gid}','${sid}',${idx})"><div class="check-box">${chk?'✓':''}</div><span class="check-text">${escH(it)}</span></li>`;
      }).join('');
      return`<div class="block" style="padding-top:12px"><ul class="checklist">${items}</ul></div>`;
    }
    case 'callout':return`<div class="block"><div class="callout"><span>ℹ️</span><span>${fmt(b.content)}</span></div></div>`;
    case 'principles':{
      const items=(b.content||[]).map(i=>{const[icon,...rest]=i.split('|');return`<div class="principle"><span class="principle-icon">${escH(icon)}</span><span>${fmt(rest.join('|'))}</span></div>`;}).join('');
      return`<div class="block"><div class="block-label" style="color:var(--text-muted);margin-bottom:8px">Leave staff with these three things</div><div style="display:flex;flex-direction:column;gap:8px">${items}</div></div>`;
    }
    case 'preview-pills':return`<div style="border-top:1px solid var(--border)"><div class="preview-pills">${(b.content||[]).map(i=>`<div class="preview-pill">${escH(i)}</div>`).join('')}</div></div>`;
    case 'open-items':{
      const items=(b.content||[]).map(i=>`<div class="open-item-row"><span>⚠</span><span>${fmt(i)}</span></div>`).join('');
      return`<div style="padding:10px 16px 6px;font-size:12px;color:var(--text-muted);font-style:italic">These aren't blocking the session — but staff will encounter them and you need to be able to explain what's going on.</div>${items}`;
    }
    default:return`<div class="block"><p style="font-size:13px;color:var(--text)">${fmt(typeof b.content==='string'?b.content:(b.content||[]).join('\n'))}</p></div>`;
  }
}

function loadViewerChecks(){
  document.querySelectorAll('.check-item').forEach(el=>{
    const box=el.querySelector('.check-box');
    if(el.classList.contains('checked'))box.textContent='✓';
  });
}

function toggleCheck(gid,sid,idx){
  const key=gid+'_'+sid;
  if(!checks[key])checks[key]={};
  checks[key][idx]=!checks[key][idx];
  saveChecks(checks);
  // update DOM
  const items=document.querySelectorAll(`#vs_${sid} .check-item`);
  const item=items[idx];
  if(!item)return;
  item.classList.toggle('checked',checks[key][idx]);
  item.querySelector('.check-box').textContent=checks[key][idx]?'✓':'';
  // complete banner
  const firstSec=getGuide(gid)?.sections[0];
  if(firstSec){
    const ck=checks[gid+'_'+firstSec.id]||{};
    const total=(firstSec.blocks.find(b=>b.type==='checklist')?.content||[]).length;
    const done=Object.values(ck).filter(Boolean).length;
    const banner=document.getElementById('complete-banner');
    if(banner)banner.classList.toggle('show',total>0&&done>=total);
  }
}

// ── EDITOR ──
function renderEditor(g){
  if(!g)return'';
  const secs=g.sections.map((s,si)=>renderEditorSection(s,si,g.sections.length)).join('');
  return`
    <div class="top-bar">
      <div class="top-bar-row">
        <div style="display:flex;align-items:center;gap:10px">
          <button class="top-btn-icon" onclick="cancelEdit()">←</button>
          <div><div class="top-title">${g.id==='__new__'?'New Guide':'Edit Guide'}</div></div>
        </div>
      </div>
    </div>
    <div class="main" style="padding-bottom:90px">
      <div class="section-divider">Guide Info</div>
      <div class="editor-section">
        <div class="editor-section-header open" onclick="toggleEdSec(this)">
          <span class="editor-section-chevron">▾</span>
          <span class="editor-section-label">Metadata</span>
        </div>
        <div class="editor-section-body-wrap open" id="eds_meta">
          <div><label class="form-label">Platform</label><input id="e_platform" value="${escH(g.platform||'')}" placeholder="e.g. 4D Practice Management"></div>
          <div class="form-row">
            <div><label class="form-label">Guide Title</label><input id="e_title" value="${escH(g.title||'')}" placeholder="e.g. New Staff Onboarding"></div>
            <div><label class="form-label">Session Label</label><input id="e_session" value="${escH(g.sessionLabel||'')}" placeholder="e.g. Session 1"></div>
          </div>
          <div class="form-row">
            <div><label class="form-label">Duration</label><input id="e_duration" value="${escH(g.duration||'')}" placeholder="45–60 min"></div>
            <div><label class="form-label">Audience</label><input id="e_audience" value="${escH(g.audience||'')}" placeholder="Front-desk staff"></div>
          </div>
          <div><label class="form-label">What This Is (meta description)</label><textarea id="e_meta" rows="2">${escH(g.meta||'')}</textarea></div>
          <div><label class="form-label">Intent Note (italic quote)</label><input id="e_intent" value="${escH(g.intentNote||'')}" placeholder='"The goal isn\'t to..."'></div>
          <div><label class="form-label">Footer Text</label><input id="e_footer" value="${escH(g.footer||'')}" placeholder="ACG Practice Partners · Confidential"></div>
        </div>
      </div>

      <div class="section-divider">Sections</div>
      <div id="ed-sections">${secs}</div>
      <button class="add-section-btn" onclick="addSection()">+ Add Section</button>
    </div>
    <div class="save-bar">
      <button class="btn-cancel" onclick="cancelEdit()">Cancel</button>
      <button class="btn-save" onclick="saveGuide()">Save Guide</button>
    </div>`;
}

function renderEditorSection(s,si,total){
  const themeLabels=['Default','Green','Red'];
  const themeVals=['default','green','red'];
  const themeBtns=themeVals.map((v,i)=>{
    const active=s.theme===v?`active-${v}`:'';
    return`<button class="theme-btn ${active}" onclick="setTheme(${si},'${v}')" data-si="${si}" data-theme="${v}">${themeLabels[i]}</button>`;
  }).join('');
  const blocks=s.blocks.map((b,bi)=>renderEditorBlock(b,si,bi,s.blocks.length)).join('');
  const isOpen=openEditorSections.has(si);
  return`
    <div class="editor-section" data-si="${si}" id="eds_${si}">
      <div class="editor-section-header${isOpen?' open':''}" onclick="toggleEdSecIdx(${si})">
        <span class="editor-section-chevron">▾</span>
        <span class="editor-section-label">${escH(s.num?s.num+' · ':'')}${escH(s.title||'Untitled Section')}</span>
        <div class="reorder-btns" onclick="event.stopPropagation()">
          <button class="reorder-btn" onclick="moveSec(${si},-1)" ${si===0?'disabled':''}>↑</button>
          <button class="reorder-btn" onclick="moveSec(${si},1)" ${si===total-1?'disabled':''}>↓</button>
        </div>
      </div>
      <div class="editor-section-body-wrap${isOpen?' open':''}" id="eds_body_${si}">
        <div class="form-row">
          <div><label class="form-label">Section #</label><input class="sec-num" value="${escH(s.num||'')}" placeholder="01" style="width:100%"></div>
          <div style="flex:3"><label class="form-label">Title</label><input class="sec-title" value="${escH(s.title||'')}" placeholder="Section title"></div>
          <div><label class="form-label">Timing</label><input class="sec-timing" value="${escH(s.timing||'')}" placeholder="12 min" style="width:100%"></div>
        </div>
        <div><label class="form-label">Header Color</label><div class="theme-btns">${themeBtns}</div></div>
        <div class="section-divider" style="margin-top:4px">Blocks</div>
        <div class="block-list" id="blocks_${si}">${blocks}</div>
        <button class="add-block-btn" onclick="addBlock(${si})">+ Add Block</button>
        <button class="del-section-btn" onclick="deleteSection(${si})">Delete Section</button>
      </div>
    </div>`;
}

const BLOCK_TYPES=[
  {val:'why',label:'Why It Matters'},
  {val:'understand',label:'Understand This'},
  {val:'demo',label:'Show This'},
  {val:'watch',label:'Watch-Outs'},
  {val:'checklist',label:'Checklist'},
  {val:'callout',label:'Callout'},
  {val:'principles',label:'Principles'},
  {val:'preview-pills',label:'Preview Pills'},
  {val:'open-items',label:'Open Items'},
  {val:'text',label:'Plain Text'},
];

function renderEditorBlock(b,si,bi,total){
  const typeOpts=BLOCK_TYPES.map(t=>`<option value="${t.val}"${b.type===t.val?' selected':''}>${t.label}</option>`).join('');
  const isList=['understand','demo','watch','checklist','preview-pills','open-items','principles'].includes(b.type);
  const isWhy=b.type==='why'||b.type==='text'||b.type==='callout';
  const val=isList?(b.content||[]).join('\n'):b.content||'';
  const hint=b.type==='principles'?'Format: emoji|Text for each line':
    isList?'One item per line':'Enter text';
  return`
    <div class="block-editor" data-bi="${bi}">
      <div class="block-editor-header">
        <select class="block-type-sel" onchange="changeBlockType(${si},${bi},this.value)">${typeOpts}</select>
        <div style="display:flex;gap:4px;align-items:center">
          <button class="reorder-btn" onclick="moveBlock(${si},${bi},-1)" ${bi===0?'disabled':''}>↑</button>
          <button class="reorder-btn" onclick="moveBlock(${si},${bi},1)" ${bi===total-1?'disabled':''}>↓</button>
          <button class="block-del-btn" onclick="deleteBlock(${si},${bi})">✕</button>
        </div>
      </div>
      <div class="block-editor-body">
        <textarea class="block-content" rows="${isList?5:3}" placeholder="${hint}">${escH(val)}</textarea>
        ${b.type==='demo'?`<div class="block-note-field"><label class="form-label" style="margin-top:8px">Italicized note (optional)</label><input class="block-note-val" value="${escH(b.note||'')}" placeholder="e.g. Adapt the order — if staff are curious, follow their interest."></div>`:''}
        <div class="block-hint">${hint}</div>
      </div>
    </div>`;
}

// ─── EVENTS ───────────────────────────────────────────────────────────────────
function bindEvents(){
  if(mode==='view'){
    const anchorIds=editDraft?[]:getGuide(activeId)?.sections.map(s=>'vs_'+s.id)||[];
    window.addEventListener('scroll',()=>{
      let active=0;
      anchorIds.forEach((id,i)=>{
        const el=document.getElementById(id);
        if(el&&el.getBoundingClientRect().top<130)active=i;
      });
      document.querySelectorAll('#viewer-pills .pill').forEach((p,i)=>{
        p.classList.remove('active','done');
        if(i===active)p.classList.add('active');
        else if(i<active)p.classList.add('done');
      });
    },{passive:true});
  }
}

// ─── ACTIONS ─────────────────────────────────────────────────────────────────
function openGuide(id){activeId=id;mode='view';fgRender();}
function goLibrary(){mode='library';activeId=null;fgRender();}
function jumpTo(id){const el=document.getElementById(id);if(el)el.scrollIntoView({behavior:'smooth',block:'start'});}

function newGuide(){
  editDraft={id:'__new__',platform:'',title:'',sessionLabel:'',duration:'',audience:'',meta:'',intentNote:'',footer:'ACG Practice Partners · Confidential · Internal trainer use only',sections:[],createdAt:Date.now(),updatedAt:Date.now()};
  openEditorSections=new Set();
  mode='edit';fgRender();
}

function startEdit(id){
  editDraft=JSON.parse(JSON.stringify(getGuide(id)));
  openEditorSections=new Set();
  mode='edit';fgRender();
}

function cancelEdit(){
  if(editDraft&&editDraft.id==='__new__'){mode='library';}
  else{mode=activeId?'view':'library';}
  editDraft=null;fgRender();
}

function deleteGuide(id){
  if(!confirm('Delete this guide? This cannot be undone.'))return;
  guides=guides.filter(g=>g.id!==id);
  saveGuides(guides);
  if(activeId===id){activeId=null;mode='library';}

}

function collectEditorState(){
  // Collect metadata
  editDraft.platform=document.getElementById('e_platform')?.value||'';
  editDraft.title=document.getElementById('e_title')?.value||'';
  editDraft.sessionLabel=document.getElementById('e_session')?.value||'';
  editDraft.duration=document.getElementById('e_duration')?.value||'';
  editDraft.audience=document.getElementById('e_audience')?.value||'';
  editDraft.meta=document.getElementById('e_meta')?.value||'';
  editDraft.intentNote=document.getElementById('e_intent')?.value||'';
  editDraft.footer=document.getElementById('e_footer')?.value||'';
  // Collect sections
  document.querySelectorAll('#ed-sections .editor-section').forEach((sEl,si)=>{
    const s=editDraft.sections[si];
    if(!s)return;
    s.num=sEl.querySelector('.sec-num')?.value||'';
    s.title=sEl.querySelector('.sec-title')?.value||'';
    s.timing=sEl.querySelector('.sec-timing')?.value||'';
    // Collect blocks
    sEl.querySelectorAll('.block-editor').forEach((bEl,bi)=>{
      const b=s.blocks[bi];
      if(!b)return;
      const raw=bEl.querySelector('.block-content')?.value||'';
      const isList=['understand','demo','watch','checklist','preview-pills','open-items','principles'].includes(b.type);
      b.content=isList?raw.split('\n').filter(l=>l.trim()):raw;
      if(b.type==='demo')b.note=bEl.querySelector('.block-note-val')?.value||'';
    });
  });
}

function saveGuide(){
  collectEditorState();
  editDraft.updatedAt=Date.now();
  if(editDraft.id==='__new__'){
    editDraft.id='fg_'+Date.now();
    guides.push(editDraft);
    activeId=editDraft.id;
  } else {
    const idx=guides.findIndex(g=>g.id===editDraft.id);
    if(idx>=0)guides[idx]=editDraft;
    activeId=editDraft.id;
  }
  saveGuides(guides);
  editDraft=null;
  mode='view';

}

function toggleEdSec(header){
  header.classList.toggle('open');
  const body=header.nextElementSibling;
  if(body)body.classList.toggle('open');
}

function toggleEdSecIdx(si){
  if(openEditorSections.has(si))openEditorSections.delete(si);
  else openEditorSections.add(si);
  const header=document.querySelector(`#eds_${si} .editor-section-header`);
  const body=document.getElementById(`eds_body_${si}`);
  if(header)header.classList.toggle('open',openEditorSections.has(si));
  if(body)body.classList.toggle('open',openEditorSections.has(si));
}

function setTheme(si,theme){
  collectEditorState();
  editDraft.sections[si].theme=theme;
  const body=document.getElementById(`eds_body_${si}`);
  if(body){
    body.querySelectorAll('.theme-btn').forEach(btn=>{
      const t=btn.dataset.theme;
      btn.className='theme-btn'+(editDraft.sections[si].theme===t?` active-${t}`:'');
    });
  }
}

function moveSec(si,dir){
  collectEditorState();
  const secs=editDraft.sections;
  const ni=si+dir;
  if(ni<0||ni>=secs.length)return;
  [secs[si],secs[ni]]=[secs[ni],secs[si]];
  if(openEditorSections.has(si)){openEditorSections.delete(si);openEditorSections.add(ni);}
  else if(openEditorSections.has(ni)){openEditorSections.delete(ni);openEditorSections.add(si);}

}

function deleteSection(si){
  collectEditorState();
  if(!confirm('Remove this section?'))return;
  editDraft.sections.splice(si,1);
  openEditorSections.delete(si);

}

function addSection(){
  collectEditorState();
  const si=editDraft.sections.length;
  editDraft.sections.push({id:uid(),num:'',title:'New Section',timing:'',theme:'default',blocks:[{id:uid(),type:'why',content:''}]});
  openEditorSections.add(si);

  setTimeout(()=>document.getElementById(`eds_${si}`)?.scrollIntoView({behavior:'smooth',block:'start'}),50);
}

function addBlock(si){
  collectEditorState();
  editDraft.sections[si].blocks.push({id:uid(),type:'understand',content:[]});
  openEditorSections.add(si);

  setTimeout(()=>{
    const blocks=document.querySelectorAll(`#blocks_${si} .block-editor`);
    blocks[blocks.length-1]?.scrollIntoView({behavior:'smooth',block:'nearest'});
  },50);
}

function deleteBlock(si,bi){
  collectEditorState();
  editDraft.sections[si].blocks.splice(bi,1);
  openEditorSections.add(si);

}

function moveBlock(si,bi,dir){
  collectEditorState();
  const blocks=editDraft.sections[si].blocks;
  const ni=bi+dir;
  if(ni<0||ni>=blocks.length)return;
  [blocks[bi],blocks[ni]]=[blocks[ni],blocks[bi]];
  openEditorSections.add(si);

}

function changeBlockType(si,bi,newType){
  collectEditorState();
  const b=editDraft.sections[si].blocks[bi];
  const wasListType=['understand','demo','watch','checklist','preview-pills','open-items','principles'].includes(b.type);
  const isListType=['understand','demo','watch','checklist','preview-pills','open-items','principles'].includes(newType);
  if(wasListType&&!isListType&&Array.isArray(b.content))b.content=b.content.join('\n');
  if(!wasListType&&isListType&&typeof b.content==='string')b.content=b.content?b.content.split('\n').filter(l=>l.trim()):[];
  b.type=newType;
  openEditorSections.add(si);

}

// ─── TRANSCRIPT IMPORT ────────────────────────────────────────────────────────
function openTranscript(){mode='transcript';fgRender();}

function renderTranscript(){
  return`
    <div class="top-bar">
      <div class="top-bar-row">
        <div style="display:flex;align-items:center;gap:10px">
          <button class="top-btn-icon" onclick="goLibrary()">←</button>
          <div><div class="top-title">Create from Transcript</div><div class="top-sub">Paste a Zoom, Otter, or notes transcript</div></div>
        </div>
      </div>
    </div>
    <div class="main" style="padding-bottom:90px">
      <div class="tx-help-card">
        <div class="tx-help-title">How this works</div>
        <div class="tx-help-grid">
          <div class="tx-help-row"><span>1</span><span>Fill in the guide basics and enter your name so we can filter to your voice</span></div>
          <div class="tx-help-row"><span>2</span><span>Paste your raw Zoom, Otter, or Rev transcript — timestamps and filler words are stripped automatically</span></div>
          <div class="tx-help-row"><span>3</span><span>Hit <strong>Parse Transcript</strong> — sections and block types are detected from your words</span></div>
          <div class="tx-help-row"><span>4</span><span>Review and edit the result before saving</span></div>
        </div>
        <div class="tx-tip">💡 Tip: The parser keeps only your lines (the trainer's). The client's "got it", "okay", and questions are stripped. Section breaks are detected from topic shifts, numbered headers, or clear transitions like "so now let's talk about…"</div>
      </div>

      <div class="editor-section">
        <div class="editor-section-header open" onclick="toggleEdSec(this)">
          <span class="editor-section-chevron">▾</span>
          <span class="editor-section-label">Guide Info</span>
        </div>
        <div class="editor-section-body-wrap open">
          <div><label class="form-label">Platform</label><input id="tx_platform" placeholder="e.g. 4D Practice Management"></div>
          <div class="form-row">
            <div><label class="form-label">Guide Title</label><input id="tx_title" placeholder="e.g. New Staff Onboarding"></div>
            <div><label class="form-label">Session Label</label><input id="tx_session" placeholder="Session 1"></div>
          </div>
          <div class="form-row">
            <div><label class="form-label">Duration</label><input id="tx_duration" placeholder="45–60 min"></div>
            <div><label class="form-label">Audience</label><input id="tx_audience" placeholder="Front-desk staff"></div>
          </div>
          <div><label class="form-label">Your name in the transcript <span style="font-weight:400;color:var(--text-muted)">(optional — used to filter to trainer speech only)</span></label><input id="tx_trainer" placeholder="e.g. Anna"></div>
        </div>
      </div>

      <div class="editor-section">
        <div class="editor-section-header open" onclick="toggleEdSec(this)">
          <span class="editor-section-chevron">▾</span>
          <span class="editor-section-label">Transcript</span>
        </div>
        <div class="editor-section-body-wrap open">
          <div class="tx-format-row">
            <span class="form-label" style="margin-bottom:0;white-space:nowrap">Transcript format:</span>
            <label class="tx-radio"><input type="radio" name="tx_fmt" value="auto" checked> Auto-detect</label>
            <label class="tx-radio"><input type="radio" name="tx_fmt" value="zoom"> Zoom</label>
            <label class="tx-radio"><input type="radio" name="tx_fmt" value="otter"> Otter / Rev</label>
            <label class="tx-radio"><input type="radio" name="tx_fmt" value="notes"> Plain notes</label>
          </div>
          <textarea id="tx_body" rows="18" placeholder="Paste your transcript here...

── Zoom format example ──
00:00:05 Anna: Okay so today we're going to cover scheduling, which is really the heart of 4D.
00:00:12 Anna: The schedule drives almost every other workflow in the system.
00:00:20 Client: Okay got it.
00:00:22 Anna: So let's start by looking at the Day View...

── Otter / Rev format example ──
Anna
0:05
Okay so today we're going to cover scheduling.

Client
0:12
Got it.

Anna
0:14
The schedule drives almost every other workflow..."></textarea>
        </div>
      </div>
    </div>
    <div class="save-bar">
      <button class="btn-cancel" onclick="goLibrary()">Cancel</button>
      <button class="btn-save" onclick="runParseTranscript()">Parse Transcript →</button>
    </div>`;
}

function runParseTranscript(){
  const meta={
    platform:document.getElementById('tx_platform')?.value||'',
    title:document.getElementById('tx_title')?.value||'Untitled Guide',
    sessionLabel:document.getElementById('tx_session')?.value||'',
    duration:document.getElementById('tx_duration')?.value||'',
    audience:document.getElementById('tx_audience')?.value||'',
    trainer:(document.getElementById('tx_trainer')?.value||'').trim(),
  };
  const rawBody=document.getElementById('tx_body')?.value||'';
  if(!rawBody.trim()){alert('Please paste a transcript first.');return;}
  const fmt=document.querySelector('input[name="tx_fmt"]:checked')?.value||'auto';
  const cleaned=preprocessTranscript(rawBody,fmt,meta.trainer);
  editDraft=parseTranscript(cleaned,meta);
  openEditorSections=new Set(editDraft.sections.map((_,i)=>i));
  mode='edit';

}

// Strip transcript formatting and filter to trainer speech
function preprocessTranscript(raw,fmt,trainerName){
  const lines=raw.split('\n');
  let detected=fmt;

  // Auto-detect format
  if(fmt==='auto'){
    const sample=lines.slice(0,30).join('\n');
    if(/^\d{1,2}:\d{2}:\d{2}\s+\w/.test(sample)||/^\d{2}:\d{2}:\d{2}\.\d{3}\s*-->/m.test(sample))detected='zoom';
    else if(/^[A-Z][a-zA-Z ]+\n\d+:\d+$/m.test(sample)||/^[A-Z][a-zA-Z ]+\n\d+:\d+\n/m.test(sample))detected='otter';
    else detected='notes';
  }

  if(detected==='zoom') return preprocessZoom(lines,trainerName);
  if(detected==='otter') return preprocessOtter(lines,trainerName);
  // Plain notes: just strip timestamps and filler
  return stripFiller(lines.join('\n'));
}

function preprocessZoom(lines,trainerName){
  // Zoom format: "HH:MM:SS Name: text" or "HH:MM:SS.mmm --> HH:MM:SS.mmm\nSpeaker\ntext"
  const out=[];
  const trainerRx=trainerName?new RegExp('\\b'+trainerName.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\b','i'):null;

  for(let i=0;i<lines.length;i++){
    const line=lines[i];
    // VTT/SRT timestamp lines — skip
    if(/^\d{2}:\d{2}:\d{2}[,\.]\d{3}\s*-->\s*\d/.test(line)){i+=2;continue;}
    if(/^\d+$/.test(line.trim()))continue; // SRT sequence numbers

    // "HH:MM:SS Speaker: text" or "HH:MM:SS.mmm Speaker: text"
    const m=line.match(/^\d{1,2}:\d{2}(?::\d{2})?(?:\.\d+)?\s+(.+?):\s*(.*)/);
    if(m){
      const speaker=m[1].trim();
      const text=m[2].trim();
      if(!trainerRx||trainerRx.test(speaker)){
        if(text)out.push(text);
      }
      continue;
    }
    // Bare timestamp line with no speaker — keep if it's content (no trainer filter)
    if(/^\d{1,2}:\d{2}/.test(line)&&!trainerRx){
      const stripped=line.replace(/^\d{1,2}:\d{2}(?::\d{2})?\s*/,'').trim();
      if(stripped)out.push(stripped);
      continue;
    }
  }
  return stripFiller(out.join('\n'));
}

function preprocessOtter(lines,trainerName){
  // Otter/Rev: speaker name alone on a line, then timestamp alone, then text blocks
  const out=[];
  const trainerRx=trainerName?new RegExp('\\b'+trainerName.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\b','i'):null;
  let curSpeakerIsTrainer=!trainerRx; // if no trainer given, keep all
  let i=0;
  while(i<lines.length){
    const line=lines[i].trim();
    // Timestamp-only line (e.g. "0:05" or "00:01:23")
    if(/^\d{1,2}:\d{2}(?::\d{2})?$/.test(line)){i++;continue;}
    // Speaker line: non-empty, no punctuation mid-line, preceded/followed by timestamp
    const nextIsTimestamp=i+1<lines.length&&/^\d{1,2}:\d{2}/.test(lines[i+1].trim());
    if(line&&nextIsTimestamp&&line.length<60&&!/[.!?,]/.test(line)){
      curSpeakerIsTrainer=!trainerRx||trainerRx.test(line);
      i++;continue;
    }
    // Content line
    if(line&&curSpeakerIsTrainer)out.push(line);
    i++;
  }
  return stripFiller(out.join('\n'));
}

function stripFiller(text){
  // Remove filler words and clean up
  return text
    .replace(/\b(um+|uh+|hmm+|mhm+|uh-huh)\b[,]?\s*/gi,' ')
    .replace(/\b(you know what I mean|right\?|okay\?|yeah\?)\b/gi,'')
    .replace(/\b(so basically|basically|honestly|literally|like I said)\b\s*/gi,'')
    // Collapse extra spaces/blank lines
    .replace(/[ \t]{2,}/g,' ')
    .replace(/\n{3,}/g,'\n\n')
    .trim();
}

function parseTranscript(text,meta){
  const lines=text.split('\n');
  const sections=[];
  let curSec=null;
  let pendingLines=[];

  // Patterns that signal a new section header
  const isSectionHeader=line=>{
    const t=line.trim();
    if(!t)return false;
    // "01 — Title" or "1. Title" or "1: Title" or "Section 1:"
    if(/^\d{1,2}\s*[—–\-\.:\)]\s*\S/.test(t))return true;
    // All-caps line (min 4 chars, not a bullet)
    if(t===t.toUpperCase()&&t.length>=4&&!/^[\-\*\•]/.test(t)&&/[A-Z]{3}/.test(t))return true;
    // "SECTION: …" or "## …" or "### …"
    if(/^(section|module|part|step)\s*\d*\s*[:\-—]/i.test(t))return true;
    if(/^#{1,3}\s/.test(t))return true;
    return false;
  };

  // Flush pending lines into curSec as blocks
  function flushPending(){
    if(!curSec||!pendingLines.length)return;
    const blockGroups=groupIntoBlocks(pendingLines);
    blockGroups.forEach(b=>curSec.blocks.push(b));
    pendingLines=[];
  }

  // Parse section header → {num, title}
  function parseHeader(line){
    const t=line.trim().replace(/^#+\s*/,'');
    // "01 — Title" or "1. Title"
    const m=t.match(/^(\d{1,2})\s*[—–\-\.:\)]\s*(.+)/);
    if(m)return{num:m[1].padStart(2,'0'),title:m[2].trim()};
    // "Section 2: Title"
    const m2=t.match(/^(?:section|module|part|step)\s*(\d*)\s*[:\-—]\s*(.+)/i);
    if(m2)return{num:m2[1]?m2[1].padStart(2,'0'):'',title:m2[2].trim()};
    // All-caps or markdown header: use as title
    return{num:'',title:t.replace(/\*+/g,'').trim()};
  }

  lines.forEach(rawLine=>{
    const line=rawLine.trimEnd();
    if(isSectionHeader(line)){
      flushPending();
      if(curSec)sections.push(curSec);
      const h=parseHeader(line);
      curSec={id:uid(),num:h.num,title:h.title,timing:'',theme:'default',blocks:[]};
    } else {
      pendingLines.push(line);
    }
  });
  flushPending();
  if(curSec)sections.push(curSec);

  // If nothing parsed as sections, treat whole text as one section
  if(!sections.length){
    const fallbackSec={id:uid(),num:'01',title:meta.title||'Session Notes',timing:'',theme:'default',blocks:[]};
    groupIntoBlocks(lines).forEach(b=>fallbackSec.blocks.push(b));
    sections.push(fallbackSec);
  }

  return{
    id:'__new__',
    platform:meta.platform,
    title:meta.title,
    sessionLabel:meta.sessionLabel,
    duration:meta.duration,
    audience:meta.audience,
    meta:'',intentNote:'',
    footer:'ACG Practice Partners · Confidential · Internal trainer use only',
    sections,
    createdAt:Date.now(),updatedAt:Date.now()
  };
}

function groupIntoBlocks(lines){
  const blocks=[];
  let i=0;
  while(i<lines.length){
    const line=lines[i];
    const t=line.trim();
    if(!t){i++;continue;}

    // Detect block type from keywords
    const lower=t.toLowerCase();
    const isBullet=/^[\-\*\•\d\.]\s/.test(t)||/^[a-z]\)\s/i.test(t);

    // Watch-out signals
    if(/\b(watch.out|watch for|be careful|common mistake|don'?t |avoid|warning|pitfall|gotcha)\b/i.test(t)){
      // Collect this line and any following bullets
      const content=[t.replace(/^(watch.?outs?|warning|be careful)[:\s]*/i,'').trim()].filter(Boolean);
      i++;
      while(i<lines.length&&/^[\-\*\•]/.test(lines[i].trim())){
        content.push(lines[i].trim().replace(/^[\-\*\•]\s*/,''));i++;
      }
      if(content.length)blocks.push({id:uid(),type:'watch',content});
      continue;
    }

    // Why/context signals
    if(/^(why|because|context|the reason|this matters|important because)/i.test(t)){
      const txt=t.replace(/^(why\s*(this\s*matters|it\s*matters)?|context|because)[:\s]*/i,'').trim();
      const more=[];
      i++;
      while(i<lines.length&&lines[i].trim()&&!/^[\-\*\•]/.test(lines[i].trim())&&!isSectionHeaderQuick(lines[i])){
        more.push(lines[i].trim());i++;
      }
      const full=[txt,...more].filter(Boolean).join(' ');
      if(full)blocks.push({id:uid(),type:'why',content:full});
      continue;
    }

    // Demo/show signals
    if(/^(show\s*(them|this|staff)|demo|navigate to|click|demonstrate|walk\s*them)/i.test(t)){
      const note=t.replace(/^(show\s*(them|this|staff)?|demo|navigate to|demonstrate|walk\s*them\s*(through)?)[:\s]*/i,'').trim();
      const items=[];
      i++;
      while(i<lines.length&&lines[i].trim()&&/^[\-\*\•\d]/.test(lines[i].trim())){
        items.push(lines[i].trim().replace(/^[\-\*\•]\s*\d*\.?\s*/,''));i++;
      }
      const b={id:uid(),type:'demo',content:items.length?items:[note].filter(Boolean)};
      if(note&&items.length)b.note=note;
      blocks.push(b);
      continue;
    }

    // Checklist signals
    if(/^(pre.?session|before\s*(you\s*)?(start|begin|train)|checklist|prep)/i.test(t)){
      const items=[];
      i++;
      while(i<lines.length&&lines[i].trim()&&/^[\-\*\•\☐\☑]/.test(lines[i].trim())){
        items.push(lines[i].trim().replace(/^[\-\*\•\☐\☑]\s*/,''));i++;
      }
      if(items.length){blocks.push({id:uid(),type:'checklist',content:items});continue;}
    }

    // Callout / note
    if(/^(note|tip|fyi|heads up|reminder)[:\s]/i.test(t)){
      const txt=t.replace(/^(note|tip|fyi|heads up|reminder)[:\s]*/i,'').trim();
      if(txt){blocks.push({id:uid(),type:'callout',content:txt});i++;continue;}
    }

    // Bullet list → understand block
    if(isBullet){
      const items=[t.replace(/^[\-\*\•]\s*\d*\.?\s*/,'')];
      i++;
      while(i<lines.length&&/^[\-\*\•\d\.]/.test(lines[i].trim())&&lines[i].trim()){
        items.push(lines[i].trim().replace(/^[\-\*\•]\s*\d*\.?\s*/,''));i++;
      }
      blocks.push({id:uid(),type:'understand',content:items.filter(Boolean)});
      continue;
    }

    // Default: collect consecutive plain lines → text block
    const textLines=[t];
    i++;
    while(i<lines.length){
      const next=lines[i].trim();
      if(!next){i++;break;}
      if(isSectionHeaderQuick(lines[i])||/^[\-\*\•]/.test(next))break;
      if(/\b(watch.out|show\s*(them|this)|why\s*(this\s*)?matters|note:|tip:)\b/i.test(next))break;
      textLines.push(next);i++;
    }
    const joined=textLines.filter(Boolean).join(' ');
    if(joined)blocks.push({id:uid(),type:'text',content:joined});
  }
  return blocks;
}

// Quick check used inside groupIntoBlocks (no closure over outer isSectionHeader)
function isSectionHeaderQuick(line){
  const t=line.trim();
  if(!t)return false;
  if(/^\d{1,2}\s*[—–\-\.:\)]\s*\S/.test(t))return true;
  if(t===t.toUpperCase()&&t.length>=4&&!/^[\-\*\•]/.test(t)&&/[A-Z]{3}/.test(t))return true;
  if(/^(section|module|part|step)\s*\d*\s*[:\-—]/i.test(t))return true;
  if(/^#{1,3}\s/.test(t))return true;
  return false;
}

// ─── MERGE FLOW ───────────────────────────────────────────────────────────────
function openMergeFlow(id){
  mergeState={targetId:id,newGuide:null,decisions:[]};
  mode='merge-tx';fgRender();
}

function cancelMerge(){
  const id=mergeState?.targetId;
  mergeState=null;
  if(id){activeId=id;mode='view';}else mode='library';

}

function renderMergeTranscript(){
  const g=getGuide(mergeState.targetId);
  return`
    <div class="top-bar">
      <div class="top-bar-row">
        <div style="display:flex;align-items:center;gap:10px">
          <button class="top-btn-icon" onclick="cancelMerge()">←</button>
          <div><div class="top-title">Update from Transcript</div>
          <div class="top-sub">${escH(g?.title||'')}</div></div>
        </div>
      </div>
    </div>
    <div class="main" style="padding-bottom:90px">
      <div class="tx-help-card">
        <div class="tx-help-title">Updating: ${escH(g?.title||'this guide')}</div>
        <div class="tx-help-grid">
          <div class="tx-help-row"><span>1</span><span>Paste the new session recording or transcript</span></div>
          <div class="tx-help-row"><span>2</span><span>We parse it and compare against the current ${g?.sections?.length||0} sections</span></div>
          <div class="tx-help-row"><span>3</span><span>Side-by-side review — you choose what to keep, replace, or merge</span></div>
        </div>
      </div>
      <div class="editor-section">
        <div class="editor-section-header open" onclick="toggleEdSec(this)">
          <span class="editor-section-chevron">▾</span>
          <span class="editor-section-label">Transcript Settings</span>
        </div>
        <div class="editor-section-body-wrap open">
          <div><label class="form-label">Your name in the transcript <span style="font-weight:400;color:var(--text-muted)">(optional — filters to trainer speech only)</span></label>
          <input id="mx_trainer" placeholder="e.g. Anna"></div>
          <div class="tx-format-row">
            <span class="form-label" style="margin-bottom:0;white-space:nowrap">Format:</span>
            <label class="tx-radio"><input type="radio" name="mx_fmt" value="auto" checked> Auto-detect</label>
            <label class="tx-radio"><input type="radio" name="mx_fmt" value="zoom"> Zoom</label>
            <label class="tx-radio"><input type="radio" name="mx_fmt" value="otter"> Otter / Rev</label>
            <label class="tx-radio"><input type="radio" name="mx_fmt" value="notes"> Plain notes</label>
          </div>
        </div>
      </div>
      <div class="editor-section">
        <div class="editor-section-header open" onclick="toggleEdSec(this)">
          <span class="editor-section-chevron">▾</span>
          <span class="editor-section-label">Transcript</span>
        </div>
        <div class="editor-section-body-wrap open">
          <textarea id="mx_body" rows="16" placeholder="Paste your session transcript here..."></textarea>
        </div>
      </div>
    </div>
    <div class="save-bar">
      <button class="btn-cancel" onclick="cancelMerge()">Cancel</button>
      <button class="btn-save" onclick="runMergeParse()">Compare Sections →</button>
    </div>`;
}

function runMergeParse(){
  const rawBody=document.getElementById('mx_body')?.value||'';
  if(!rawBody.trim()){alert('Please paste a transcript first.');return;}
  const trainer=document.getElementById('mx_trainer')?.value||'';
  const fmt=document.querySelector('input[name="mx_fmt"]:checked')?.value||'auto';
  const cleaned=preprocessTranscript(rawBody,fmt,trainer);
  const existing=getGuide(mergeState.targetId);
  const meta={platform:existing.platform,title:existing.title,sessionLabel:existing.sessionLabel,
    duration:existing.duration,audience:existing.audience,trainer};
  const newGuide=parseTranscript(cleaned,meta);
  mergeState.newGuide=newGuide;
  mergeState.decisions=matchSections(existing.sections,newGuide.sections);
  mode='merge';fgRender();
}

function matchSections(existingSecs,newSecs){
  function norm(t){return(t||'').toLowerCase().replace(/[^a-z0-9\s]/g,'').replace(/^\d+\s*/,'').trim();}
  function similarity(a,b){
    const wa=new Set(norm(a).split(/\s+/).filter(Boolean));
    const wb=new Set(norm(b).split(/\s+/).filter(Boolean));
    if(!wa.size&&!wb.size)return 1;
    if(!wa.size||!wb.size)return 0;
    let common=0;
    wa.forEach(w=>{if(wb.has(w))common++;});
    return common/Math.max(wa.size,wb.size);
  }
  const decisions=[];
  const usedNew=new Set();
  existingSecs.forEach((es,ei)=>{
    let bestScore=0.25,bestNi=-1;
    newSecs.forEach((ns,ni)=>{
      if(usedNew.has(ni))return;
      const score=similarity(es.title,ns.title);
      if(score>bestScore){bestScore=score;bestNi=ni;}
    });
    if(bestNi>=0){
      usedNew.add(bestNi);
      decisions.push({type:'match',existingIdx:ei,newIdx:bestNi,action:'keep'});
    } else {
      decisions.push({type:'existing-only',existingIdx:ei,action:'keep'});
    }
  });
  newSecs.forEach((ns,ni)=>{
    if(!usedNew.has(ni))decisions.push({type:'new-only',newIdx:ni,action:'add'});
  });
  return decisions;
}

function renderMerge(){
  const existing=getGuide(mergeState.targetId);
  const newG=mergeState.newGuide;
  const matchCount=mergeState.decisions.filter(d=>d.type==='match').length;
  const newCount=mergeState.decisions.filter(d=>d.type==='new-only').length;
  const rows=mergeState.decisions.map((d,di)=>renderMergeRow(d,di,existing,newG)).join('');
  return`
    <div class="top-bar">
      <div class="top-bar-row">
        <div style="display:flex;align-items:center;gap:10px">
          <button class="top-btn-icon" onclick="mode='merge-tx';fgRender()">←</button>
          <div><div class="top-title">Review Changes</div>
          <div class="top-sub">${escH(existing?.title||'')} · ${matchCount} matched · ${newCount} new</div></div>
        </div>
      </div>
    </div>
    <div class="main" style="gap:8px;padding-bottom:90px">
      <div class="merge-legend">
        <span class="merge-badge keep-badge">Keep</span> current wins &nbsp;·&nbsp;
        <span class="merge-badge replace-badge">Replace</span> transcript wins &nbsp;·&nbsp;
        <span class="merge-badge combine-badge">Merge</span> both kept
      </div>
      <div class="merge-col-labels"><span>Current guide</span><span>New transcript</span></div>
      ${rows}
    </div>
    <div class="save-bar">
      <button class="btn-cancel" onclick="cancelMerge()">Cancel</button>
      <button class="btn-save" onclick="applyMerge()">Apply & Edit →</button>
    </div>`;
}

function secPreview(s,side){
  if(!s)return`<div class="merge-sec-card empty"><span class="merge-empty-label">${side==='incoming'?'New section':'Not in transcript'}</span></div>`;
  const firstBlock=s.blocks[0];
  let preview='';
  if(firstBlock){
    preview=Array.isArray(firstBlock.content)?firstBlock.content.slice(0,2).join(' · '):firstBlock.content||'';
    preview=preview.slice(0,120);
  }
  return`<div class="merge-sec-card ${side}">
    <div class="merge-sec-title">${escH(s.num?s.num+' · ':'')}${escH(s.title)}</div>
    <div class="merge-sec-meta">${s.blocks.length} block${s.blocks.length!==1?'s':''} · ${escH(s.timing||'—')}</div>
    ${preview?`<div class="merge-sec-preview">${escH(preview)}</div>`:''}
  </div>`;
}

function renderMergeRow(d,di,existing,newG){
  const es=d.existingIdx!==undefined?existing.sections[d.existingIdx]:null;
  const ns=d.newIdx!==undefined?newG.sections[d.newIdx]:null;
  const decidedClass='decided-'+(d.action==='combine'?'combine':d.action);

  if(d.type==='match'){
    const btns=[
      {val:'keep',label:'Keep',cls:'keep'},
      {val:'replace',label:'Replace',cls:'replace'},
      {val:'combine',label:'Merge both',cls:'combine'},
    ].map(b=>`<button class="merge-action-btn ${b.cls}${d.action===b.val?' active':''}" onclick="setMergeAction(${di},'${b.val}')">${b.label}</button>`).join('');
    return`<div class="merge-row ${decidedClass}" id="mrow_${di}">
      <div class="merge-cols">${secPreview(es,'existing')}${secPreview(ns,'incoming')}</div>
      <div class="merge-actions">${btns}<span class="merge-decision-label">${d.action==='keep'?'✓ Keeping current':d.action==='replace'?'↑ Using transcript':'⊕ Combining both'}</span></div>
    </div>`;
  }
  if(d.type==='existing-only'){
    return`<div class="merge-row ${decidedClass}" id="mrow_${di}">
      <div class="merge-cols">${secPreview(es,'existing')}<div class="merge-sec-card empty"><span class="merge-empty-label">Not in transcript</span></div></div>
      <div class="merge-actions">
        <button class="merge-action-btn keep${d.action==='keep'?' active':''}" onclick="setMergeAction(${di},'keep')">Keep</button>
        <button class="merge-action-btn remove${d.action==='remove'?' active':''}" onclick="setMergeAction(${di},'remove')">Remove</button>
        <span class="merge-decision-label">${d.action==='keep'?'✓ Keeping':'✕ Removing'}</span>
      </div>
    </div>`;
  }
  if(d.type==='new-only'){
    return`<div class="merge-row ${decidedClass}" id="mrow_${di}">
      <div class="merge-cols"><div class="merge-sec-card empty"><span class="merge-empty-label">Not in current guide</span></div>${secPreview(ns,'incoming')}</div>
      <div class="merge-actions">
        <button class="merge-action-btn add${d.action==='add'?' active':''}" onclick="setMergeAction(${di},'add')">Add</button>
        <button class="merge-action-btn discard${d.action==='discard'?' active':''}" onclick="setMergeAction(${di},'discard')">Discard</button>
        <span class="merge-decision-label">${d.action==='add'?'⊕ Adding':'✕ Discarding'}</span>
      </div>
    </div>`;
  }
  return'';
}

function setMergeAction(di,action){
  mergeState.decisions[di].action=action;
  const existing=getGuide(mergeState.targetId);
  const row=document.getElementById('mrow_'+di);
  if(row)row.outerHTML=renderMergeRow(mergeState.decisions[di],di,existing,mergeState.newGuide);
}

function applyMerge(){
  const existing=JSON.parse(JSON.stringify(getGuide(mergeState.targetId)));
  const newG=mergeState.newGuide;
  const resultSecs=[];
  mergeState.decisions.forEach(d=>{
    const es=d.existingIdx!==undefined?existing.sections[d.existingIdx]:null;
    const ns=d.newIdx!==undefined?newG.sections[d.newIdx]:null;
    if(d.type==='match'){
      if(d.action==='keep')resultSecs.push(es);
      else if(d.action==='replace')resultSecs.push(ns);
      else if(d.action==='combine'){
        const merged=JSON.parse(JSON.stringify(es));
        (ns.blocks||[]).forEach(nb=>merged.blocks.push({...nb,id:uid()}));
        resultSecs.push(merged);
      }
    } else if(d.type==='existing-only'){
      if(d.action==='keep')resultSecs.push(es);
    } else if(d.type==='new-only'){
      if(d.action==='add')resultSecs.push(ns);
    }
  });
  existing.sections=resultSecs;
  existing.updatedAt=Date.now();
  editDraft=existing;
  openEditorSections=new Set(editDraft.sections.map((_,i)=>i));
  mergeState=null;
  mode='edit';

}

// ─── INIT ─────────────────────────────────────────────────────────────────────
function rFieldGuides(body){ body.innerHTML='<div id="fg-app"></div>'; fgRender(); }
