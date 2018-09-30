const version = 'v0.01';
const staticCacheName = 'staticfiles';

addEventListener('install', installEvent => {
    installEvent.waitUntil(
        caches.open(staticCacheName)
        .then( staticCache => {
            return staticCache.addAll([
                'https://camptriangle.co.uk/__data/assets/git_bridge/0005/131/Images/ct-favicon.png',
                'https://fonts.googleapis.com/css?family=Raleway:400,600,700',
                'https://camptriangle.co.uk/__data/assets/css_file_folder/0006/132/Styles.min.css?v=0.1.44',
                'https://camptriangle.co.uk/__data/assets/js_file_folder/0016/2338/head-scripts.js?v=0.1.11',
                'https://camptriangle.co.uk/__data/assets/file/0012/2262/glyphicons-halflings-regular.woff2',
                'https://camptriangle.co.uk/__data/assets/image/0013/1534/banner-1.jpg'
            ]); // end return addAll
        }) // end open then
    ); // end waitUntil
}); // end addEventListener

// when browser requests a file check to see if it's in the cache
addEventListener('fetch', fetchEvent => {
    const request = fetchEvent.request;
    fetchEvent.respondWith(
        // first look in the cache
        caches.match(request)
        .then ( responseFromCache => {
            if (responseFromCache) {
                return responseFromCache;
            } // end if
            // Otherwise fetch from the network
            return fetch(request);
        }) // end match then
    ); // end respondWith
}); // end addEventListener