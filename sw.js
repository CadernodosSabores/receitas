/* Caderno dos Sabores – app instalável, conteúdo sincronizado com o site publicado */
const APP_CACHE='sabores-shell-v1';
const IMAGE_CACHE='sabores-fotos-v1';
const ROOT=new URL('./',self.registration.scope);
const CORE=['./index.html','./manifest.webmanifest','./fotos/compartilhados/app-icon-192.png','./fotos/compartilhados/app-icon-512.png'];

self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(APP_CACHE);
    await cache.addAll(CORE);
    await self.skipWaiting();
  })());
});
self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k.startsWith('sabores-')&&!([APP_CACHE,IMAGE_CACHE].includes(k))).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});
async function saveAndReturn(cacheName,request,response){
  if(response&&response.ok&&response.type==='basic'){
    const cache=await caches.open(cacheName);
    await cache.put(request,response.clone());
  }
  return response;
}
self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET')return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin)return;
  if(!url.pathname.startsWith(ROOT.pathname))return;

  if(request.mode==='navigate'){
    event.respondWith((async()=>{
      const cache=await caches.open(APP_CACHE);
      try{
        // Site online é prioritário: conteúdo novo é visto no próximo acesso.
        const response=await fetch(request,{cache:'no-store'});
        if(response.ok)await cache.put(new URL('./index.html',ROOT).href,response.clone());
        return response;
      }catch(error){
        return (await cache.match(new URL('./index.html',ROOT).href))||Response.error();
      }
    })());
    return;
  }
  if(request.destination==='image'){
    event.respondWith((async()=>{
      const cache=await caches.open(IMAGE_CACHE);
      // Fotos atualizadas do site são prioritárias quando há internet.
      try{
        const response=await fetch(request,{cache:'no-cache'});
        if(response.ok&&response.type==='basic'){
          await cache.put(request,response.clone());
          const keys=await cache.keys();
          if(keys.length>100)await cache.delete(keys[0]);
        }
        return response;
      }catch{
        return (await cache.match(request))||Response.error();
      }
    })());
    return;
  }
  // Manifest e recursos auxiliares: buscar a versão publicada e recorrer ao cache sem internet.
  event.respondWith((async()=>{
    const cache=await caches.open(APP_CACHE);
    try{return await saveAndReturn(APP_CACHE,request,await fetch(request))}
    catch{return (await cache.match(request))||Response.error()}
  })());
});
