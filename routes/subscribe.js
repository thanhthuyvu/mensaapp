const express = require('express');
const router = express.Router();
const webpush = require("web-push");
const User = require('../models/User');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');


const publicVapidKey =
    "BIWgo4_sJ5NPyYLOYnm9F37qYBix7LbeSz-7WgBMLBs_Z88HL4vU6pkog6EAbXQC_iD0T4HgRCsfVbmu7Uzb2IE";
const privateVapidKey = "q_0u1ioJjMvirDhGQ5Gc8FVFAfV5UD0HbSitBkM_DRI";

webpush.setVapidDetails(
    "mailto:zheniav@web.de",
    publicVapidKey,
    privateVapidKey
);

let sub = {
    // Nutzer im Datenbank, die Push-Benachrichtigung bekommen wollen
};

//webpush.sendNotification(sub, 'test message')

// Subscribe Route
router.post("/", (req, res) => {
    // Get pushSubscription object
    //const subscription = req.body;
    let sub = {
        endpoint: "https://fcm.googleapis.com/fcm/send/fyANJ8sn8Fg:APA91bFZ9bMmEWgQAz5MWAGUO2DC2iPWP5UZOoiQ9lhVJPDt5USc7pnXUxbt6PKtKCluemWBCv8SU_nY5_tdOVqA5cOnWaYmHaG9qU5ei8DxYb-RFvdH5R811L3h4sYE_I3RqAG8NRUr",
        expirationTime: null,
        "keys": {
            p256dh: "BAwy1jO23qdK_28d0rJjou7EAiISy_b36XSxrhY9mX7UJmE7W0YKQv7iBEPP8pb63YcTejjf25NVMOis9LFex7g",
            auth: "ya5Fe6ClHC9-LKmZjlyLIw"
        }
    };



    // Send 201 - resource created
    res.status(201).json({});

    // Create payload
    const payload = JSON.stringify({ title: "Push Test" });

    // Pass object into sendNotification
    webpush
        .sendNotification(sub, payload)
        .catch(err => console.error(err));
});


// router.get('/einstellungen', function(req, res) {
//     res.render('einstellungen');
// });
router.get("/", function(req, res) {

    res.send("test 200")
});


module.exports = router;