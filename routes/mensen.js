const express = require('express');
const router = express.Router();
const request = require('request');
const Mensa = require('../models/Mensa');



function getTheRightDate(inputDate) {
    var day = new Date(inputDate);
    var dd = String(day.getDate()).padStart(2, '0');
    var mm = String(day.getMonth() + 1).padStart(2, '0'); //January is 01
    var yyyy = day.getFullYear();
    day = yyyy + '-' + mm + '-' + dd;
    return day;
}


//Angeben für Tester: Today ist "2019-11-18" 
var today = new Date("2019-11-18");
today = getTheRightDate(today);


//Get alle Mensen

router.get("/mensen", function (req, res) {
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
        setTimeout(() => { res.redirect("/mensen"); }, 1000);
          }
          else {
            res.send(error);
          }
        });
      } else {
        res.render("home", {
          mensen: foundMensen, 
          today: today
        });
      }
  });
  });
  



//Get Mensas Information
router.get("/mensen/:mensaId", function(req, res) {

    const requestedMensaId = req.params.mensaId;

    var options = {
        'method': 'GET',
        'url': 'https://openmensa.org/api/v2/canteens/' + requestedMensaId,
        'headers': {}
    };

    request(options, function(error, response) {
        if (!error) {
            const foundMensa = JSON.parse(response.body)
            res.render("mensa_info", {
                name: foundMensa.name,
                address: foundMensa.address
            });
        } else {
            res.send(error);
        }

    });

});



//Get Lieblingsmensen

router.get("/lieblingsmensen", function (req, res) {
    Mensa.find({istMeinLiebling : true}, function(err, foundMensen) {
      if(foundMensen.length === 0){
        res.send("Keine Lieblingsmensen gefunden!");
      } else {
        res.render("home", {
          mensen: foundMensen, 
          today: today
        });
      }
  });
  });



//Get meals for requestedDay  

router.get("/mensen/:mensaId/:mensaName/:day/meals", function (req, res) {

    const requestedMensaId = req.params.mensaId;
    const mensaName = req.params.mensaName;
    const requestedDay = getTheRightDate(req.params.day);
    var options = {
      'method': 'GET',
      'url': 'https://openmensa.org/api/v2/canteens/' + requestedMensaId+"/days/"+requestedDay+"/meals",
      'headers': {
      }
    };
  
    request(options, function (error, response) {
      if (!error) {
        
        var foundDishes=[];
        if(response.body){
         foundDishes = JSON.parse(response.body);
        }
        
        var nextday = new Date(requestedDay);
        var lastday = new Date(requestedDay)
        nextday.setDate(nextday.getDate() + 1);
        lastday.setDate(lastday.getDate() - 1);
        nextday = getTheRightDate(nextday);
        lastday = getTheRightDate(lastday);
        
        res.render("mensa", {
         dishes : foundDishes,
         mensaid: requestedMensaId,
         mensaName: mensaName,
         nextday: nextday,
         lastday: lastday,
         today: requestedDay
        }); }
      else {
        res.send(error);
      }
  
    });
  });



//save - unsave Mensa as Favorite
router.post("/:mensaId/save", function(req, res){
    const lieblingsMensaId = req.params.mensaId;
    Mensa.findOne({
      id: lieblingsMensaId
    }, function(err, foundMensa){
      if(!err){
        foundMensa.istMeinLiebling = !foundMensa.istMeinLiebling;
        foundMensa.save();
        res.redirect("/mensen");
      }
    })
  
  });

  
  module.exports = router;