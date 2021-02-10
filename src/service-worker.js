self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

["/readings/"].forEach((mask) => {
  workbox.routing.registerRoute(new RegExp(mask), new workbox.strategies.CacheFirst({ cacheName: "dynamic" }));
});
