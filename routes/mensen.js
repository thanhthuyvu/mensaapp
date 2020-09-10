const express = require('express');
const router = express.Router();
const request = require('request');
const Mensa = require('../models/Mensa');

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

router.get("/dashboard", ensureAuthenticated, function (req, res) {
  Mensa.find({}, function(err, foundMensen) {
     if(!err) {
        res.render("dashboard", {
          mensen: foundMensen, 
          today: today,
          user: req.user
        });
      }
  
}).populate('fans');
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
  let foundmensen = await Mensa.find().populate({ 
      path: 'fans',
      match: {email: {$eq: req.user.email}}}).exec();
  if(!foundmensen){
    return res.render('error/404');
  }
  let beliebteMensen = foundmensen.filter(mensa => mensa.fans.length > 0);

  res.render("dashboard", {
            mensen: beliebteMensen, 
            today: today,
            user: req.user
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
  try{
    let mensa = await Mensa.findOne({ id: req.params.mensaId }).populate('fans').lean()
    if(!mensa){
      return res.render('error/404');
    }
    
    if(mensa.fans.filter(value=> value._id.equals(req.user._id)).length > 0){
 
 //remove from fav list
 var index = mensa.fans.findIndex(value=> value._id.equals(req.user._id)); 
  mensa.fans.splice(index, 1);
  let fanList=mensa.fans;
   mensa = await Mensa.findOneAndUpdate({id: req.params.mensaId}, {$set:{fans:fanList}},{new: true}) 
   res.redirect('/mensen');
    } else { 
     //add to fav list
     mensa.fans.push(req.user);
     let fanList = mensa.fans;
     mensa = await Mensa.findOneAndUpdate({id: req.params.mensaId}, {$set:{fans:fanList}},{new: true}) 
     res.redirect('/mensen');
    }
  }
  catch (err) {
    console.error(err)
    return res.render('error/500')
  }

});
  module.exports = router;