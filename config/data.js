const Mensa = require('../models/Mensa');
const request = require('request');

module.exports = function () {
    Mensa.find({}, function(err, foundMensen) {
      if(foundMensen.length === 0){
        var options = {
          'method': 'GET',
          'url': 'https://openmensa.org/api/v2/canteens/',
          'headers': {
          }
        };
        request(options, function (error, response) {
          if (!error) {
            var mensenData = JSON.parse(response.body);
            Mensa.insertMany(mensenData, function(err) {
              if (err) {
                console.log(err);
              } else {
                console.log("Mensen wurden erfolgreich hinzugefügt");
              }
            });    
          }
          else {
            console.log(error);
          }
        });
      } });
  }
  

