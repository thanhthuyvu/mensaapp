const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const path = require("path");
require('dotenv').config();


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
//  Brauchen wir das
app.use(express.static(path.join(__dirname, "client")));
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/mensaAppDB", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

//Routes
app.use('/', require('./routes/mensen'));
app.use('/speise', require('./routes/speise'));
app.use('/subscribe', require('./routes/subscribe'));

const port = process.env.PORT || 3000;

app.listen(port, function() {
    console.log(`Server started at ${port}`);
});