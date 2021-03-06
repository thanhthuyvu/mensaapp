//Make sure sw are supported
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('/sw_site.js')
            .then(reg => console.log('Service Worker: Registered'))
            .catch(err => console.log(`Service Worker: Error: ${err}`));
    });
}

//if ('serviceWorker' in navigator) {
//  navigator.serviceWorker.register('/sw.js')
//  .then(function() {
//  console.log('SW registered');
//});
//}

// Push functions are inspired by TraversyMedia https://www.traversymedia.com/
// const publicVapidKey =
//     "BIWgo4_sJ5NPyYLOYnm9F37qYBix7LbeSz-7WgBMLBs_Z88HL4vU6pkog6EAbXQC_iD0T4HgRCsfVbmu7Uzb2IE";

// // Check for service worker
// if ("serviceWorker" in navigator) {
//     send().catch(err => console.error(err));
// }

// // Register SW, Register Push, Send Push
// async function send() {
//     // Register Service Worker
//     console.log("Registering service worker...");
//     const register = await navigator.serviceWorker.register("/sw_site.js");
//     console.log("Service Worker Registered...");

//     // Register Push
//     console.log("Registering Push...");
//     const subscription = await register.pushManager.subscribe({
//         userVisibleOnly: true,
//         applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
//     });
//     console.log("Push Registered...");

//     // Send Push Notification
//     console.log("Sending Push...");
//     await fetch("/subscribe", {
//         method: "POST",
//         body: JSON.stringify(subscription),
//         headers: {
//             "content-type": "application/json"
//         }
//     });
//     console.log("Push Sent...");
// }

// function urlBase64ToUint8Array(base64String) {
//     const padding = "=".repeat((4 - base64String.length % 4) % 4);
//     const base64 = (base64String + padding)
//         .replace(/\-/g, "+")
//         .replace(/_/g, "/");

//     const rawData = window.atob(base64);
//     const outputArray = new Uint8Array(rawData.length);

//     for (let i = 0; i < rawData.length; ++i) {
//         outputArray[i] = rawData.charCodeAt(i);
//     }
//     return outputArray;

// }