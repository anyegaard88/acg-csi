function rHelp(body){
  // Route to paths view
  if(helpSubView==="paths"){
    if(helpPathView==="edit"){rHelpPathEdit(body,helpPathSelectedId?helpPaths.filter(function(p){return p.id===helpPathSelectedId;})[0]:null);return;}
    if(helpPathView==="read"&&helpPathSelectedId){var sp=helpPaths.filter(function(p){return p.id===helpPathSelectedId;})[0];if(sp){rHelpPathRead(body,sp);return;}helpPathView="list";}
    rHelpPathList(body);return;
  }
  var _cset={};helpArticles.forEach(function(a){_cset[a.category]=1;});var CATS=["All"].concat(Object.keys(_cset).sort());
  var filtered=helpArticles.filter(function(a){
    var matchCat=helpFilterCat==="All"||a.category===helpFilterCat;
    var matchQ=!helpSearchQ||a.title.toLowerCase().indexOf(helpSearchQ)>=0||
      (a.tags||[]).join(" ").toLowerCase().indexOf(helpSearchQ)>=0||
      a.body.toLowerCase().indexOf(helpSearchQ)>=0;
    return matchCat&&matchQ;
  });
  filtered.sort(function(a,b){return b.updated-a.updated;});

  if(helpView==="read"&&helpSelectedId){
    var art=helpArticles.filter(function(a){return a.id===helpSelectedId;})[0];
    if(art){rHelpRead(body,art);return;}
    helpView="list";
  }
  if(helpView==="edit"){
    var edArt=helpSelectedId?helpArticles.filter(function(a){return a.id===helpSelectedId;})[0]:null;
    rHelpEdit(body,edArt);return;
  }

  // ── LIST VIEW ──────────────────────────────────────────────────────────────
  var h='<div style="max-width:900px;margin:0 auto;padding:20px 16px">';
  h+='<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:10px">';
  h+='<div><h2 style="font-family:Playfair Display,serif;font-size:22px;color:var(--navy);margin:0">ACG Help Center</h2>';
  h+='<p style="margin:4px 0 0;font-size:12px;color:var(--text3)">ACG-branded how-to articles and client training paths</p></div>';
  h+='<button id="hc-new" style="background:var(--navy);color:#fff;border:none;border-radius:8px;padding:9px 18px;font-size:12px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif">+ New Article</button>';
  h+='</div>';
  // Sub-nav: Articles | Training Paths
  h+='<div style="display:flex;gap:2px;margin-bottom:18px;border-bottom:2px solid var(--tan2)">';
  h+='<button id="hc-subnav-articles" style="padding:8px 18px;border:none;background:none;font-size:13px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif;color:var(--navy);border-bottom:2px solid var(--navy);margin-bottom:-2px">Articles ('+(helpArticles.length)+')</button>';
  h+='<button id="hc-subnav-paths" style="padding:8px 18px;border:none;background:none;font-size:13px;font-weight:600;cursor:pointer;font-family:Inter,sans-serif;color:var(--text3)">Training Paths ('+(helpPaths.length)+')</button>';
  h+='</div>';

  // Search + filter bar
  h+='<div style="display:flex;gap:10px;margin-bottom:16px;flex-wrap:wrap">';
  h+='<input id="hc-search" type="text" value="'+esc(helpSearchQ)+'" placeholder="Search articles..." style="flex:1;min-width:180px;padding:8px 12px;border:1px solid var(--tan2);border-radius:7px;font-size:13px;font-family:Inter,sans-serif;color:var(--navy)">';
  h+='<select id="hc-cat" style="padding:8px 12px;border:1px solid var(--tan2);border-radius:7px;font-size:12px;font-family:Inter,sans-serif;color:var(--navy)">';
  CATS.forEach(function(c){h+='<option'+(c===helpFilterCat?' selected':'')+'>'+esc(c)+'</option>';});
  h+='</select></div>';

  // Stats bar
  var ready=helpArticles.filter(function(a){return a.clientReady;}).length;
  var pub=helpArticles.filter(function(a){return a.published;}).length;
  h+='<div style="display:flex;gap:12px;margin-bottom:18px;flex-wrap:wrap">';
  h+='<span style="font-size:11px;background:var(--gold-bg);border:1px solid var(--gold);color:var(--navy);padding:4px 10px;border-radius:20px;font-weight:600">'+helpArticles.length+' Articles</span>';
  h+='<span style="font-size:11px;background:#ecfdf5;border:1px solid #a7f3d0;color:#065f46;padding:4px 10px;border-radius:20px;font-weight:600">'+ready+' Client-Ready</span>';
  h+='<span style="font-size:11px;background:#eff6ff;border:1px solid #bfdbfe;color:#1e40af;padding:4px 10px;border-radius:20px;font-weight:600">'+pub+' Published</span>';
  h+='</div>';

  if(!filtered.length){
    h+='<div style="text-align:center;padding:48px 20px;color:var(--text3)"><div style="font-size:32px;margin-bottom:12px">&#x1F4DA;</div><div style="font-weight:600;margin-bottom:4px">No articles found</div><div style="font-size:12px">Try a different search or category</div></div>';
  } else {
    // Group by category
    var _cset2={};filtered.forEach(function(a){_cset2[a.category]=1;});var cats=Object.keys(_cset2).sort();
    cats.forEach(function(cat){
      var catArts=filtered.filter(function(a){return a.category===cat;});
      h+='<div style="margin-bottom:24px">';
      h+='<div style="font-size:10px;font-weight:800;color:var(--text3);letter-spacing:.8px;text-transform:uppercase;margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid var(--tan2)">'+esc(cat)+'</div>';
      catArts.forEach(function(art){
        var readyBadge=art.clientReady?'<span style="font-size:10px;background:#ecfdf5;color:#065f46;border:1px solid #a7f3d0;padding:2px 8px;border-radius:10px;font-weight:700;margin-left:8px">Client-Ready</span>':'';
        var pubBadge=art.published?'<span style="font-size:10px;background:#eff6ff;color:#1e40af;border:1px solid #bfdbfe;padding:2px 8px;border-radius:10px;font-weight:700;margin-left:4px">Published</span>':'';
        var tags=(art.tags||[]).slice(0,4).map(function(t){return'<span style="font-size:10px;background:var(--tan);color:var(--navy);padding:2px 7px;border-radius:10px">'+esc(t)+'</span>';}).join(" ");
        h+='<div class="hc-card" data-id="'+art.id+'" style="background:#fff;border:1px solid var(--tan2);border-radius:10px;padding:14px 16px;margin-bottom:8px;cursor:pointer;transition:box-shadow .15s">';
        h+='<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px">';
        h+='<div style="flex:1">';
        h+='<div style="font-size:14px;font-weight:700;color:var(--navy);margin-bottom:4px">'+esc(art.title)+readyBadge+pubBadge+'</div>';
        if(tags)h+='<div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:6px">'+tags+'</div>';
        h+='<div style="font-size:11px;color:var(--text3)">By '+esc(art.author||"ACG")+' · '+new Date(art.updated).toLocaleDateString()+'</div>';
        h+='</div>';
        h+='<div style="display:flex;gap:6px;flex-shrink:0">';
        h+='<button class="hc-edit" data-id="'+art.id+'" style="background:none;border:1px solid var(--tan2);border-radius:6px;padding:5px 10px;font-size:11px;font-weight:600;cursor:pointer;color:var(--navy)">Edit</button>';
        if(art.clientReady){
          h+='<button class="hc-pdf" data-id="'+art.id+'" style="background:var(--gold);border:none;border-radius:6px;padding:5px 10px;font-size:11px;font-weight:700;cursor:pointer;color:var(--navy)">&#x2B07; PDF</button>';
        }
        h+='</div></div></div>';
      });
      h+='</div>';
    });
  }
  h+='</div>';
  body.innerHTML=h;

  // Events
  document.getElementById("hc-new").addEventListener("click",function(){
    helpSelectedId=null;helpView="edit";render();
  });
  document.getElementById("hc-subnav-paths").addEventListener("click",function(){
    helpSubView="paths";helpPathView="list";render();
  });
  document.getElementById("hc-subnav-articles").addEventListener("click",function(){
    helpSubView="articles";render();
  });
  document.getElementById("hc-search").addEventListener("input",function(){
    helpSearchQ=this.value.toLowerCase();render();
  });
  document.getElementById("hc-cat").addEventListener("change",function(){
    helpFilterCat=this.value;render();
  });
  document.querySelectorAll(".hc-card").forEach(function(card){
    card.addEventListener("click",function(e){
      if(e.target.classList.contains("hc-edit")||e.target.classList.contains("hc-pdf"))return;
      helpSelectedId=this.dataset.id;helpView="read";render();
    });
    card.querySelector(".hc-edit")&&card.querySelector(".hc-edit").addEventListener("click",function(e){
      e.stopPropagation();helpSelectedId=this.dataset.id;helpView="edit";render();
    });
    var pdfBtn=card.querySelector(".hc-pdf");
    if(pdfBtn)pdfBtn.addEventListener("click",function(e){
      e.stopPropagation();
      var art=helpArticles.filter(function(a){return a.id===pdfBtn.dataset.id;})[0];
      if(art)downloadHelpPdf(art);
    });
  });
}

function rHelpRead(body,art){
  var html=parseMarkdown(art.body||"");
  var readyBadge=art.clientReady?'<span style="font-size:11px;background:#ecfdf5;color:#065f46;border:1px solid #a7f3d0;padding:3px 10px;border-radius:10px;font-weight:700">Client-Ready</span> ':'';
  var pubBadge=art.published?'<span style="font-size:11px;background:#eff6ff;color:#1e40af;border:1px solid #bfdbfe;padding:3px 10px;border-radius:10px;font-weight:700">Published</span>':'';
  var tags=(art.tags||[]).map(function(t){return'<span style="font-size:11px;background:var(--tan);color:var(--navy);padding:3px 9px;border-radius:10px">'+esc(t)+'</span>';}).join(" ");

  var h='<div style="max-width:720px;margin:0 auto;padding:20px 16px">';
  h+='<button id="hc-back" style="background:none;border:none;color:var(--navy);font-size:12px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif;padding:0;margin-bottom:16px;display:flex;align-items:center;gap:4px">← Back to Help Center</button>';
  
  // Article header card
  h+='<div style="background:var(--navy);border-radius:12px;padding:24px;margin-bottom:20px">';
  h+='<div style="font-size:10px;font-weight:700;color:var(--gold);letter-spacing:.8px;text-transform:uppercase;margin-bottom:8px">'+esc(art.category)+'</div>';
  h+='<h1 style="font-family:Playfair Display,serif;font-size:22px;color:#fff;margin:0 0 12px">'+esc(art.title)+'</h1>';
  h+='<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">';
  h+=readyBadge+pubBadge;
  if(tags)h+='<div style="display:flex;gap:6px;flex-wrap:wrap">'+tags+'</div>';
  h+='</div>';
  h+='<div style="font-size:11px;color:rgba(255,255,255,.4);margin-top:10px">By '+esc(art.author||"ACG")+' · Updated '+new Date(art.updated).toLocaleDateString()+'</div>';
  h+='</div>';

  // Body
  h+='<div style="background:#fff;border:1px solid var(--tan2);border-radius:12px;padding:28px;line-height:1.75;color:var(--navy);font-size:14px">'+html+'</div>';

  // Action bar
  h+='<div style="display:flex;gap:10px;margin-top:16px;flex-wrap:wrap">';
  h+='<button id="hc-edit-btn" style="background:var(--navy);color:#fff;border:none;border-radius:8px;padding:10px 20px;font-size:12px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif">Edit Article</button>';
  h+='<button id="hc-dup-btn" style="background:none;border:1px solid var(--tan2);color:var(--navy);border-radius:8px;padding:10px 20px;font-size:12px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif">Duplicate</button>';
  if(art.clientReady){
    h+='<button id="hc-pdf-btn" style="background:var(--gold);color:var(--navy);border:none;border-radius:8px;padding:10px 20px;font-size:12px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif">&#x2B07; Download PDF for Client</button>';
  }
  if(!art.clientReady){
    h+='<span style="font-size:11px;color:var(--text3);align-self:center">Mark as Client-Ready in Edit to enable PDF download</span>';
  }
  h+='</div></div>';
  body.innerHTML=h;

  document.getElementById("hc-back").addEventListener("click",function(){helpView="list";helpSelectedId=null;render();});
  document.getElementById("hc-edit-btn").addEventListener("click",function(){helpView="edit";render();});
  var dupBtn=document.getElementById("hc-dup-btn");
  if(dupBtn)dupBtn.addEventListener("click",function(){
    var newArt=JSON.parse(JSON.stringify(art));
    newArt.id=uid();newArt.title="Copy of "+newArt.title;
    newArt.clientReady=false;newArt.published=false;
    newArt.created=Date.now();newArt.updated=Date.now();
    helpArticles.unshift(newArt);saveHelp();
    helpSelectedId=newArt.id;helpView="edit";render();
  });
  var pdfBtn=document.getElementById("hc-pdf-btn");
  if(pdfBtn)pdfBtn.addEventListener("click",function(){downloadHelpPdf(art);});
}

function rHelpEdit(body,art){
  var isNew=!art;
  var a=art||{id:uid(),title:"",category:"",tags:[],body:"",clientReady:false,published:false,author:settings.name||"ACG",created:Date.now(),updated:Date.now()};
  var CATS=["Nextech","Symplast","4D","ModMed","AestheticsPro","Patient Financing","Phone Systems","Imaging & Photography","AI Tools","CRM","Practice Operations","General"];
  
  var h='<div style="max-width:800px;margin:0 auto;padding:20px 16px">';
  h+='<button id="hc-back" style="background:none;border:none;color:var(--navy);font-size:12px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif;padding:0;margin-bottom:16px">← Back to Help Center</button>';
  h+='<div style="background:#fff;border:1px solid var(--tan2);border-radius:12px;padding:24px">';
  h+='<h2 style="font-family:Playfair Display,serif;font-size:20px;color:var(--navy);margin:0 0 20px">'+(isNew?"New Article":"Edit Article")+'</h2>';

  // Title
  h+='<div style="margin-bottom:16px"><label style="font-size:11px;font-weight:700;color:var(--navy);display:block;margin-bottom:5px;text-transform:uppercase;letter-spacing:.4px">Article Title *</label>';
  h+='<input id="hc-title" type="text" value="'+esc(a.title)+'" placeholder="e.g. How to Set Up Online Booking in Nextech" style="width:100%;padding:9px 12px;border:1px solid var(--tan2);border-radius:7px;font-size:14px;font-family:Inter,sans-serif;color:var(--navy);box-sizing:border-box"></div>';

  // Category + Tags
  h+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:16px">';
  h+='<div><label style="font-size:11px;font-weight:700;color:var(--navy);display:block;margin-bottom:5px;text-transform:uppercase;letter-spacing:.4px">Category *</label>';
  h+='<select id="hc-cat-sel" style="width:100%;padding:9px 12px;border:1px solid var(--tan2);border-radius:7px;font-size:13px;font-family:Inter,sans-serif;color:var(--navy)">';
  h+='<option value="">Select category...</option>';
  CATS.forEach(function(c){h+='<option value="'+c+'"'+(a.category===c?' selected':'')+'>'+c+'</option>';});
  h+='</select></div>';
  h+='<div><label style="font-size:11px;font-weight:700;color:var(--navy);display:block;margin-bottom:5px;text-transform:uppercase;letter-spacing:.4px">Tags (comma-separated)</label>';
  h+='<input id="hc-tags" type="text" value="'+(a.tags||[]).join(", ")+'" placeholder="scheduling, nextech, templates" style="width:100%;padding:9px 12px;border:1px solid var(--tan2);border-radius:7px;font-size:13px;font-family:Inter,sans-serif;color:var(--navy);box-sizing:border-box"></div>';
  h+='</div>';

  // Body — split-screen editor with toolbar
  h+='<div style="margin-bottom:16px">';
  h+='<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">';
  h+='<label style="font-size:11px;font-weight:700;color:var(--navy);text-transform:uppercase;letter-spacing:.4px">Article Content</label>';
  h+='<span style="font-size:11px;color:var(--text3)">Split screen: Edit | Preview</span></div>';
  // Toolbar
  h+='<div id="editor-toolbar" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:6px;padding:8px;background:var(--tan);border-radius:7px 7px 0 0;border:1px solid var(--tan2);border-bottom:none">';
  var tbBtns=[
    {label:'H2',cmd:'h2',tip:'Heading 2'},
    {label:'H3',cmd:'h3',tip:'Heading 3'},
    {label:'B',cmd:'bold',tip:'Bold',style:'font-weight:700'},
    {label:'I',cmd:'italic',tip:'Italic',style:'font-style:italic'},
    {label:'&#x2022;',cmd:'bullet',tip:'Bullet list'},
    {label:'1.',cmd:'numbered',tip:'Numbered list'},
    {label:'&#x2015;',cmd:'divider',tip:'Divider'},
    {label:'&#x1F4F8;',cmd:'image',tip:'Insert image URL'}
  ];
  tbBtns.forEach(function(b){
    h+='<button class="tb-btn" data-cmd="'+b.cmd+'" title="'+b.tip+'" style="background:#fff;border:1px solid var(--tan2);border-radius:5px;padding:4px 9px;font-size:12px;cursor:pointer;font-family:Inter,sans-serif;color:var(--navy)'+(b.style?';'+b.style:'')+'">'+(b.label)+'</button>';
  });
  h+='</div>';
  // Split pane
  h+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:0;border:1px solid var(--tan2);border-radius:0 0 7px 7px;overflow:hidden">';
  h+='<textarea id="hc-body" style="height:380px;padding:12px;border:none;border-right:1px solid var(--tan2);font-size:12px;font-family:Courier New,monospace;color:var(--navy);resize:none;box-sizing:border-box;line-height:1.6;outline:none">'+esc(a.body)+'</textarea>';
  h+='<div id="hc-preview" style="height:380px;padding:12px;overflow-y:auto;background:#fafaf8;font-size:12px;line-height:1.7;color:var(--navy)"></div>';
  h+='</div></div>';

  // Author
  h+='<div style="margin-bottom:16px"><label style="font-size:11px;font-weight:700;color:var(--navy);display:block;margin-bottom:5px;text-transform:uppercase;letter-spacing:.4px">Author</label>';
  h+='<input id="hc-author" type="text" value="'+esc(a.author||settings.name||"ACG")+'" style="width:180px;padding:9px 12px;border:1px solid var(--tan2);border-radius:7px;font-size:13px;font-family:Inter,sans-serif;color:var(--navy)"></div>';

  // Flags
  h+='<div style="display:flex;gap:24px;margin-bottom:20px;padding:14px;background:var(--tan);border-radius:8px">';
  h+='<label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:13px;font-weight:600;color:var(--navy)">';
  h+='<input type="checkbox" id="hc-ready"'+(a.clientReady?' checked':'')+' style="width:16px;height:16px;accent-color:var(--navy)"> Client-Ready <span style="font-size:11px;font-weight:400;color:var(--text3)">(enables PDF download)</span></label>';
  h+='<label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:13px;font-weight:600;color:var(--navy)">';
  h+='<input type="checkbox" id="hc-pub"'+(a.published?' checked':'')+' style="width:16px;height:16px;accent-color:var(--navy)"> Mark for External Publish <span style="font-size:11px;font-weight:400;color:var(--text3)">(future public page)</span></label>';
  h+='</div>';

  // Buttons
  h+='<div style="display:flex;gap:10px;flex-wrap:wrap">';
  h+='<button id="hc-save-art" style="background:var(--navy);color:#fff;border:none;border-radius:8px;padding:11px 24px;font-size:13px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif">'+(isNew?"Save Article":"Save Changes")+'</button>';
  if(!isNew){
    h+='<button id="hc-delete-art" style="background:none;border:1px solid #fca5a5;color:#dc2626;border-radius:8px;padding:11px 18px;font-size:13px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif">Delete</button>';
  }
  h+='</div></div></div>';
  body.innerHTML=h;

  document.getElementById("hc-back").addEventListener("click",function(){helpView=helpSelectedId?"read":"list";render();});

  // ── Split-screen editor: live preview + toolbar ────────────────────────────
  var bodyTA=document.getElementById("hc-body");
  var preview=document.getElementById("hc-preview");
  function updatePreview(){if(preview)preview.innerHTML=parseMarkdown(bodyTA.value||"");}
  if(bodyTA){
    bodyTA.addEventListener("input",updatePreview);
    updatePreview();
  }

  function insertAtCursor(ta,before,after){
    var s=ta.selectionStart,e=ta.selectionEnd;
    var sel=ta.value.substring(s,e);
    var rep=before+(sel||"text")+after;
    ta.value=ta.value.substring(0,s)+rep+ta.value.substring(e);
    ta.selectionStart=s+before.length;
    ta.selectionEnd=s+before.length+(sel||"text").length;
    ta.focus();updatePreview();
  }
  function insertLine(ta,prefix){
    var s=ta.selectionStart;
    var lineStart=ta.value.lastIndexOf("\n",s-1)+1;
    ta.value=ta.value.substring(0,lineStart)+prefix+ta.value.substring(lineStart);
    ta.selectionStart=ta.selectionEnd=s+prefix.length;
    ta.focus();updatePreview();
  }

  document.querySelectorAll(".tb-btn").forEach(function(btn){
    btn.addEventListener("click",function(){
      var cmd=this.dataset.cmd;
      if(!bodyTA)return;
      if(cmd==="h2")insertLine(bodyTA,"## ");
      else if(cmd==="h3")insertLine(bodyTA,"### ");
      else if(cmd==="bold")insertAtCursor(bodyTA,"**","**");
      else if(cmd==="italic")insertAtCursor(bodyTA,"*","*");
      else if(cmd==="bullet")insertLine(bodyTA,"- ");
      else if(cmd==="numbered")insertLine(bodyTA,"1. ");
      else if(cmd==="divider"){var p=bodyTA.selectionStart;bodyTA.value=bodyTA.value.substring(0,p)+"\n---\n"+bodyTA.value.substring(p);bodyTA.selectionStart=bodyTA.selectionEnd=p+5;bodyTA.focus();updatePreview();}
      else if(cmd==="image"){var url=prompt("Image URL:");if(url)insertAtCursor(bodyTA,"![image]("+url+")\n","");}
    });
  });

  document.getElementById("hc-save-art").addEventListener("click",function(){
    var title=document.getElementById("hc-title").value.trim();
    var cat=document.getElementById("hc-cat-sel").value;
    var tagsRaw=document.getElementById("hc-tags").value.trim();
    var bodyText=document.getElementById("hc-body").value.trim();
    var author=document.getElementById("hc-author").value.trim();
    var ready=document.getElementById("hc-ready").checked;
    var pub=document.getElementById("hc-pub").checked;
    if(!title){alert("Title is required.");return;}
    if(!cat){alert("Please select a category.");return;}
    var tags=tagsRaw?tagsRaw.split(",").map(function(t){return t.trim();}).filter(Boolean):[];
    var now=Date.now();
    if(isNew){
      a.title=title;a.category=cat;a.tags=tags;a.body=bodyText;
      a.author=author;a.clientReady=ready;a.published=pub;a.updated=now;
      helpArticles.unshift(a);
    } else {
      var idx=helpArticles.findIndex(function(x){return x.id===a.id;});
      if(idx>=0){
        helpArticles[idx].title=title;helpArticles[idx].category=cat;
        helpArticles[idx].tags=tags;helpArticles[idx].body=bodyText;
        helpArticles[idx].author=author;helpArticles[idx].clientReady=ready;
        helpArticles[idx].published=pub;helpArticles[idx].updated=now;
      }
    }
    saveHelp();
    helpSelectedId=a.id;helpView="read";render();
  });

  var delBtn=document.getElementById("hc-delete-art");
  if(delBtn)delBtn.addEventListener("click",function(){
    if(!confirm("Delete this article? This cannot be undone."))return;
    helpArticles=helpArticles.filter(function(x){return x.id!==a.id;});
    saveHelp();helpSelectedId=null;helpView="list";render();
  });
}

// ── MARKDOWN → HTML (simple) ─────────────────────────────────────────────────
function parseMarkdown(md){
  var lines=md.split("\n");
  var html="";var inList=false;
  lines.forEach(function(line){
    if(/^## /.test(line)){
      if(inList){html+="</ul>";inList=false;}
      html+='<h2 style="font-size:16px;font-weight:700;color:var(--navy);margin:20px 0 8px;font-family:Inter,sans-serif">'+esc(line.replace(/^## /,""))+'</h2>';
    } else if(/^### /.test(line)){
      if(inList){html+="</ul>";inList=false;}
      html+='<h3 style="font-size:14px;font-weight:700;color:var(--navy);margin:16px 0 6px;font-family:Inter,sans-serif">'+esc(line.replace(/^### /,""))+'</h3>';
    } else if(/^[-*] /.test(line)){
      if(!inList){html+='<ul style="margin:6px 0 10px 20px;line-height:1.8">';inList=true;}
      var li=line.replace(/^[-*] /,"");
      li=formatInline(li);
      html+='<li>'+li+'</li>';
    } else if(/^[0-9]+\. /.test(line)){
      if(inList){html+="</ul>";inList=false;}
      html+='<p style="margin:4px 0 4px 20px">'+formatInline(line)+'</p>';
    } else if(line.trim()===""){
      if(inList){html+="</ul>";inList=false;}
      html+='<div style="height:8px"></div>';
    } else {
      if(inList){html+="</ul>";inList=false;}
      html+='<p style="margin:0 0 8px">'+formatInline(line)+'</p>';
    }
  });
  if(inList)html+="</ul>";
  return html;
}
function formatInline(t){
  t=esc(t);
  t=t.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>');
  t=t.replace(/\*(.+?)\*/g,'<em>$1</em>');
  t=t.replace(/`(.+?)`/g,'<code style="background:var(--tan);padding:1px 5px;border-radius:3px;font-size:12px">$1</code>');
  return t;
}

// ── PDF DOWNLOAD ──────────────────────────────────────────────────────────────
function downloadHelpPdf(art){
  var bodyHtml=parseMarkdown(art.body||"");
  var tags=(art.tags||[]).map(function(t){return'<span style="display:inline-block;background:#f0e4bf;color:#1c2b3a;padding:2px 9px;border-radius:10px;font-size:10px;margin-right:4px">'+t+'</span>';}).join("");
  var win=window.open("","_blank");
  if(!win){alert("Please allow pop-ups to download the PDF.");return;}
  win.document.write('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>'+art.title+'</title>');
  win.document.write('<style>@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Playfair+Display:wght@600&display=swap");body{font-family:Inter,sans-serif;max-width:680px;margin:0 auto;padding:48px 40px;color:#1c2b3a;font-size:13px;line-height:1.7}.hdr{background:#1c2b3a;border-radius:10px;padding:28px 32px;margin-bottom:28px}.hdr-cat{font-size:10px;font-weight:700;color:#c9a84c;letter-spacing:.8px;text-transform:uppercase;margin-bottom:8px}.hdr-title{font-family:"Playfair Display",serif;font-size:24px;color:#fff;margin:0 0 12px}.hdr-meta{font-size:11px;color:rgba(255,255,255,.5)}.content h2{font-size:15px;font-weight:700;margin:20px 0 8px;color:#1c2b3a}.content h3{font-size:13px;font-weight:700;margin:16px 0 6px}.content ul{margin:6px 0 10px 20px}.content li{margin-bottom:3px}.footer{margin-top:40px;padding-top:16px;border-top:1px solid #e5dcc8;font-size:10px;color:#999;display:flex;justify-content:space-between}strong{font-weight:700}em{font-style:italic}code{background:#f5f0e8;padding:1px 5px;border-radius:3px;font-size:11px}@media print{body{padding:0}.no-print{display:none}}</style>');
  win.document.write('</head><body>');
  win.document.write('<div class="hdr"><div class="hdr-cat">'+art.category+'</div><div class="hdr-title">'+art.title+'</div><div style="margin-bottom:10px">'+tags+'</div><div class="hdr-meta">ACG Practice Partners – '+new Date().toLocaleDateString()+'</div></div>');
  win.document.write('<div class="content">'+bodyHtml+'</div>');
  win.document.write('<div class="footer"><span>ACG Practice Partners © '+new Date().getFullYear()+'</span><span>acgpracticepartners.com</span></div>');
  win.document.write('<div class="no-print" style="position:fixed;bottom:20px;right:20px"><button onclick="window.print()" style="background:#1c2b3a;color:#fff;border:none;border-radius:8px;padding:10px 22px;font-size:13px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif">Print / Save as PDF</button></div>');
  win.document.write('</body></html>');
  win.document.close();
}


// ══════════════════════════════════════════════════════════════════════════════
// TRAINING PATHS
// ══════════════════════════════════════════════════════════════════════════════

function rHelpPathList(body){
  var h='<div style="max-width:900px;margin:0 auto;padding:20px 16px">';
  h+='<button id="hc-back" style="background:none;border:none;color:var(--navy);font-size:12px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif;padding:0;margin-bottom:16px">\u2190 Back to Help Center</button>';
  h+='<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;flex-wrap:wrap;gap:10px">';
  h+='<div><h2 style="font-family:Playfair Display,serif;font-size:22px;color:var(--navy);margin:0">Training Paths</h2>';
  h+='<p style="margin:4px 0 0;font-size:12px;color:var(--text3)">Curated article collections -- build a path, download as a branded PDF, send to a client</p></div>';
  h+='<button id="tp-new" style="background:var(--navy);color:#fff;border:none;border-radius:8px;padding:9px 18px;font-size:12px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif">+ New Path</button>';
  h+='</div>';

  if(!helpPaths.length){
    h+='<div style="text-align:center;padding:60px 20px;color:var(--text3)">';
    h+='<div style="font-size:36px;margin-bottom:14px">&#x1F5FA;</div>';
    h+='<div style="font-weight:700;font-size:16px;margin-bottom:8px">No training paths yet</div>';
    h+='<div style="font-size:13px;max-width:400px;margin:0 auto">Create a path to bundle articles into a client-ready guide. Download the whole thing as a branded PDF.</div>';
    h+='</div>';
  } else {
    helpPaths.forEach(function(p){
      var arts=p.articleIds?p.articleIds.map(function(id){return helpArticles.filter(function(a){return a.id===id;})[0];}).filter(Boolean):[];
      var sentLog=p.sendLog||[];
      h+='<div class="tp-card" data-id="'+p.id+'" style="background:#fff;border:1px solid var(--tan2);border-radius:12px;padding:18px 20px;margin-bottom:12px;cursor:pointer;transition:box-shadow .15s">';
      h+='<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px">';
      h+='<div style="flex:1">';
      h+='<div style="font-size:16px;font-weight:700;color:var(--navy);margin-bottom:4px">'+esc(p.title)+'</div>';
      if(p.client)h+='<div style="font-size:11px;font-weight:700;color:var(--gold);text-transform:uppercase;letter-spacing:.4px;margin-bottom:6px">&#x1F3E5; '+esc(p.client)+'</div>';
      if(p.description)h+='<div style="font-size:12px;color:var(--text3);margin-bottom:8px">'+esc(p.description)+'</div>';
      h+='<div style="display:flex;gap:12px;flex-wrap:wrap">';
      h+='<span style="font-size:11px;background:var(--tan);color:var(--navy);padding:3px 9px;border-radius:10px;font-weight:600">'+arts.length+' article'+(arts.length!==1?'s':'')+'</span>';
      if(sentLog.length)h+='<span style="font-size:11px;color:var(--text3)">Sent '+sentLog.length+' time'+(sentLog.length!==1?'s':'')+' \u00b7 Last: '+new Date(sentLog[sentLog.length-1].ts).toLocaleDateString()+'</span>';
      h+='</div></div>';
      h+='<div style="display:flex;gap:8px;flex-shrink:0">';
      h+='<button class="tp-edit" data-id="'+p.id+'" style="background:none;border:1px solid var(--tan2);border-radius:6px;padding:6px 12px;font-size:11px;font-weight:600;cursor:pointer;color:var(--navy)">Edit</button>';
      h+='<button class="tp-pdf" data-id="'+p.id+'" style="background:var(--gold);border:none;border-radius:6px;padding:6px 12px;font-size:11px;font-weight:700;cursor:pointer;color:var(--navy)">&#x2B07; PDF</button>';
      h+='</div></div></div>';
    });
  }
  h+='</div>';
  body.innerHTML=h;

  document.getElementById('hc-back').addEventListener('click',function(){helpSubView='articles';helpView='list';render();});
  document.getElementById('tp-new').addEventListener('click',function(){helpPathSelectedId=null;helpPathView='edit';render();});
  document.querySelectorAll('.tp-card').forEach(function(card){
    card.addEventListener('click',function(e){
      if(e.target.classList.contains('tp-edit')||e.target.classList.contains('tp-pdf'))return;
      helpPathSelectedId=this.dataset.id;helpPathView='read';render();
    });
    var editBtn=card.querySelector('.tp-edit');
    if(editBtn)editBtn.addEventListener('click',function(e){e.stopPropagation();helpPathSelectedId=this.dataset.id;helpPathView='edit';render();});
    var pdfBtn=card.querySelector('.tp-pdf');
    if(pdfBtn)pdfBtn.addEventListener('click',function(e){
      e.stopPropagation();
      var p=helpPaths.filter(function(x){return x.id===pdfBtn.dataset.id;})[0];
      if(p)downloadPathPdf(p);
    });
  });
}

function rHelpPathRead(body,p){
  var arts=p.articleIds?p.articleIds.map(function(id){return helpArticles.filter(function(a){return a.id===id;})[0];}).filter(Boolean):[];
  var sentLog=p.sendLog||[];
  var h='<div style="max-width:800px;margin:0 auto;padding:20px 16px">';
  h+='<button id="tp-back" style="background:none;border:none;color:var(--navy);font-size:12px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif;padding:0;margin-bottom:16px">\u2190 Back to Training Paths</button>';
  // Header
  h+='<div style="background:var(--navy);border-radius:12px;padding:24px;margin-bottom:20px">';
  h+='<div style="font-size:10px;font-weight:700;color:var(--gold);letter-spacing:.8px;text-transform:uppercase;margin-bottom:8px">Training Path</div>';
  h+='<h1 style="font-family:Playfair Display,serif;font-size:22px;color:#fff;margin:0 0 8px">'+esc(p.title)+'</h1>';
  if(p.client)h+='<div style="font-size:13px;color:rgba(255,255,255,.7);margin-bottom:6px">&#x1F3E5; Prepared for: <strong style="color:#fff">'+esc(p.client)+'</strong></div>';
  if(p.description)h+='<div style="font-size:12px;color:rgba(255,255,255,.6);margin-top:6px">'+esc(p.description)+'</div>';
  h+='</div>';
  // Article list
  h+='<div style="background:#fff;border:1px solid var(--tan2);border-radius:12px;padding:20px;margin-bottom:16px">';
  h+='<div style="font-size:11px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:14px">'+arts.length+' Article'+(arts.length!==1?'s':'')+' in this path</div>';
  if(!arts.length){
    h+='<div style="color:var(--text3);font-size:13px">No articles added yet. Edit this path to add articles.</div>';
  } else {
    arts.forEach(function(art,i){
      h+='<div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--tan)">';
      h+='<div style="width:24px;height:24px;background:var(--navy);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0">'+(i+1)+'</div>';
      h+='<div style="flex:1"><div style="font-size:13px;font-weight:700;color:var(--navy)">'+esc(art.title)+'</div>';
      h+='<div style="font-size:11px;color:var(--text3)">'+esc(art.category)+'</div></div>';
      h+='<div style="font-size:11px;color:'+(art.clientReady?'#059669':'var(--text3)')+';font-weight:600">'+(art.clientReady?'&#x2713; Client-Ready':'Draft')+'</div>';
      h+='</div>';
    });
  }
  h+='</div>';
  // Send log
  if(sentLog.length){
    h+='<div style="background:#fff;border:1px solid var(--tan2);border-radius:12px;padding:20px;margin-bottom:16px">';
    h+='<div style="font-size:11px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:12px">Send History</div>';
    sentLog.slice().reverse().forEach(function(log){
      h+='<div style="font-size:12px;color:var(--navy);padding:6px 0;border-bottom:1px solid var(--tan)">'+new Date(log.ts).toLocaleDateString()+' \u00b7 '+esc(log.by)+(log.note?' \u00b7 '+esc(log.note):'')+'</div>';
    });
    h+='</div>';
  }
  // Actions
  h+='<div style="display:flex;gap:10px;flex-wrap:wrap">';
  h+='<button id="tp-edit-btn" style="background:var(--navy);color:#fff;border:none;border-radius:8px;padding:11px 20px;font-size:12px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif">Edit Path</button>';
  if(arts.length){
    h+='<button id="tp-pdf-btn" style="background:var(--gold);color:var(--navy);border:none;border-radius:8px;padding:11px 20px;font-size:12px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif">&#x2B07; Download Client PDF</button>';
  }
  h+='</div></div>';
  body.innerHTML=h;

  document.getElementById('tp-back').addEventListener('click',function(){helpPathView='list';render();});
  document.getElementById('tp-edit-btn').addEventListener('click',function(){helpPathView='edit';render();});
  var pdfBtn=document.getElementById('tp-pdf-btn');
  if(pdfBtn)pdfBtn.addEventListener('click',function(){downloadPathPdf(p);});
}

function rHelpPathEdit(body,p){
  var isNew=!p;
  var pa=p||{id:uid(),title:'',description:'',client:'',articleIds:[],sendLog:[],created:Date.now(),updated:Date.now()};
  var clients=(settings.clients||[]);
  var readyArts=helpArticles.filter(function(a){return a.clientReady;});
  var allArts=helpArticles;
  var selectedIds=pa.articleIds||[];

  var h='<div style="max-width:800px;margin:0 auto;padding:20px 16px">';
  h+='<button id="tp-back" style="background:none;border:none;color:var(--navy);font-size:12px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif;padding:0;margin-bottom:16px">\u2190 Back</button>';
  h+='<div style="background:#fff;border:1px solid var(--tan2);border-radius:12px;padding:24px">';
  h+='<h2 style="font-family:Playfair Display,serif;font-size:20px;color:var(--navy);margin:0 0 20px">'+(isNew?'New Training Path':'Edit Training Path')+'</h2>';

  // Title
  h+='<div style="margin-bottom:14px"><label style="font-size:11px;font-weight:700;color:var(--navy);display:block;margin-bottom:5px;text-transform:uppercase;letter-spacing:.4px">Path Title *</label>';
  h+='<input id="tp-title" type="text" value="'+esc(pa.title)+'" placeholder="e.g. Nextech Onboarding Guide" style="width:100%;padding:9px 12px;border:1px solid var(--tan2);border-radius:7px;font-size:14px;font-family:Inter,sans-serif;color:var(--navy);box-sizing:border-box"></div>';

  // Client + Description row
  h+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px">';
  h+='<div><label style="font-size:11px;font-weight:700;color:var(--navy);display:block;margin-bottom:5px;text-transform:uppercase;letter-spacing:.4px">Client / Practice</label>';
  h+='<select id="tp-client" style="width:100%;padding:9px 12px;border:1px solid var(--tan2);border-radius:7px;font-size:13px;font-family:Inter,sans-serif;color:var(--navy)">';
  h+='<option value="">No specific client</option>';
  clients.forEach(function(c){h+='<option value="'+esc(c)+'"'+(pa.client===c?' selected':'')+'>'+esc(c)+'</option>';});
  h+='</select>';
  if(!clients.length)h+='<div style="font-size:11px;color:var(--text3);margin-top:4px">Add clients in Settings</div>';
  h+='</div>';
  h+='<div><label style="font-size:11px;font-weight:700;color:var(--navy);display:block;margin-bottom:5px;text-transform:uppercase;letter-spacing:.4px">Description</label>';
  h+='<input id="tp-desc" type="text" value="'+esc(pa.description||'')+'" placeholder="Optional description for this path" style="width:100%;padding:9px 12px;border:1px solid var(--tan2);border-radius:7px;font-size:13px;font-family:Inter,sans-serif;color:var(--navy);box-sizing:border-box"></div>';
  h+='</div>';

  // Article picker
  h+='<div style="margin-bottom:20px"><label style="font-size:11px;font-weight:700;color:var(--navy);display:block;margin-bottom:10px;text-transform:uppercase;letter-spacing:.4px">Articles in this path <span style="font-weight:400;text-transform:none;letter-spacing:0">(check to add, drag to reorder)</span></label>';

  // Selected articles (in order) with up/down buttons
  h+='<div id="tp-selected-list" style="margin-bottom:12px">';
  if(selectedIds.length){
    selectedIds.forEach(function(id,i){
      var art=helpArticles.filter(function(a){return a.id===id;})[0];
      if(!art)return;
      h+='<div class="tp-sel-item" data-id="'+id+'" style="display:flex;align-items:center;gap:10px;background:var(--navy);color:#fff;border-radius:7px;padding:8px 12px;margin-bottom:6px">';
      h+='<span style="width:20px;height:20px;background:var(--gold);color:var(--navy);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;flex-shrink:0">'+(i+1)+'</span>';
      h+='<span style="flex:1;font-size:12px;font-weight:600">'+esc(art.title)+'</span>';
      h+='<span style="font-size:10px;color:rgba(255,255,255,.5)">'+esc(art.category)+'</span>';
      h+='<button class="tp-move-up" data-id="'+id+'" style="background:rgba(255,255,255,.1);border:none;color:#fff;border-radius:4px;padding:2px 7px;cursor:pointer;font-size:11px">\u2191</button>';
      h+='<button class="tp-move-down" data-id="'+id+'" style="background:rgba(255,255,255,.1);border:none;color:#fff;border-radius:4px;padding:2px 7px;cursor:pointer;font-size:11px">\u2193</button>';
      h+='<button class="tp-remove" data-id="'+id+'" style="background:rgba(255,100,100,.2);border:none;color:#fff;border-radius:4px;padding:2px 7px;cursor:pointer;font-size:11px">\u00d7</button>';
      h+='</div>';
    });
  } else {
    h+='<div style="color:var(--text3);font-size:12px;padding:8px 0">No articles selected yet. Check articles below to add them.</div>';
  }
  h+='</div>';

  // Article checklist (unselected)
  var unselected=allArts.filter(function(a){return selectedIds.indexOf(a.id)<0;});
  if(unselected.length){
    h+='<div style="border:1px solid var(--tan2);border-radius:8px;padding:12px;max-height:260px;overflow-y:auto">';
    h+='<div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">Available Articles</div>';
    unselected.forEach(function(art){
      h+='<label class="tp-add-art" style="display:flex;align-items:center;gap:10px;padding:8px;border-radius:6px;cursor:pointer;transition:background .1s">';
      h+='<input type="checkbox" class="tp-art-check" data-id="'+art.id+'" style="width:15px;height:15px;accent-color:var(--navy)">';
      h+='<span style="flex:1;font-size:12px;font-weight:600;color:var(--navy)">'+esc(art.title)+'</span>';
      h+='<span style="font-size:10px;color:var(--text3)">'+esc(art.category)+'</span>';
      h+='<span style="font-size:10px;color:'+(art.clientReady?'#059669':'var(--text3)')+';font-weight:600">'+(art.clientReady?'Ready':'Draft')+'</span>';
      h+='</label>';
    });
    h+='</div>';
  }
  h+='</div>';

  // Buttons
  h+='<div style="display:flex;gap:10px;flex-wrap:wrap">';
  h+='<button id="tp-save" style="background:var(--navy);color:#fff;border:none;border-radius:8px;padding:11px 24px;font-size:13px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif">'+(isNew?'Create Path':'Save Changes')+'</button>';
  if(!isNew){
    h+='<button id="tp-delete" style="background:none;border:1px solid #fca5a5;color:#dc2626;border-radius:8px;padding:11px 18px;font-size:13px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif">Delete Path</button>';
  }
  h+='</div></div></div>';
  body.innerHTML=h;

  // Current selected IDs (mutable for this edit session)
  var currentIds=selectedIds.slice();

  function refreshSelectedList(){
    // Re-render just the selected list
    var sl=document.getElementById('tp-selected-list');
    if(!sl)return;
    var html='';
    if(currentIds.length){
      currentIds.forEach(function(id,i){
        var art=helpArticles.filter(function(a){return a.id===id;})[0];
        if(!art)return;
        html+='<div class="tp-sel-item" data-id="'+id+'" style="display:flex;align-items:center;gap:10px;background:var(--navy);color:#fff;border-radius:7px;padding:8px 12px;margin-bottom:6px">';
        html+='<span style="width:20px;height:20px;background:var(--gold);color:var(--navy);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;flex-shrink:0">'+(i+1)+'</span>';
        html+='<span style="flex:1;font-size:12px;font-weight:600">'+esc(art.title)+'</span>';
        html+='<span style="font-size:10px;color:rgba(255,255,255,.5)">'+esc(art.category)+'</span>';
        html+='<button class="tp-move-up" data-id="'+id+'" style="background:rgba(255,255,255,.1);border:none;color:#fff;border-radius:4px;padding:2px 7px;cursor:pointer;font-size:11px">\u2191</button>';
        html+='<button class="tp-move-down" data-id="'+id+'" style="background:rgba(255,255,255,.1);border:none;color:#fff;border-radius:4px;padding:2px 7px;cursor:pointer;font-size:11px">\u2193</button>';
        html+='<button class="tp-remove" data-id="'+id+'" style="background:rgba(255,100,100,.2);border:none;color:#fff;border-radius:4px;padding:2px 7px;cursor:pointer;font-size:11px">\u00d7</button>';
        html+='</div>';
      });
    } else {
      html='<div style="color:var(--text3);font-size:12px;padding:8px 0">No articles selected yet.</div>';
    }
    sl.innerHTML=html;
    bindSelectedButtons();
  }

  function bindSelectedButtons(){
    document.querySelectorAll('.tp-move-up').forEach(function(btn){
      btn.addEventListener('click',function(){
        var idx=currentIds.indexOf(this.dataset.id);
        if(idx>0){var tmp=currentIds[idx-1];currentIds[idx-1]=currentIds[idx];currentIds[idx]=tmp;refreshSelectedList();}
      });
    });
    document.querySelectorAll('.tp-move-down').forEach(function(btn){
      btn.addEventListener('click',function(){
        var idx=currentIds.indexOf(this.dataset.id);
        if(idx<currentIds.length-1){var tmp=currentIds[idx+1];currentIds[idx+1]=currentIds[idx];currentIds[idx]=tmp;refreshSelectedList();}
      });
    });
    document.querySelectorAll('.tp-remove').forEach(function(btn){
      btn.addEventListener('click',function(){
        var id=this.dataset.id;
        currentIds=currentIds.filter(function(x){return x!==id;});
        // Re-add to available list
        var art=helpArticles.filter(function(a){return a.id===id;})[0];
        if(art){
          var avail=document.querySelector('[data-id="'+id+'"].tp-add-art');
          if(!avail){
            var cont=document.querySelector('.tp-art-check');
            if(cont&&cont.parentElement&&cont.parentElement.parentElement){
              var row='<label class="tp-add-art" style="display:flex;align-items:center;gap:10px;padding:8px;border-radius:6px;cursor:pointer">';
              row+='<input type="checkbox" class="tp-art-check" data-id="'+id+'" style="width:15px;height:15px;accent-color:var(--navy)">';
              row+='<span style="flex:1;font-size:12px;font-weight:600;color:var(--navy)">'+esc(art.title)+'</span>';
              row+='<span style="font-size:10px;color:var(--text3)">'+esc(art.category)+'</span>';
              row+='<span style="font-size:10px;color:'+(art.clientReady?'#059669':'var(--text3)')+';font-weight:600">'+(art.clientReady?'Ready':'Draft')+'</span>';
              row+='</label>';
              cont.parentElement.parentElement.insertAdjacentHTML('beforeend',row);
              bindCheckboxes();
            }
          }
        }
        refreshSelectedList();
      });
    });
  }

  function bindCheckboxes(){
    document.querySelectorAll('.tp-art-check').forEach(function(cb){
      cb.addEventListener('change',function(){
        if(this.checked){
          var id=this.dataset.id;
          if(currentIds.indexOf(id)<0)currentIds.push(id);
          this.closest('label').remove();
          refreshSelectedList();
        }
      });
    });
  }

  bindSelectedButtons();
  bindCheckboxes();

  document.getElementById('tp-back').addEventListener('click',function(){
    helpPathView=helpPathSelectedId?'read':'list';render();
  });

  document.getElementById('tp-save').addEventListener('click',function(){
    var title=document.getElementById('tp-title').value.trim();
    if(!title){alert('Path title is required.');return;}
    var client=document.getElementById('tp-client').value;
    var desc=document.getElementById('tp-desc').value.trim();
    var now=Date.now();
    if(isNew){
      pa.title=title;pa.client=client;pa.description=desc;
      pa.articleIds=currentIds;pa.updated=now;
      helpPaths.unshift(pa);
    } else {
      var idx=helpPaths.findIndex(function(x){return x.id===pa.id;});
      if(idx>=0){
        helpPaths[idx].title=title;helpPaths[idx].client=client;
        helpPaths[idx].description=desc;helpPaths[idx].articleIds=currentIds;
        helpPaths[idx].updated=now;
      }
    }
    savePaths();
    helpPathSelectedId=pa.id;helpPathView='read';render();
  });

  var delBtn=document.getElementById('tp-delete');
  if(delBtn)delBtn.addEventListener('click',function(){
    if(!confirm('Delete this training path?'))return;
    helpPaths=helpPaths.filter(function(x){return x.id!==pa.id;});
    savePaths();helpPathSelectedId=null;helpPathView='list';render();
  });
}

function downloadPathPdf(p){
  var arts=p.articleIds?p.articleIds.map(function(id){return helpArticles.filter(function(a){return a.id===id;})[0];}).filter(Boolean):[];
  if(!arts.length){alert('No articles in this path.');return;}

  // Log the send
  if(!p.sendLog)p.sendLog=[];
  p.sendLog.push({ts:Date.now(),by:settings.name||'ACG',note:p.client||''});
  var pidx=helpPaths.findIndex(function(x){return x.id===p.id;});
  if(pidx>=0)helpPaths[pidx]=p;
  savePaths();

  var win=window.open('','_blank');
  if(!win){alert('Please allow pop-ups to download the PDF.');return;}

  var css='@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Playfair+Display:wght@600&display=swap");'
    +'*{box-sizing:border-box;margin:0;padding:0}'
    +'body{font-family:Inter,sans-serif;color:#1c2b3a;font-size:13px;line-height:1.7;background:#fff}'
    +'.page{max-width:720px;margin:0 auto;padding:40px}'
    +'.cover{min-height:100vh;display:flex;flex-direction:column;justify-content:center;padding:60px 40px;background:#1c2b3a;color:#fff;page-break-after:always}'
    +'.cover-tag{font-size:10px;font-weight:700;color:#c9a84c;letter-spacing:1.2px;text-transform:uppercase;margin-bottom:20px}'
    +'.cover-title{font-family:"Playfair Display",serif;font-size:36px;line-height:1.2;margin-bottom:16px}'
    +'.cover-client{font-size:14px;color:rgba(255,255,255,.7);margin-bottom:8px}'
    +'.cover-date{font-size:12px;color:rgba(255,255,255,.4);margin-top:auto;padding-top:40px}'
    +'.toc{padding:40px;page-break-after:always}'
    +'.toc h2{font-family:"Playfair Display",serif;font-size:20px;margin-bottom:20px;color:#1c2b3a}'
    +'.toc-item{display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid #f0e4bf}'
    +'.toc-num{width:24px;height:24px;background:#1c2b3a;color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;flex-shrink:0}'
    +'.toc-title{flex:1;font-size:13px;font-weight:600}'
    +'.toc-cat{font-size:11px;color:#999}'
    +'.article{padding:40px;page-break-before:always}'
    +'.art-hdr{background:#1c2b3a;border-radius:10px;padding:24px;margin-bottom:24px}'
    +'.art-cat{font-size:10px;font-weight:700;color:#c9a84c;letter-spacing:.8px;text-transform:uppercase;margin-bottom:8px}'
    +'.art-title{font-family:"Playfair Display",serif;font-size:22px;color:#fff}'
    +'.art-body h2{font-size:15px;font-weight:700;margin:20px 0 8px}'
    +'.art-body h3{font-size:13px;font-weight:700;margin:14px 0 6px}'
    +'.art-body ul{margin:6px 0 10px 20px}'
    +'.art-body li{margin-bottom:3px}'
    +'.art-body p{margin:0 0 8px}'
    +'strong{font-weight:700}em{font-style:italic}'
    +'.footer{position:fixed;bottom:0;left:0;right:0;padding:12px 40px;border-top:1px solid #f0e4bf;display:flex;justify-content:space-between;font-size:10px;color:#999;background:#fff}'
    +'.no-print{position:fixed;bottom:20px;right:20px}'
    +'@media print{.no-print{display:none}.cover{-webkit-print-color-adjust:exact;print-color-adjust:exact}.art-hdr{-webkit-print-color-adjust:exact;print-color-adjust:exact}}';

  var coverHtml='<div class="cover"><div class="cover-tag">ACG Practice Partners \u2014 Training Path</div>';
  coverHtml+='<div class="cover-title">'+esc(p.title)+'</div>';
  if(p.client)coverHtml+='<div class="cover-client">Prepared for: <strong>'+esc(p.client)+'</strong></div>';
  if(p.description)coverHtml+='<div style="font-size:13px;color:rgba(255,255,255,.6);margin-top:8px">'+esc(p.description)+'</div>';
  coverHtml+='<div class="cover-date">'+arts.length+' article'+(arts.length!==1?'s':'')+' \u00b7 Prepared by ACG Practice Partners \u00b7 '+new Date().toLocaleDateString()+'</div></div>';

  var tocHtml='<div class="toc"><h2>Contents</h2>';
  arts.forEach(function(art,i){
    tocHtml+='<div class="toc-item"><div class="toc-num">'+(i+1)+'</div><div class="toc-title">'+esc(art.title)+'</div><div class="toc-cat">'+esc(art.category)+'</div></div>';
  });
  tocHtml+='</div>';

  var articlesHtml='';
  arts.forEach(function(art){
    articlesHtml+='<div class="article"><div class="art-hdr"><div class="art-cat">'+esc(art.category)+'</div><div class="art-title">'+esc(art.title)+'</div></div>';
    articlesHtml+='<div class="art-body">'+parseMarkdown(art.body||'')+'</div></div>';
  });

  win.document.write('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>'+esc(p.title)+'</title><style>'+css+'</style></head><body>');
  win.document.write(coverHtml);
  win.document.write(tocHtml);
  win.document.write(articlesHtml);
  win.document.write('<div class="footer"><span>ACG Practice Partners \u00a9 '+new Date().getFullYear()+'</span><span>acgpracticepartners.com</span></div>');
  win.document.write('<div class="no-print"><button onclick="window.print()" style="background:#1c2b3a;color:#fff;border:none;border-radius:8px;padding:10px 22px;font-size:13px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif">Print / Save as PDF</button></div>');
  win.document.write('</body></html>');
  win.document.close();
}


// ══════════════════════════════════════════════════════════════════════════════
// PRACTICE PROFILES
// ══════════════════════════════════════════════════════════════════════════════

var profileView="list"; // list | detail | edit
var profileSelectedId=null;
