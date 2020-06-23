const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const request = require('request');
require('dotenv').config();


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// const mensaSchema = {
//   id: Number,
//   name: String, 
//   city: String, 
//   address: String
// }


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
app.get("/mensen", function(req, res) {
    var options = {
        'method': 'GET',
        'url': 'https://openmensa.org/api/v2/canteens/',
        'headers': {}
    };
    request(options, function(error, response) {
        if (!error) {
            res.render("home", {
                mensen: (JSON.parse(response.body)),
                today: today
            });
        } else {
            res.send(error);
        }
    });
});



//Get Mensas Information
app.get("/mensen/:mensaId", function(req, res) {

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

//Get meals for requestedDay  
app.get("/mensen/:mensaId/:day/meals", function(req, res) {

    const requestedMensaId = req.params.mensaId;
    const requestedDay = getTheRightDate(req.params.day);
    var options = {
        'method': 'GET',
        'url': 'https://openmensa.org/api/v2/canteens/' + requestedMensaId + "/days/" + requestedDay + "/meals",
        'headers': {}
    };

    request(options, function(error, response) {
        if (!error) {

            var foundDishes = [];
            if (response.body) {
                foundDishes = JSON.parse(response.body);
            }

            var nextday = new Date(requestedDay);
            var lastday = new Date(requestedDay)
            nextday.setDate(nextday.getDate() + 1);
            lastday.setDate(lastday.getDate() - 1);
            nextday = getTheRightDate(nextday);
            lastday = getTheRightDate(lastday);

            res.render("mensa", {
                dishes: foundDishes,
                mensaid: requestedMensaId,
                nextday: nextday,
                lastday: lastday,
                today: requestedDay
            });
        } else {
            res.send(error);
        }

    });

});




const port = process.env.PORT || 3000;

app.listen(port, function() {
    console.log(`Server started at ${port}`);
});