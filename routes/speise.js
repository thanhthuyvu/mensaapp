const express = require('express');
const router = express.Router();

const Speise = require('../models/Speise');
const User = require('../models/User');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

//Get Lieblingsspeisen
router.get("/lieblingsspeisen",ensureAuthenticated, async (req, res) => {
  let user = await User.findOne({email: req.user.email}).populate('lieblingsSpeisen').lean();
  res.send(user.lieblingsSpeisen);
  });


//save Speise as Favorite
router.post("/:speiseId/save",ensureAuthenticated, async (req, res)=>{
  try {
    let user = await User.findOne({email: req.user.email});
  let speise = JSON.parse(req.body.checkbox);
  //TODO: check if Speise already exists
  user.lieblingsSpeisen.push(speise);
  let newLieblingsSpeisen = user.lieblingsSpeisen;
  user = await User.findOneAndUpdate({email: req.user.email}, {$set:{lieblingsSpeisen : newLieblingsSpeisen}}, {new: true});
  
console.log(JSON.parse(req.body.checkbox));

  }
  catch (err) {
    console.error(err)
    return res.render('error/500')
  }

});


module.exports = router;