const cacheAvailable = 'caches' in self;
const requests = [/*::requests::*/];

if(cacheAvailable) {
  getCache();
}

async function getCache() {
  const cache = await caches.open('szn-cache-::version::');
  requests.forEach(request => {
    cache.add(new Request(request));
  });
}
