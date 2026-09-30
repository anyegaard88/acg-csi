// ── STORAGE ──────────────────────────────────────────────────
var SK="acg_csi_v3";
// AZURE FUNCTION URL — hardcoded for auto-connect
var AZURE_API_URL="https://acgcsiapi-cubfbfgcgwe3bvhp.eastus2-01.azurewebsites.net/api/sync";
var SHEET_URL=AZURE_API_URL; // keeping SHEET_URL as alias for backward compat

function load(key,def){try{var v=localStorage.getItem(key);return v?JSON.parse(v):def;}catch(e){return def;}}
function uid(){return Math.random().toString(36).substring(2,10)+Date.now().toString(36);}
function save(key,val){try{localStorage.setItem(key,JSON.stringify(val));}catch(e){}}

var cust=load(SK+"_cust",[]);
var overrides=load(SK+"_overrides",{});
var changelog=load(SK+"_changelog",[]);
var favorites=load(SK+"_favs",[]);
var settings=load(SK+"_settings",{name:"Anna",sheetUrl:""});
var practiceCtx=load(SK+"_ctx",{name:"",emr:"",size:"",notes:""});
var scratchPads=load(SK+"_scratch",{});
var confidence=load(SK+"_conf",{});
var editHistory=load(SK+"_hist",{});
var savedPractices=load(SK+"_practices",[]);
var audits=load(SK+"_audits",{});           // key: practiceName -> {intake, analysis, ts}
var softwareReviews=load(SK+"_swreviews",{});
var trainingPlaybooks=load(SK+"_playbooks",[]);
if(!trainingPlaybooks.length)seedPlaybooks();
var tpStep=0;
var tpCurrent={id:"",title:"",platform:"4D",sessionType:"new_staff",client:"",sessionNum:1,transcript:"",topics:[],homework:[],pending:[],nextSession:"",notes:"",ts:0};  // key: id -> {name, emr, notes, checklist, ts}
var swReviewData={id:"",name:"",emr:"4D",notes:"",checklist:{},ts:0};
var swReviewStep=0; // 0=home, 1=intake, 2=checklist, 3=report
var auditMode="full"; // "full" or "review"
var knownIssues=load(SK+"_issues",{});      // key: platform -> [{cat,severity,status,issue,workaround,ts,by}]
var brainEntries=load(SK+"_brain",[]);       // [{id,ts,by,from,text,image,tag,status,promoted}]
var helpArticles=load(SK+"_help",[]);         // [{id,title,category,tags,body,clientReady,published,author,created,updated}]
var helpPaths=load(SK+"_paths",[]);           // [{id,title,description,articleIds,client,created,updated}]
var profiles=load(SK+"_profiles",[]);
var globalReleases=load(SK+"_grec",[]);  // [{id,platform,version,rawText,items,created}]
function saveGlobalReleases(){
  save(SK+"_grec",globalReleases);
  // Only sync the latest release (not all) and strip large fields
  if(globalReleases.length){
    var r=globalReleases[0];
    syncToSheet({
      action:"release",
      id:r.id,
      platform:r.platform,
      version:r.version||"",
      parsed:r.parsed?1:0,
      created:r.created,
      updated:r.updated||r.created,
      matchedProfiles:JSON.stringify(r.matchedProfiles||[]),
      // Store rawText and items separately — truncate if needed
      rawText:(r.rawText||"").slice(0,30000),
      items:JSON.stringify((r.items||[]).map(function(i){return {title:i.title,description:i.description,category:i.category,flagMatches:i.flagMatches,flagNotes:i.flagNotes,dbFeature:i.dbFeature};}))
    });
  }
}         // [{id,name,status,emr,phone,financing,imaging,ai,crm,contacts,notes,flags,brainIds,pathIds,auditId,releases,created,updated}]
var auditCurrent=load(SK+"_audit_current",null); // in-progress audit state (restored below, after auditData/auditStep defaults are declared)

// ── HELP CENTER DEFAULT ARTICLES (seeded once) ──────────────────────────────
(function seedHelp(){
  var bSym1="## Symplast Phone Porting & VoIP -- What Every Practice Needs to Know\n\n**Source:** Symplast Telephony Guidelines (ACG internal) · September 2026\n\nSymplast uses GoHighLevel (GHL) as its CRM platform. Phone and messaging run on Twilio. This means porting and texting go through multiple layers: client's carrier, GHL, Twilio, and carrier partners. Symplast may have limited visibility into where a request sits at any given time.\n\n---\n\n### Key Timelines\n\n- Phone number porting: 7-14 business days (can run longer)\n- SMS activation after porting: 2-4 business days after voice activates\n- A2P brand/campaign approval: 3-7 business days\n- Number association after A2P approval: up to 24 hours\n\nPorting PINs can expire mid-process and require resubmission, which restarts the clock.\n\n---\n\n### Critical Watch-Outs Before Porting\n\n**Personal numbers.** Any provider porting a personal cell number needs to know: it becomes a business channel. All calls and texts flow into the CRM and may be visible to staff. Before porting: remove from iMessage and FaceTime, update banking and 2FA accounts to a different number.\n\n**iMessage must be disconnected first.** iPhone users will continue routing messages through Apple instead of the CRM. The practice misses inbound texts without knowing it. The client handles this -- Symplast cannot access Apple ID settings.\n\n**Short-code SMS will NOT deliver.** Bank 2FA codes, login verification, and security alerts from 5- or 6-digit short codes will not reach a GHL-managed number. Anyone using that number for banking must update those accounts before porting.\n\n**Do not cancel existing service** until voice, SMS, and voicemail are all tested and working in the CRM.\n\n**Calls may arrive before confirmation.** Once a port completes, calls route into the CRM before Symplast sends any notice. Staff should be warned in advance.\n\n---\n\n### A2P 10DLC -- Required Before Any Bulk Texting\n\nA2P 10DLC is a carrier registration requirement for business texting. Not optional. Until approved, automated reminders and campaigns will be filtered or blocked by carriers.\n\nCommon causes of delays: incorrect EIN, business name mismatch, missing privacy policy or opt-in language on the practice website.\n\n**New number ramp-up.** Even after A2P approval, a new number cannot blast high volumes on day one. Start small and build sending history over the first 2-3 weeks.\n\n---\n\n### What Symplast Phone Does Not Support\n\n- Fax -- port any existing fax to a separate eFax service before porting the main line\n- Existing PBX or SIP trunking (but see the deskphone article -- GHL has added SIP endpoint support)\n- Call parking, overhead paging, operator consoles, proprietary PBX features\n- Emergency calling -- practices must maintain a separate verified 911-capable line at every location\n\n---\n\n### ACG Recommendation\n\nSet expectations before kick-off: two to three weeks is realistic from porting request to fully operational texting. Build this into the implementation plan. The single biggest mistake is promising patients text reminders before A2P registration and number ramp-up are complete.";
  var bSym2="## Symplast VoIP Deskphones (SIP Endpoint) -- Setup Guide\n\n**Source:** LeadConnector (GoHighLevel) Help Documentation · Updated August 31, 2026\n\n> **Important:** As of this writing, Symplast's own guideline states physical deskphones are not supported. However, GoHighLevel -- the platform powering Symplast -- released native VoIP deskphone SIP endpoint support on August 31, 2026. If a Symplast client wants desk phones, ask Symplast support specifically about enabling this through GHL Advanced Settings.\n\n---\n\n### Network Requirements\n\n- SIP over UDP, TCP, or TLS\n- Outbound ports 5060/5061 open for SIP\n- UDP ports 10000-20000 open for RTP audio\n- PoE or external power supply for the phone\n\n### Recommended Hardware\n\nAny open-SIP handset should work. Proven models: Yealink T54W/T58W, Poly VVX 450, Grandstream GXP 2170, Snom D785, Cisco 7841. Avoid phones locked to a single carrier or requiring proprietary provisioning codes.\n\n---\n\n### Setup Steps\n\n1. In Symplast (GHL): Settings → Phone System → Advanced Settings → VoIP Deskphone (SIP) → Get Started\n2. Set your SIP Domain (format: PracticeName.sip.ashburn.twilio.com). Can only be set once.\n3. Create a SIP User -- set an extension/username and password. Save these.\n4. Link to a GHL user account. One deskphone per user.\n5. Click Save.\n6. On the physical phone, enter the SIP domain, username, and password in the Registrar/Server/Proxy fields.\n7. Test: run an outbound test call (dial the on-screen number) and inbound test (click Test Ring).\n\n---\n\n### Deskphone Calls and Transfers\n\n**Direct extension dialing:** dial a teammate's extension from the deskphone -- no external routing needed.\n\n**IVR call transfer:** initiate a transfer during an active call and dial the teammate's extension.\n\n> Only blind transfers are supported. Warm transfers are not yet available.\n\nCall transfers from deskphones cost **$0.10 per transfer** (SIP Refer).\n\n---\n\n### Troubleshooting\n\n- 401/403 Unauthorized: verify username and password -- both are case-sensitive\n- No audio: confirm UDP 10000-20000 open on firewall\n- Phone rings but can't answer: RTP ports blocked by NAT or SIP ALG\n- Not receiving calls: Settings → My Staff → Edit Staff → Call & Voicemail Settings → enable Deskphone (SIP)\n- Not receiving IVR calls: set Default Channel for IVR = Deskphone in the same screen\n- Previously provisioned phone: perform a hard reset before attempting setup\n\n---\n\n### ACG Note\n\nThis is a recent release (August 2026) and Symplast support may not be fully up to speed. Reference the LeadConnector help documentation and GHL Advanced Settings path directly when working with a client.";
  if(helpArticles.length)return;
  var b1=[
    '## Overview',
    '',
    'Scheduling templates in Nextech control which appointment types are available for each provider and location. Getting these right is the foundation for online booking, automated reminders, and accurate reporting.',
    '',
    '## Steps',
    '',
    '**1. Build your Appointment Type list first**',
    'Go to Administration > Appointment Types. Create one entry per service category (e.g. Consult - Surgical, Consult - Injectable, Post-Op 1 Week). Set the duration, color code, and whether it requires a provider.',
    '',
    '**2. Create Scheduling Templates per provider**',
    'Go to Administration > Scheduling Templates. Each template defines what a provider\'s day looks like -- which appointment types they see, in which time slots.',
    '',
    '**3. Link templates to your master schedule**',
    'Under Scheduling > Master Schedule, assign the template to the provider for each day of the week. This drives availability in the scheduler and online booking.',
    '',
    '**4. Test before go-live**',
    'Book a test appointment for each appointment type and confirm the right provider, duration, and reminder workflow fires.',
    '',
    '## ACG Notes',
    '',
    'The setup is tedious but worth the investment. Practices that skip template design end up with scheduling chaos. Block a full day for this during implementation.',
    '',
    '## Common Mistakes',
    '',
    '- Creating too many appointment types (aim for 8-12 max to start)',
    '- Not testing online booking after template changes',
    '- Forgetting to assign templates to new providers at hire'
  ].join('\n');
  var b2=[
    '## Overview',
    '',
    'Cherry is ACG\'s primary financing recommendation for all plastic surgery and aesthetics practices. This guide covers what staff need to know to present it confidently.',
    '',
    '## Key Points to Communicate to Patients',
    '',
    '**Soft credit check only** -- Applying for Cherry does not affect the patient\'s credit score. Always lead with this.',
    '',
    '**60-second application** -- Patients apply on a tablet or their phone in under a minute.',
    '',
    '**80-90% approval rate** -- More patients get approved than with CareCredit or Alphaeon.',
    '',
    '**True 0% APR -- no deferred interest** -- CareCredit and Alphaeon charge retroactive interest if not paid off in the promo period. Cherry does not.',
    '',
    '## How to Introduce It',
    '',
    'During consultation: We partner with Cherry financing, which lets patients break their investment into monthly payments with no impact to your credit score to apply. Would you like to see what your payments would look like?',
    '',
    '## Practice Setup',
    '',
    'Cherry is free to add with no contract. Practice sets up at providers.withcherry.com. Apply for a merchant account, get approved (usually same day), and you are live.',
    '',
    '## ACG Notes',
    '',
    'Every practice should offer Cherry. It is free, it has the highest approval rate, and the Allergan/Alle integration is unique. Recommend adding CareCredit as a secondary for brand recognition.'
  ].join('\n');
  var b3=[
    '## Overview',
    '',
    'Weave is ACG\'s top phone system recommendation for Nextech practices. The native integration enables Call Pop (patient ID on ring), Schedule Sync, and 2-way texting connected to Nextech records.',
    '',
    '## Prerequisites',
    '',
    '- Active Weave account with Healthcare plan',
    '- Nextech (P+ or Cloud) with API access enabled',
    '- HIPAA BAA signed with Weave',
    '',
    '## Setting Up Call Pop',
    '',
    'Call Pop shows the patient\'s name, appointment, and last visit before the call is answered.',
    '',
    '1. In Weave Admin, go to Integrations > Nextech',
    '2. Enter your Nextech API credentials (from Nextech Admin > API Access)',
    '3. Test with a known patient phone number -- call in and confirm the patient card appears',
    '4. Train front desk to use the patient name when answering',
    '',
    '## Setting Up Schedule Sync',
    '',
    'Schedule Sync pulls tomorrow\'s appointments into Weave so automated reminders go to the right patients.',
    '',
    '1. In Weave > Settings > Reminders, enable Schedule Sync',
    '2. Set sync frequency (every 15 min recommended)',
    '3. Configure reminder templates by appointment type',
    '4. Enable confirmation reply tracking',
    '',
    '## Missed Call Auto-Text',
    '',
    'When a call goes unanswered, Weave automatically texts the patient. Go to Weave > Missed Calls > Auto-Text to configure.',
    '',
    '## ACG Notes',
    '',
    'The EMR integration setup takes 1-2 hours the first time. Once live, practices consistently report that Call Pop changes how the front desk operates.'
  ].join('\n');
  helpArticles=[
    {id:"h001",title:"How to Set Up Scheduling Templates in Nextech",category:"Nextech",tags:["scheduling","nextech","templates"],body:b1,author:"Anna",clientReady:true,published:false,created:Date.now(),updated:Date.now()},
    {id:"h002",title:"Understanding Cherry Financing: Staff Training Guide",category:"Patient Financing",tags:["cherry","financing","staff training"],body:b2,author:"Anna",clientReady:true,published:false,created:Date.now(),updated:Date.now()},
    {id:"h003",title:"Weave + Nextech Integration Setup Guide",category:"Phone Systems",tags:["weave","nextech","integration"],body:b3,author:"Anna",clientReady:false,published:false,created:Date.now(),updated:Date.now()},
    {id:"h004",title:"Symplast Phone Porting & VoIP: What Every Practice Needs to Know",category:"CRM",tags:["symplast","phone porting","voip","texting","a2p","twilio","ghl"],body:bSym1,author:"Anna",clientReady:true,published:false,created:Date.now(),updated:Date.now()},
    {id:"h005",title:"Symplast VoIP Deskphones (SIP Endpoint) Setup Guide",category:"CRM",tags:["symplast","deskphone","sip","voip","hardphone","ghl","leadconnector"],body:bSym2,author:"Anna",clientReady:false,published:false,created:Date.now(),updated:Date.now()}
  ];
  save(SK+"_help",helpArticles);
})();
var customUtilQ=load(SK+"_customutil",[]);   // permanent custom utilization questions, same shape as UTIL_QUESTIONS
var coll={};
var view="home";
var activePlat=null;
var comparePlats=[];  // for side-by-side compare
var AF={sheet:"Dashboard",section:"",feature:"",cols:{}};
var scratchVisible=false;

// Always use hardcoded Azure URL — ignore stale settings
SHEET_URL=AZURE_API_URL;settings.sheetUrl=AZURE_API_URL;

function GD(){return DB.concat(cust);}

// ── OVERRIDE ENGINE ──────────────────────────────────────────
function overrideKey(sheet,feature,platform){return sheet+"\xb7"+feature+"\xb7"+platform;}
function getOverride(sheet,feature,platform){return overrides[overrideKey(sheet,feature,platform)]||null;}
function setOverride(sheet,feature,platform,data,oldVal,reason){
  var key=overrideKey(sheet,feature,platform);
  var existing=overrides[key]||{};
  var oldValue=existing.val||oldVal;
  var ts=Date.now();
  // Save history (last 3 versions)
  if(!editHistory[key])editHistory[key]=[];
  editHistory[key].unshift({ts:ts,val:existing.val||"",note:existing.note||"",acgTake:existing.acgTake||"",by:existing.updatedBy||""});
  editHistory[key]=editHistory[key].slice(0,3);
  save(SK+"_hist",editHistory);
  overrides[key]=Object.assign({},existing,data,{updatedAt:ts,updatedBy:settings.name});
  save(SK+"_overrides",overrides);
  pushOverride(sheet,feature,platform,overrides[key]);
  var entry={who:settings.name,when:ts,sheet:sheet,feature:feature,platform:platform,
    field:data.val!==undefined?"value":data.note!==undefined?"note":"acgTake",
    oldVal:oldValue,newVal:data.val||data.note||data.acgTake||"",reason:reason||""};
  changelog.unshift(entry);
  if(changelog.length>200)changelog=changelog.slice(0,200);
  save(SK+"_changelog",changelog);
  pushChangelog(entry);
}

// ── NLP ──────────────────────────────────────────────────────
function parsePlatforms(ql){
  var found=[];
  for(var i=0;i<PLATS.length;i++){
    for(var j=0;j<PLATS[i].keys.length;j++){
      if(ql.indexOf(PLATS[i].keys[j].toLowerCase())>=0){
        if(found.indexOf(PLATS[i].label)<0)found.push(PLATS[i].label);break;
      }
    }
  }
  return found;
}
function parseFeatures(ql){
  var f=[];
  var synKeys=Object.keys(FEATURE_SYNONYMS);
  for(var si=0;si<synKeys.length;si++){
    if(ql.indexOf(synKeys[si])>=0&&FEATURE_SYNONYMS[synKeys[si]]){
      var mapped=FEATURE_SYNONYMS[synKeys[si]];
      for(var mi=0;mi<mapped.length;mi++){if(f.indexOf(mapped[mi])<0)f.push(mapped[mi]);}
    }
  }
  return f;
}
function answerQ(q){
  var ql=q.toLowerCase().trim();
  var plats=parsePlatforms(ql);
  var feats=parseFeatures(ql);
  var data=GD();
  var matches=[];
  var words=ql.split(/\s+/).filter(function(w){return w.length>3&&["does","have","what","with","that","this","their","about","show","tell","give","does","which","where","when","how"].indexOf(w)<0;});
  for(var i=0;i<data.length;i++){
    var e=data[i];var fl=e.f.toLowerCase();var sl=e.sec.toLowerCase();
    var noteVals=e.notes?Object.values(e.notes).join(" ").toLowerCase():"";
    var score=0;
    for(var fi=0;fi<feats.length;fi++){if(fl.indexOf(feats[fi])>=0||feats[fi].indexOf(fl)>=0)score+=10;else if(fl.indexOf(feats[fi].split(" ")[0])>=0)score+=4;}
    for(var wi=0;wi<words.length;wi++){if(fl.indexOf(words[wi])>=0)score+=3;if(sl.indexOf(words[wi])>=0)score+=1;if(noteVals.indexOf(words[wi])>=0)score+=2;}
    // Also search in override notes
    var okeys=Object.keys(overrides);
    for(var oi=0;oi<okeys.length;oi++){if(okeys[oi].indexOf(e.f)>=0){var ov=overrides[okeys[oi]];if(ov.note&&ov.note.toLowerCase().indexOf(words[0])>=0)score+=2;}}
    if(score>0)matches.push({e:e,score:score});
  }
  matches.sort(function(a,b){return b.score-a.score;});
  return {plats:plats,entries:matches.slice(0,8).map(function(m){return m.e;}),words:words,scores:matches.slice(0,8).map(function(m){return m.score;})};
}
