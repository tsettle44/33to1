var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

// GET register page
router.get('/register', function(req, res, next) {
  res.render('register', { title: "Sign Up"});
});

// POST register
router.post('/register', function(req, res, next) {
  if (req.body.email &&
    req.body.name &&
    req.body.password &&
    req.body.confirmPassword){
      //confirm passwords match

      if (req.body.password !== req.body.confirmPassword) {
        var err = new Error('Passwords do not match.');
        err.status = 400;
        return next(err);
      }

      var userData = {
        email: req.body.email,
        name: req.body.name,
        password: req.body.password,
        createdAt: Date.now(),
        points: 0,
      }

      //insert into mongo
      User.create(userData, function (error, user) {
        if (error) {
          return next(error)
        } else {
          req.session.userId = user._id;
          return res.redirect('/');
        }
      });
      
    } else {
      var err = new Error('All fields required');
      err.status = 400;
      return next(err);
    }
});

//GET about page
router.get('/about', function(req, res, next) {
  res.render('about', { title: "About"});
});

module.exports = router;
