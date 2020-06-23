// Make sure sw are supported
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('/sw_site.js')
            .then(reg => console.log('Service Worker: Registered (Pages)'))
            .catch(err => console.log(`Service Worker: Error: ${err}`));
    });
}

//if ('serviceWorker' in navigator) {
//  navigator.serviceWorker.register('/sw.js')
//  .then(function() {
//  console.log('SW registered');
//});
//}