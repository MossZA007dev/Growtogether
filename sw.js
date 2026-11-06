'use strict';

const root = self.registration.scope;
const prefix = 'glow-together:'+root+':';
const cacheName = prefix+'v6';
const files = new Map(['','app.js','ritual.svg','touch-icon.png','manifest.webmanifest'].map(path=>[new URL(path,root).href,path]));

self.addEventListener('install', event=>{
  event.waitUntil((async()=>{
    const responses = await Promise.all([...files].map(async ([url,path])=>{
      const response = await fetch(url,{cache:'reload'});
      if (!response.ok || response.redirected) throw new Error('App file unavailable');
      if (path==='' && !(await response.clone().text()).includes('name="glow-app-shell"')) {
        throw new Error('App entry unavailable');
      }
      if (path==='app.js' && !/(?:javascript|ecmascript)/i.test(response.headers.get('content-type') || '')) {
        throw new Error('App script unavailable');
      }
      return [url,response];
    }));
    const cache = await caches.open(cacheName);
    await Promise.all(responses.map(([url,response])=>cache.put(url,response)));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', event=>{
  event.waitUntil((async()=>{
    const names = await caches.keys();
    await Promise.all(names.filter(name=>name.startsWith(prefix) && name!==cacheName).map(name=>caches.delete(name)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event=>{
  const {request} = event;
  if (request.method!=='GET') return;
  const url = new URL(request.url);
  const key = url.origin+url.pathname;
  const appPage = request.mode==='navigate' && (key===root || key===new URL('index.html',root).href);
  if (!appPage && !files.has(key)) return;
  event.respondWith(fetch(request).catch(async ()=>{
    const cache = await caches.open(cacheName);
    return await cache.match(appPage?root:key) ?? Response.error();
  }));
});
