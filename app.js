const C=window.BLOOM_CONFIG,K='bloom_v1',$=s=>document.querySelector(s);
const def=()=>({name:C.herName,garden:[],today:{},discover:{strengths:[],proud:[],explore:[],answers:{}},dreams:[],bucket:[],vision:[],letters:[],story:[],seen:false,pin:null});
let S=Object.assign(def(),JSON.parse(localStorage.getItem(K)||'{}')),tab='today',draft={type:'win',photo:null};
const save=()=>{try{localStorage.setItem(K,JSON.stringify(S))}catch(e){toast('Storage is full 😬 Export a backup and remove a few photos.')}clearTimeout(save.t);save.t=setTimeout(syncPool,600)};
const uid=()=>Math.random().toString(36).slice(2,9),esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const today=()=>new Date().toLocaleDateString('en-CA'),dIdx=()=>Math.floor((Date.now()-new Date().getTimezoneOffset()*6e4)/864e5);
const get=p=>p.split('.').reduce((o,k)=>o[k],S),rnd=(a,b)=>a+Math.random()*(b-a),pick=a=>a[dIdx()%a.length];
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('on'),2600)}
// 🌱 garden: flowers (ground) and stars (sky), tied to a source id so deleting an item removes its flower
const FL=['🌷','🌸','🌼','🌻','🌺','🪻','🌹','💐','🪷'];
function grow(src,star,label){if(S.garden.some(g=>g.src===src))return;S.garden.push({src,s:star,e:star?'⭐':FL[Math.floor(rnd(0,FL.length))],x:rnd(7,93),y:star?rnd(8,36):rnd(54,92),l:label});toast(star?'A new star appeared ✨':'A flower grew in your garden 🌷')}
const ungrow=src=>{S.garden=S.garden.filter(g=>g.src!==src)};
const garden=()=>{const f=S.garden.filter(g=>!g.s).length,s=S.garden.length-f;return `<div class="garden">${S.garden.map(g=>`<i class="${g.s?'s':''}" style="left:${g.x}%;top:${g.y}%" data-a="gl" data-l="${esc(g.l)}">${g.e}</i>`).join('')}${S.garden.length?'':'<div class="empty">Your garden is waiting for its first flower 🌱</div>'}</div><p class="gc">${f} flowers · ${s} stars. Tap one to remember it.</p>`};
function photo(cb){const i=document.createElement('input');i.type='file';i.accept='image/*';i.onchange=()=>{const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const k=Math.min(1,800/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=im.width*k;c.height=im.height*k;c.getContext('2d').drawImage(im,0,0,c.width,c.height);cb(c.toDataURL('image/jpeg',.72))};im.src=r.result};if(i.files[0])r.readAsDataURL(i.files[0])};i.click()}
// 💭 memories & reminders
const pool=()=>{const T={win:'🏆 You did this',memory:'📸 Remember this?',funny:'😂 This was funny',milestone:'🎉 A milestone'},a=[];S.story.forEach(s=>s.t&&a.push({t:T[s.type],b:s.t}));S.discover.proud.forEach(x=>a.push({t:'🏆 You\'re proud of this',b:x.t}));S.discover.strengths.forEach(x=>a.push({t:'💪 One of your strengths',b:x.t}));S.dreams.forEach(x=>!x.done&&a.push({t:'🌠 Your dream',b:x.t}));return a};
const memCard=()=>{const p=pool();if(!p.length)return'';const m=p[dIdx()%p.length];return `<section class=card><h4>${m.t}</h4><p class=big>${esc(m.b)}</p></section>`};
const reg=()=>navigator.serviceWorker&&navigator.serviceWorker.ready;
const syncPool=()=>{try{caches.open('bloom-data').then(c=>c.put('pool.json',new Response(JSON.stringify(pool()))))}catch(e){}};
async function notify(m){const r=await reg();if(r&&'Notification' in window&&Notification.permission==='granted')r.showNotification(m.t,{body:m.b,icon:'icon-192.png',badge:'icon-192.png',tag:'bloom'});else toast('Turn on reminders first 🔔')}
async function toggleRemind(){if(S.remind){S.remind=false;try{await(await reg()).periodicSync.unregister('bloom-remind')}catch(e){}save();settings();return}
if(!('Notification' in window)){toast('This browser doesn\'t support notifications');return}
if(await Notification.requestPermission()!=='granted'){toast('Notifications are blocked. Allow them in your browser settings.');return}
S.remind=true;try{await(await reg()).periodicSync.register('bloom-remind',{minInterval:864e5})}catch(e){}syncPool();save();settings();toast('Reminders are on 🔔')}
// 📲 install
let dip=null;addEventListener('beforeinstallprompt',e=>{e.preventDefault();dip=e});addEventListener('appinstalled',()=>toast('Bloom is installed 🌷'));
const standalone=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone;
async function install(){if(dip){dip.prompt();await dip.userChoice;dip=null;return}modal(`<h3>Add Bloom to your home screen</h3><p><b>Android (Chrome):</b> tap ⋮, then "Install app".\n<b>iPhone (Safari):</b> tap Share, then "Add to Home Screen".</p>`)}
// generic editable list
const list=(path,ph,{chk,star,l}={})=>`<ul>${get(path).map(x=>`<li>${chk?`<input type=checkbox data-a=tick data-k="${path}" data-id="${x.id}" ${x.done?'checked':''}>`:''}<span class="${x.done?'done':''}">${esc(x.t)}</span><button class=x data-a=del data-k="${path}" data-id="${x.id}">✕</button></li>`).join('')}</ul><div class=row><input type=text placeholder="${ph}" data-in="${path}"><button class=btn data-a=add data-k="${path}" data-s="${star?1:''}" data-l="${chk?1:''}">Add</button></div>`;
const V={
today(){let t=S.today;if(t.date!==today())t=S.today={date:today(),done:false,ans:''};return `${garden()}
<section class=card><h3>☀️ Good morning, ${esc(S.name)}</h3><p class=big>${pick(C.dailyMessages)}</p></section>
${memCard()}
<section class=card><h4>Today's question</h4><p>${pick(C.questions)}</p><textarea data-bind="today.ans" placeholder="Just for you…">${esc(t.ans||'')}</textarea></section>
<section class=card><h4>Tiny challenge</h4><label class=chk><input type=checkbox data-a=chal ${t.done?'checked':''}>${pick(C.challenges)}</label></section>
<section class=card><h4>Something to look forward to</h4><p>${pick(C.lookForward)}</p></section>`},
discover(){return `<section class=card><h3>✨ Discover yourself</h3><p class=sub>No right answers. Just you.</p></section>
<section class=card><h4>💪 My strengths</h4>${list('discover.strengths','I\'m great at…')}</section>
<section class=card><h4>🏆 Things I'm proud of</h4>${list('discover.proud','I\'m proud that I…')}</section>
<section class=card><h4>🔭 I want to explore</h4>${list('discover.explore','I\'m curious about…',{star:1})}</section>
${C.discoverQuestions.map((q,i)=>`<section class=card><h4>${esc(q)}</h4><textarea data-bind="discover.answers.q${i}" placeholder="Write whatever comes…">${esc(S.discover.answers['q'+i]||'')}</textarea></section>`).join('')}`},
dream(){return `<section class=card><h3>🚀 Dream big</h3><p class=sub>No deadlines. No pressure. Just possibilities. Every dream becomes a star.</p></section>
<section class=card><h4>🌠 My dreams</h4>${list('dreams','One day I want to…',{chk:1,star:1})}</section>
<section class=card><h4>🗒️ Bucket list</h4>${list('bucket','Before I get old and grey…',{chk:1,star:1})}</section>
<section class=card><h4>🖼️ Vision board</h4><p class=sub>Pictures of the life you imagine.</p><div class=grid>${S.vision.map(v=>`<figure><img src="${v.p}" alt=""><figcaption>${esc(v.t)}</figcaption><button class=x data-a=del data-k=vision data-id=${v.id}>✕</button></figure>`).join('')}</div><button class="btn alt" data-a=vis>+ Add a picture</button></section>`},
letters(){return `<section class=card><h3>💌 A little reminder</h3><p class=sub>For the days you need it.</p>${C.letters.map((l,i)=>`<button class="btn alt" style="display:block;width:100%;margin:8px 0;text-align:left" data-a=open data-i=${i}>💌 ${esc(l.title)}</button>`).join('')}</section>
<section class=card><h4>✍️ Letters to my future self</h4>${S.letters.map(l=>`<li><span data-a=read data-id=${l.id}>💌 ${esc(l.t.slice(0,40))}… <small class=date>${l.d}</small></span><button class=x data-a=del data-k=letters data-id=${l.id}>✕</button></li>`).join('')}<textarea id=fl placeholder="Dear future me…"></textarea><button class=btn data-a=sendletter>Save letter</button></section>`},
story(){const T={win:'🏆 Win',memory:'📸 Memory',funny:'😂 Funny',milestone:'🎉 Milestone'};return `<section class=card><h3>📸 My story</h3><p class=sub>Proof that you're growing, even when it doesn't feel like it.</p>
<div class=chips>${Object.entries(T).map(([k,v])=>`<button class="chip ${draft.type===k?'on':''}" data-a=type data-t=${k}>${v}</button>`).join('')}</div>
<textarea id=st placeholder="What happened?"></textarea>${draft.photo?`<img class=photo src="${draft.photo}" alt="">`:''}
<div class=row><button class="btn ghost" data-a=sp>📷 ${draft.photo?'Change':'Add'} photo</button><button class=btn data-a=addstory>Save</button></div></section>
${S.story.map(s=>`<section class=card>${s.p?`<img class=photo src="${s.p}" alt="">`:''}<p><b>${T[s.type]}</b> <span class=date>${s.d}</span></p><p>${esc(s.t)}</p><button class=x data-a=del data-k=story data-id=${s.id}>✕ remove</button></section>`).join('')}`}};
const NAV=[['today','☀️','Today'],['discover','✨','Discover'],['dream','🚀','Dream'],['letters','💌','Letters'],['story','📸','Story']];
function render(){$('#tag').textContent=C.tagline;$('#nav').innerHTML=NAV.map(n=>`<button class="${tab===n[0]?'on':''}" data-a=tab data-t=${n[0]}><span>${n[1]}</span>${n[2]}</button>`).join('');$('#view').innerHTML=V[tab]();save()}
function modal(h){const m=$('#modal');m.innerHTML=`<div class=sheet>${h}<button class="btn ghost" data-a=close style="margin-top:14px">Close</button></div>`;m.hidden=false}
// 🔒 PIN
const hash=async p=>{try{const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode('bloom'+p));return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}catch(e){return'p'+p}};
function pad(title,cb,host='#lock'){const h=$(host);let v='';h.hidden=false;const draw=()=>{h.innerHTML=`<h2>${title}</h2><div class=dots>${[0,1,2,3].map(i=>`<b class="${i<v.length?'f':''}"></b>`).join('')}</div><div class=pad>${[1,2,3,4,5,6,7,8,9,'',0,'⌫'].map(k=>`<button ${k===''?'style=visibility:hidden':''} data-k="${k}">${k}</button>`).join('')}</div>${host==='#lock'&&!S.pin?'':'<button class="btn ghost" id=pc style="margin-top:20px">Cancel</button>'}`;h.querySelectorAll('.pad button').forEach(b=>b.onclick=async()=>{const k=b.dataset.k;if(k==='⌫')v=v.slice(0,-1);else if(k&&v.length<4)v+=k;draw();if(v.length===4){const ok=await cb(v);if(ok===false){v='';toast('Try again');draw()}else h.hidden=true}});const c=$('#pc');if(c)c.onclick=()=>h.hidden=true};draw()}
const lockCheck=()=>pad('Enter your PIN 🔒',async v=>(v===C.rescueCode||await hash(v)===S.pin)?true:false);
function setPin(){pad('Choose a 4-digit PIN',v1=>{setTimeout(()=>pad('Type it again',async v2=>{if(v1!==v2){toast('They didn\'t match');return false}S.pin=await hash(v2);save();toast('PIN saved 🔒')}),50);return true})}
// 🎂 birthday
function bday(){const b=$('#bday');b.hidden=false;b.innerHTML=`<h2>${esc(C.birthdayTitle)}</h2><p>${esc(C.birthdayMessage)}</p><button class=btn data-a=bdone>${esc(C.birthdayButton)}</button>`;for(let i=0;i<40;i++){const s=document.createElement('span');s.className='cf';s.textContent=['🌷','🎉','✨','🌸','🎈','💛'][i%6];s.style.cssText=`left:${rnd(0,100)}%;animation-duration:${rnd(3,7)}s;animation-delay:${rnd(0,3)}s`;b.appendChild(s)}}
// ⚙️ settings & backup
function settings(){modal(`<h3>⚙️ Settings</h3><p class=sub>Everything is stored only on this phone. No accounts, no cloud.</p>
${standalone()?'<p>✅ Bloom is installed on this phone.</p>':'<button class="btn" data-a=install style="margin-bottom:14px">📲 Install Bloom on this phone</button>'}
<h4>🔔 Reminders</h4><p class=sub>Bloom gently reminds you of things you wrote: funny moments, wins, strengths, dreams.</p><button class="btn ${S.remind?'alt':''}" data-a=remind>${S.remind?'Reminders are on (tap to turn off)':'Turn on reminders'}</button>${S.remind?'<button class="btn ghost" data-a=testn style="margin-left:6px">Send a test</button>':''}
<h4 style="margin-top:16px">Backup</h4><button class="btn" data-a=exp>💾 Save a backup file</button><button class="btn alt" data-a=imp style="margin-left:6px">📂 Restore backup</button>
<h4 style="margin-top:16px">PIN lock</h4><button class="btn ghost" data-a=setpin>${S.pin?'Change PIN':'Set a PIN'}</button>${S.pin?'<button class="btn ghost" data-a=nopin style="margin-left:6px">Remove PIN</button>':''}
<h4 style="margin-top:16px">Other</h4><button class="btn ghost" data-a=replay>🎂 Replay the birthday page</button>`)}
function exp(){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(S)],{type:'application/json'}));a.download=`bloom-backup-${today()}.json`;a.click();toast('Backup saved to your downloads 💾')}
function imp(){const i=document.createElement('input');i.type='file';i.accept='.json,application/json';i.onchange=()=>{const r=new FileReader();r.onload=()=>{try{const d=JSON.parse(r.result);if(!d.garden||!d.discover)throw 0;S=Object.assign(def(),d);save();$('#modal').hidden=true;render();toast('Backup restored 🌷')}catch(e){toast('That doesn\'t look like a Bloom backup')}};if(i.files[0])r.readAsText(i.files[0])};i.click()}
// events
document.addEventListener('click',async e=>{const el=e.target.closest('[data-a]');if(!el)return;const d=el.dataset,a=d.a,arr=d.k&&get(d.k);
if(a==='tab'){tab=d.t;render();scrollTo(0,0)}
else if(a==='gl')toast(d.l);else if(a==='close')$('#modal').hidden=true;else if(a==='settings')settings();
else if(a==='chal'){S.today.done=el.checked;el.checked?grow('chal'+today(),0,'A tiny challenge you did 🎯'):ungrow('chal'+today());render()}
else if(a==='add'){const i=document.querySelector(`[data-in="${d.k}"]`),t=i.value.trim();if(!t)return;const o={id:uid(),t};arr.push(o);if(d.s)grow(o.id,1,t);else if(d.k!=='dreams'&&d.k!=='bucket')grow(o.id,0,t);render()}
else if(a==='tick'){const o=arr.find(x=>x.id===d.id);o.done=el.checked;o.done?grow(o.id+'d',0,'Came true: '+o.t):ungrow(o.id+'d');render()}
else if(a==='del'){const i=arr.findIndex(x=>x.id===d.id);arr.splice(i,1);ungrow(d.id);ungrow(d.id+'d');render()}
else if(a==='vis')photo(p=>{S.vision.push({id:uid(),p,t:prompt('Add a caption (optional)')||''});render()});
else if(a==='open'){const l=C.letters[d.i];modal(`<h3>💌 ${esc(l.title)}</h3><p>${esc(l.body)}</p><p style="margin-top:12px"><i>${esc(C.fromName)}</i></p>`)}
else if(a==='read'){const l=S.letters.find(x=>x.id===d.id);modal(`<p class=date>${l.d}</p><p>${esc(l.t)}</p>`)}
else if(a==='sendletter'){const t=$('#fl').value.trim();if(!t)return;S.letters.unshift({id:uid(),t,d:today()});toast('Letter saved for future you 💌');render()}
else if(a==='type'){draft.type=d.t;draft.text=$('#st').value;render();$('#st').value=draft.text}
else if(a==='sp'){const v=$('#st').value;photo(p=>{draft.photo=p;render();$('#st').value=v})}
else if(a==='addstory'){const t=$('#st').value.trim();if(!t&&!draft.photo)return;const o={id:uid(),type:draft.type,t,p:draft.photo,d:today()};S.story.unshift(o);grow(o.id,0,t||'A happy memory');draft.photo=null;render()}
else if(a==='bdone'){S.seen=true;save();$('#bday').hidden=true}
else if(a==='exp')exp();else if(a==='imp')imp();
else if(a==='setpin'){$('#modal').hidden=true;setPin()}else if(a==='nopin'){S.pin=null;save();settings();toast('PIN removed')}
else if(a==='install')install();else if(a==='remind')toggleRemind();
else if(a==='testn'){const p=pool();notify(p.length?p[Math.floor(Math.random()*p.length)]:{t:'Hello from Bloom 🌷',b:'Reminders are working! Add some memories and I\'ll remind you of them.'})}
else if(a==='replay'){$('#modal').hidden=true;bday()}});
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.dataset.in){document.querySelector(`[data-a=add][data-k="${e.target.dataset.in}"]`).click()}});
document.addEventListener('input',e=>{const p=e.target.dataset.bind;if(!p)return;const k=p.split('.'),l=k.pop();k.reduce((o,x)=>o[x],S)[l]=e.target.value;save()});
render();if(S.pin)lockCheck();if(!S.seen)bday();
