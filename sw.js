/* Offline helper: keeps a copy of the app on the phone. */
var C="unpaid-v1";
var FILES=["./","index.html","manifest.json"];
self.addEventListener("install",function(e){e.waitUntil(caches.open(C).then(function(c){return Promise.all(FILES.map(function(f){return c.add(new Request(f,{cache:"reload"})).catch(function(){})}))}).then(function(){return self.skipWaiting()}))});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!==C}).map(function(x){return caches.delete(x)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener("fetch",function(e){
var r=e.request;if(r.method!=="GET")return;var u=new URL(r.url);if(u.origin!==location.origin)return;
e.respondWith(caches.open(C).then(function(c){return c.match(r,{ignoreSearch:true}).then(function(hit){
var net=fetch(r).then(function(res){if(res&&res.ok)c.put(r,res.clone());return res}).catch(function(){return hit});
return hit||net})}))});
