const Mensa = require('../models/Mensa');
const request = require('request');

module.exports = {
  createDatabase: function () {
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
  },

  getTagesangebote: function(mensaId, datum, fn, speiseId){
    var options = {
      'method': 'GET',
      'url': 'https://openmensa.org/api/v2/canteens/' + mensaId+"/days/"+datum+"/meals",
      'headers': {
      }
    };
  
    request(options, function (error, response) {
      if (!error) {
        
        var foundDishes=[];
        if(response.body){
         foundDishes = JSON.parse(response.body);
        }
        fn(speiseId, foundDishes);

      }
      else {
        res.send(error);
      }
  });
},
getTheRightDate: function (inputDate) {
  var day = new Date(inputDate);
  var dd = String(day.getDate()).padStart(2, '0');
  var mm = String(day.getMonth() + 1).padStart(2, '0'); //January is 01
  var yyyy = day.getFullYear();
  day = yyyy + '-' + mm + '-' + dd;
  return day;
},
getMensaInRadius: function(lon,lat,fn){
  var options = {
    'method': 'GET',
    'url': 'https://openmensa.org/api/v2/canteens?near[lat]='+lat+'&near[lng]='+lon+'&near[dist]=5',
    'headers': {
    }
  };

  request(options, function (error, response) {
    if (!error) {
      const mensaIds = JSON.parse(response.body).map(mensa => mensa.id);
      fn(mensaIds);
    }

});
},
//gteClassName 
getClassName: function(notes) {
  var note;

  if (notes.includes("vegan") || notes.includes("veganes Gericht")) {
    note = "vegan";

  } else if ((notes.includes("Geflügel") || notes.includes("Schwein")
    || notes.includes("Rind") || notes.includes("Fleich"))
    || notes.includes("Geflügelfleisch") || notes.includes("Rindfleisch")
    || notes.includes("Fisch")) {
    note = "meat";

  } else {
    note = "vegetarian";
  }
  return note;
},

//getAmpel 
getAmpel: function(notes) {
  var ampel;

  if (notes.includes("grün (Ampel)")) {
    ampel = "grun";

  } else if (notes.includes("gelb (Ampel)")) {
    ampel= "gelb";
  } else if (notes.includes("rot (Ampel)")) {
    ampel= "gelb";
  }

  return ampel;
}
}