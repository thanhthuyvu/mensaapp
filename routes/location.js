const express = require('express');
const router = express.Router();
const request = require('request');

router.post('/', (request, response) => {
    console.log(request.body);
});

module.exports = router;