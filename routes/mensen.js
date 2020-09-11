const express = require('express');
const router = express.Router();
const request = require('request');
const Mensa = require('../models/Mensa');
const User = require('../models/User');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

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

router.get("/mensen",forwardAuthenticated, function (req, res) {
    Mensa.find({}, function(err, foundMensen) {
       if(!err) {
        res.render("home", {
          mensen: foundMensen, 
          today: today,
        });
      }
  });
  });
  


//Get dashboard

router.get("/dashboard", ensureAuthenticated, async (req, res) => {
  Mensa.find({}, async (err, foundMensen) => {
     if(!err) {
      let user = await User.findOne({email: req.user.email}).populate('lieblingsMensen').lean();
        res.render("dashboard", {
          mensen: foundMensen, 
          today: today,
          user: user,
          lieblingsMensen: user.lieblingsMensen
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
router.get("/lieblingsmensen",ensureAuthenticated, async (req, res) => {
  let user = await User.findOne({email: req.user.email}).populate('lieblingsMensen').lean();
  res.render("dashboard", {
            mensen: user.lieblingsMensen,
            today: today,
            user: req.user,
            lieblingsMensen: user.lieblingsMensen
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
router.post("/:mensaId/save",ensureAuthenticated, async (req, res)=>{
  try {
    let user = await User.findOne({email: req.user.email}).populate('lieblingsMensen').lean();

    let checkedmensa = await Mensa.findOne({ id: req.params.mensaId });
    if(!checkedmensa){
      return res.render('error/404');
    }
    if(user.lieblingsMensen.filter(mensa => mensa.id == checkedmensa.id).length > 0){
      // remove from fav list
var index = user.lieblingsMensen.findIndex(value => value.id == checkedmensa.id);
user.lieblingsMensen.splice(index, 1);
let newLieblingsMensen = user.lieblingsMensen;
user = await User.findOneAndUpdate({email: req.user.email}, {$set:{lieblingsMensen : newLieblingsMensen}}, {new: true});
res.redirect('/mensen');
    } else {
      //add to fav list
      user.lieblingsMensen.push(checkedmensa);
      let newLieblingsMensen = user.lieblingsMensen;
      user = await User.findOneAndUpdate({email: req.user.email}, {$set:{lieblingsMensen : newLieblingsMensen}}, {new: true});
      res.redirect('/mensen');
    }
  }
  catch (err) {
    console.error(err)
    return res.render('error/500')
  }

});
  module.exports = router;