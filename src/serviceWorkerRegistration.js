// src/registerServiceWorker.js
export function register() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/biyori/service-worker.js');
    }
  }
  