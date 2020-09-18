const express = require('express');
const router = express.Router();
const request = require('request');

router.post('/', (request, response) => {
    console.log(request.body);
    const location = request.body;
    response.json({
        status: 'success',
        longtitude: location.lon,
        latitude: location.lat
    });

});

module.exports = router;