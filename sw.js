// Bump the version number when you update files so her phone picks up the changes.
const V='bloom-v3',F=['./','index.html','style.css','app.js','config.js','manifest.json','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(F)));self.skipWaiting()});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V&&x!=='bloom-data').map(x=>caches.delete(x)))).then(()=>clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(V).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request)))});

// 🔔 reminders: Chrome wakes this roughly once a day (installed app on Android)
self.addEventListener('periodicsync',e=>{if(e.tag==='bloom-remind')e.waitUntil((async()=>{const r=await(await caches.open('bloom-data')).match('pool.json');const p=r?await r.json():[];if(!p.length)return;const m=p[Math.floor(Math.random()*p.length)];await self.registration.showNotification(m.t,{body:m.b,icon:'icon-192.png',badge:'icon-192.png',tag:'bloom'})})())});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(clients.matchAll({type:'window'}).then(c=>c.length?c[0].focus():clients.openWindow('./')))});
