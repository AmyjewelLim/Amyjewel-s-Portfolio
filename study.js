function $(sel){return document.querySelector(sel)}

const STORAGE_POSTS = 'study_posts_v1'
const STORAGE_MESSAGES = 'study_messages_v1'

function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,6)}

function loadPosts(){try{return JSON.parse(localStorage.getItem(STORAGE_POSTS)||'[]')}catch{return []}}
function savePosts(posts){localStorage.setItem(STORAGE_POSTS,JSON.stringify(posts))}

function loadMessages(){try{return JSON.parse(localStorage.getItem(STORAGE_MESSAGES)||'[]')}catch{return []}}
function saveMessages(m){localStorage.setItem(STORAGE_MESSAGES,JSON.stringify(m))}

function currentUser(){const el = $('#current-user'); if(!el) return 'Anonymous'; return el.value.trim() || 'Anonymous'}

function renderPosts(){const posts = loadPosts(); const container = $('#posts'); container.innerHTML='';
  posts.slice().reverse().forEach(p=>{
    const el = document.createElement('article'); el.className='post';
    el.innerHTML = `
      <div class="meta"><div><strong>${escapeHtml(p.author||'Anonymous')}</strong> • ${new Date(p.ts).toLocaleString()}</div><div class="type">${escapeHtml(p.type)}</div></div>
      <div class="content">${escapeHtml(p.text)}</div>
    `
    if(p.media){
      const mWrapper = document.createElement('div');
      if(p.mediaType && p.mediaType.startsWith('video')){
        const v = document.createElement('video'); v.src=p.media; v.controls=true; v.style.maxWidth='100%'; mWrapper.appendChild(v)
      } else {
        const i = document.createElement('img'); i.src=p.media; mWrapper.appendChild(i)
      }
      el.appendChild(mWrapper)
    }
    // replies
    const replies = document.createElement('div'); replies.className='replies';
    (p.replies||[]).forEach(r=>{
      const d = document.createElement('div'); d.className='reply'; d.innerHTML = `<div><strong>${escapeHtml(r.author)}</strong> • ${new Date(r.ts).toLocaleString()}</div><div>${escapeHtml(r.text)}</div>`;
      replies.appendChild(d)
    })
    // reply form
    const rf = document.createElement('div'); rf.className='reply-form';
    const input = document.createElement('input'); input.placeholder='Write a reply...';
    const btn = document.createElement('button'); btn.className='reply-button'; btn.textContent='Reply';
    btn.addEventListener('click',()=>{
      const text = input.value.trim(); if(!text) return; addReply(p.id,{id:uid(),author:currentUser(),text,ts:Date.now()}); input.value='';
    })
    rf.appendChild(input); rf.appendChild(btn);
    el.appendChild(replies); el.appendChild(rf);

    container.appendChild(el);
  })
}

function addReply(postId, reply){const posts = loadPosts(); const idx = posts.findIndex(p=>p.id===postId); if(idx===-1) return; posts[idx].replies = posts[idx].replies||[]; posts[idx].replies.push(reply); savePosts(posts); renderPosts();}

function addPost(obj){const posts = loadPosts(); posts.push(obj); savePosts(posts); renderPosts(); buildContacts();}

function escapeHtml(s){if(!s) return ''; return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}

// composer handlers
$('#post-media')?.addEventListener('change', (ev)=>{
  const file = ev.target.files[0]; const preview = $('#media-preview'); preview.innerHTML='';
  if(!file) return; const fr = new FileReader(); fr.onload = e=>{
    if(file.type.startsWith('video')){
      const v=document.createElement('video'); v.src=e.target.result; v.controls=true; preview.appendChild(v)
    } else {
      const i=document.createElement('img'); i.src=e.target.result; preview.appendChild(i)
    }
    preview.dataset.data = e.target.result; preview.dataset.type = file.type;
  }; fr.readAsDataURL(file);
})

$('#add-post')?.addEventListener('click', ()=>{
  const text = $('#post-text').value.trim(); const type = $('#post-type').value; const media = $('#media-preview').dataset.data; const mediaType = $('#media-preview').dataset.type;
  const obj = {id:uid(),author:currentUser(),text,type,media:media||null,mediaType:mediaType||null,ts:Date.now(),replies:[]}
  addPost(obj);
  // clear
  $('#post-text').value=''; $('#post-media').value=''; $('#media-preview').innerHTML=''; delete $('#media-preview').dataset.data; delete $('#media-preview').dataset.type;
})

// contacts and messaging
function buildContacts(){const contacts = new Set(); const posts = loadPosts(); posts.forEach(p=>contacts.add(p.author||'Anonymous')); const messages = loadMessages(); messages.forEach(m=>{contacts.add(m.from);contacts.add(m.to)});
  const list = $('#contacts-list'); list.innerHTML=''; Array.from(contacts).filter(Boolean).forEach(name=>{
    const el = document.createElement('div'); el.className='contact'; el.textContent = name; el.addEventListener('click',()=>openConversation(name)); list.appendChild(el)
  })
}

function openConversation(name){$('#message-to').value = name; renderMessages(name)}

function renderMessages(contactName){const win = $('#messages-window'); win.innerHTML=''; const me = currentUser(); const msgs = loadMessages().filter(m=> (m.from===me && m.to===contactName) || (m.from===contactName && m.to===me)); msgs.sort((a,b)=>a.ts-b.ts).forEach(m=>{
  const d = document.createElement('div'); d.className = 'message '+(m.from===me?'me':'them'); d.innerHTML = `<div><strong>${escapeHtml(m.from)}</strong></div><div>${escapeHtml(m.text)}</div>`; win.appendChild(d)
})
  win.scrollTop = win.scrollHeight;
}

$('#send-message')?.addEventListener('click', ()=>{
  const to = $('#message-to').value.trim(); const text = $('#message-text').value.trim(); if(!to || !text) return; const m = {id:uid(),from:currentUser(),to,text,ts:Date.now()}; const arr = loadMessages(); arr.push(m); saveMessages(arr); $('#message-text').value=''; renderMessages(to); buildContacts();
})

// sample data
function initSamplePosts(){
  const posts = [
    {id:uid(),author:'Sarah Johnson',text:'Can someone help me with the quadratic formula? I don\'t understand how to apply it to x² + 5x + 6 = 0',type:'question',media:null,mediaType:null,ts:Date.now()-3600000,replies:[{id:uid(),author:'Mike Chen',text:'Sure! First identify a=1, b=5, c=6. Then plug into x = (-b ± √(b²-4ac))/2a',ts:Date.now()-3000000}]},
    {id:uid(),author:'James Wu',text:'My essay on Shakespeare is due tomorrow. How do I write a thesis statement about Hamlet\'s madness?',type:'question',media:null,mediaType:null,ts:Date.now()-7200000,replies:[]},
    {id:uid(),author:'Emma Davis',text:'Quick tip: Always start with your main argument, then pick 2-3 pieces of evidence to support it. That\'s your thesis!',type:'tip',media:null,mediaType:null,ts:Date.now()-5400000,replies:[{id:uid(),author:'Olivia Martinez',text:'This is so helpful, thank you!',ts:Date.now()-4800000}]},
    {id:uid(),author:'Alex Kumar',text:'Can someone explain photosynthesis and cellular respiration? The difference is confusing me.',type:'question',media:null,mediaType:null,ts:Date.now()-10800000,replies:[]},
    {id:uid(),author:'Lucas Thompson',text:'Photosynthesis is energy IN (CO2 + light → glucose), respiration is energy OUT (glucose → ATP + CO2). Opposite processes!',type:'lecture',media:null,mediaType:null,ts:Date.now()-9600000,replies:[]},
    {id:uid(),author:'Sophie Lee',text:'Does anyone know how to solve for y in 3x + 2y = 12?',type:'question',media:null,mediaType:null,ts:Date.now()-8400000,replies:[{id:uid(),author:'David Brown',text:'Isolate y: subtract 3x from both sides, then divide by 2. y = (12 - 3x) / 2',ts:Date.now()-7800000}]},
    {id:uid(),author:'Rachel Green',text:'Important: Always show your working on math problems. Even if you get the wrong answer, you\'ll get partial credit.',type:'tip',media:null,mediaType:null,ts:Date.now()-6000000,replies:[]},
  ];
  savePosts(posts);
}

// initial bootstrap
document.addEventListener('DOMContentLoaded',()=>{
  // initialize sample posts if empty
  if(loadPosts().length === 0) initSamplePosts();
  
  // try to set last user
  const lastUser = localStorage.getItem('study_user'); if(lastUser) $('#current-user').value = lastUser;
  $('#current-user').addEventListener('input', e=>localStorage.setItem('study_user', e.target.value));
  renderPosts(); buildContacts();
})
