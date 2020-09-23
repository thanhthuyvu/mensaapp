const express = require('express');
const router = express.Router();

const Speise = require('../models/Speise');
const User = require('../models/User');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

//Get Lieblingsspeisen
router.get("/lieblingsspeisen",ensureAuthenticated, async (req, res) => {
  try{

  let user = await User.findOne({email: req.user.email});
  console.log(user.lieblingsSpeisen);
  res.send(user.lieblingsSpeisen);
  } catch(err){
    console.log(err);
  }
  });


//save Speise as Favorite
router.post("/:speiseId/save",ensureAuthenticated, async (req, res)=>{
  try {
    let user = await User.findOne({email: req.user.email});
  let speise = JSON.parse(req.body.checkbox);
  //TODO: check if Speise already exists
  if(user.lieblingsSpeisen.filter(item => item.id === speise.id).length === 0){
    user.lieblingsSpeisen.push(speise);
    let newLieblingsSpeisen = user.lieblingsSpeisen;
    user = await User.findOneAndUpdate({email: req.user.email}, {$set:{lieblingsSpeisen : newLieblingsSpeisen}}, {new: true});
  }
  
  res.redirect('/speise/lieblingsspeisen');
  }
  catch (err) {
    console.error(err);
   res.render('error/500');
  }

});


module.exports = router;