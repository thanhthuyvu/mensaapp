// const express = require('express');
// const router = express.Router();
// const webpush = require("web-push");

// // Inspired by TraversyMedia https://www.traversymedia.com/
// const publicVapidKey =
//     "BIWgo4_sJ5NPyYLOYnm9F37qYBix7LbeSz-7WgBMLBs_Z88HL4vU6pkog6EAbXQC_iD0T4HgRCsfVbmu7Uzb2IE";
// const privateVapidKey = "q_0u1ioJjMvirDhGQ5Gc8FVFAfV5UD0HbSitBkM_DRI";

// webpush.setVapidDetails(
//     "mailto:zheniav@web.de",
//     publicVapidKey,
//     privateVapidKey
// );

// // Subscribe Route
// router.post("/", (req, res) => {
//     // Get pushSubscription object
//     const subscription = req.body;

//     // Send 201 - resource created
//     res.status(201).json({});

//     // Create payload
//     const payload = JSON.stringify({ title: "Push Test" });

//     // Pass object into sendNotification
//     webpush
//         .sendNotification(subscription, payload)
//         .catch(err => console.error(err));
// });

// router.get("/", function(req, res) {

//     res.send("test 200")
// });


// module.exports = router;