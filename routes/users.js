const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// User model
const User = require('../models/User');

//Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login', {
    name: ' '
}));

//Register Page
router.get('/registrieren', forwardAuthenticated, (req, res) => res.render('registrieren', {
    name: ' '
}));

// Register
router.post('/registrieren', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    // Check required fields
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Bitte alle Felder ausfüllen!' });
    }

    // Passwords match check
    if (password != password2) {
        errors.push({ msg: 'Passwörter stimmen nicht überein!' });
    }
    // Check passwords length
    if (password.length < 6) {
        errors.push({ msg: 'Passwort muss mindestens 6 Zeichen beinhalten!' });
    }

    if (errors.length > 0) {
        res.render('registrieren', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        // Validation passed
        User.findOne({ email: email })
            .then(user => {
                if (user) {
                    // User exists
                    errors.push({ msg: 'Diese Email ist bereits registriert!' });
                    res.render('registrieren', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    });
                    // Hash Password
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            // Set password to hashed
                            newUser.password = hash;
                            // Save user
                            newUser.save()
                                .then(user => {
                                    req.flash(
                                        'success_msg',
                                        'Sie sind jetzt registriert und können sich einloggen'
                                    );
                                    res.redirect('/users/login');
                                })
                                .catch(err => console.log(err));
                        });
                    });
                }
            });
    }
});

// Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/lieblingsmensen',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

// Logout
router.get('/logout', ensureAuthenticated, (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});


module.exports = router;