const express = require('express');
const router = express.Router();

const Speise = require('../models/Speise');
const User = require('../models/User');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const { getClassName, getAmpel } = require('../config/data');
//Get Lieblingsspeisen
router.get("/lieblingsspeisen",ensureAuthenticated, async (req, res) => {
  try{

  let user = await User.findOne({email: req.user.email});
  const dishes = user.lieblingsSpeisen;
  // console.log(dishes);
  res.render("lieblingsspeise", {
    dishes: dishes,
    getClassName: getClassName,
    getAmpel: getAmpel,
    user: req.user
  })
  } catch(err){
    console.log(err);
  }
  });


//save Speise as Favorite
router.post("/:speiseId/save",ensureAuthenticated, async (req, res)=>{
  try {
    let user = await User.findOne({email: req.user.email});
  let speise = JSON.parse(req.body.checkbox);

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

//unsave Speise as Favorite
router.post("/:speiseId/unsave",ensureAuthenticated, async (req, res)=>{
  try {
  let user = await User.findOne({email: req.user.email});
  let speise = JSON.parse(req.body.checkbox);

  if(user.lieblingsSpeisen.filter(item => item.id === speise.id).length > 0){
    let index = user.lieblingsSpeisen.findIndex(value => value.id == speise.id);
    user.lieblingsSpeisen.splice(index, 1);
    let newLieblingsSpeisen = user.lieblingsSpeisen;
    user = await User.findOneAndUpdate({email: req.user.email}, {$set:{lieblingsSpeisen : newLieblingsSpeisen}}, {new: true});
    res.redirect('/speise/lieblingsspeisen');
  }
  }
  catch (err) {
    console.error(err);
   res.render('error/500');
  }

});

module.exports = router;