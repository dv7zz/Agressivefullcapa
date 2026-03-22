// sw.js - Motor de Persistência Elite V2
const CACHE_NAME = 'auxilio-no-talo-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/engine.js',
  '/enginebundle.js',
  '/manifest.json'
];

// Instalação Imediata (Não espera o usuário fechar o app)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Arquivos de Auxílio em Cache');
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Ativação e Limpeza de Caches Antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Estratégia "Network-First" com Fallback para Cache (Latência Zero)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});