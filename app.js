const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const path = require("path");
require('dotenv').config();
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(express.static(path.join(__dirname, "client")));
app.use(bodyParser.json());

// Passport Config
require('./config/passport')(passport);

//Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/mensaAppDB", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

//Initial
require('./config/data').createDatabase();

// Express session
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());


// Global variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');

    res.locals.noMatch = req.flash('noMatch');
    res.locals.name = req.flash('name');
    next();
});

//Routes
app.use('/', require('./routes/mensen'));
app.use('/speise', require('./routes/speise'));
app.use('/users', require('./routes/users'));
app.use('/subscribe', require('./routes/subscribe'));


const port = process.env.PORT || 3000;

app.listen(port, function() {
    console.log(`Server started at ${port}`);
});