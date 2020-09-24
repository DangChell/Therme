const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

//Root route
router.get('/', (req, res) => {
  res.render('landing');
});

//Register form route
router.get('/register', function(req, res) {
  res.render('register');
});

//Handle Signup Logic
router.post('/register', function(req, res) {
  const newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      req.flash('error', err.message);
      return res.render('register');
    }
    passport.authenticate('local')(req, res, function() {
      req.flash('success', 'Welcome to Therme ' + user.username);
      res.redirect('/hotsprings');
    });
  });
});

//Show Login Form
router.get('/login', function(req, res) {
  res.render('login');
});
//handling login logic
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/hotsprings',
    failureRedirect: '/login',
  }),
  function(req, res) {},
);

//logout route
router.get('/logout', function(req, res) {
  req.logout();
  req.flash('success', 'Logged you out!');
  res.redirect('/hotsprings');
});

module.exports = router;
