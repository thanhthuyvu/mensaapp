const express = require('express');
const router = express.Router();

const Speise = require('../models/Speise');

//save  eine Speise as Favorite
// router.post("/:speiseId/save", function(req,res){
//   const lieblingsSpeiseId = req.params.speiseId;
  
// });

router.get("/lieblingsspeisen", function(req,res){
    
res.send("test test")
  });

module.exports = router;