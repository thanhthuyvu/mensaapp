const express = require('express');
const router = express.Router();
const request = require('request');

router.post('/location', (request, response) => {
    console.log(request.body);
});

module.exports = router;