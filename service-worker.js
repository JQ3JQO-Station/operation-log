// ================================================================
// OPERATION LOG Service Worker
// Version  : 2.2.1
// Updated  : 2026-03-28
// Author   : JQ3JQO / KyotoDR120
// Changes  : 2.0.8 フェッチ戦略をネットワーク優先に変更
//            2.0.4 SW_VERSIONをHTMLと同期
//            2.0.0 初回正式リリース
// ★ バージョン変更時はSW_VERSIONとHTMLのVERSIONを合わせること
// ================================================================

// ============================================================
// ★ Service Worker バージョン ★
// HTMLのVERSIONと合わせて更新してください
const SW_VERSION = '2.2.1';
// ============================================================

const CACHE_NAME = 'oplog-cache-v' + SW_VERSION;

const CACHE_FILES = [
  '/operation-log/',
  '/operation-log/index.html',
  '/operation-log/operation_log_v2.html',
  '/operation-log/operation_log_lo.html',
];

// インストール：新バージョンのキャッシュを作成
self.addEventListener('install', event => {
  console.log('[SW] Installing version:', SW_VERSION);
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(CACHE_FILES);
    }).then(() => {
      // 旧バージョンを待たずに即座に有効化
      return self.skipWaiting();
    })
  );
});

// アクティベート：古いバージョンのキャッシュを削除
self.addEventListener('activate', event => {
  console.log('[SW] Activating version:', SW_VERSION);
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          })
      );
    }).then(() => {
      // 全クライアントを即座にコントロール下に置く
      return self.clients.claim();
    })
  );
});

// フェッチ：ネットワーク優先、失敗時はキャッシュから返す
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).then(response => {
      // 成功したらキャッシュを更新して返す
      if (response && response.status === 200 && response.type === 'basic') {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
      }
      return response;
    }).catch(() => {
      // オフライン時はキャッシュから返す
      return caches.match(event.request).then(cached => {
        return cached || caches.match('/operation-log/operation_log_lo.html');
      });
    })
  );
});
