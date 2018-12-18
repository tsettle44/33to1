var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Post = require('../models/post').Post;

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

//GET /logout
router.get('/logout', function(req, res, next) {
  if (req.session) {
    //delete session
    req.session.destroy(function(err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    })
  }
});

//GET Login
router.get('/login', function(req, res, next) {
  return res.render('login', {title: 'Log In'})
});

//POST Login
router.post('/login', function(req, res, next) {
  if (req.body.email && req.body.password) {
    User.authenticate(req.body.email, req.body.password, function(error, user) {
      if (error || !user) {
        var err = new Error('Wrong email or password');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        return res.redirect('/');
      }
    })
  } else {
    var err = new Error('Email and password are required');
    err.status = 401;
    return next(err);
  }
})

//GET Profile
router.get('/profile', function( req, res, next) {
  if (! req.session.userId) {
    var err = new Error('Please login to view this page');
    err.status = 403;
    return next(err);
  }
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        return res.render('profile', {title: 'Profile', name: user.name, email: user.email, points: user.points, createdAt: user.createdAt})
      }
    })
})

//GET about page
router.get('/about', function(req, res, next) {
  res.render('about', { title: "About"});
});

//GET Discussion Board
router.get('/discussion-board', function(req, res, next) {
  res.render('discussion', { title: "Discussion Board"});
});

//Discussion Board Post Param
router.param("pID", function(req, res, next, id) {
  Post.findById(req.params.pID, function(err, doc){
      if(err) return next(err);
      if(!doc) {
          err = new Error("Not Found");
          err.status = 404;
          return next(err);
      }
      req.post = doc;
      return next();
  });
});

//Discussion Board Comment Param
router.param("cID", function(req, res, next, id) {
  req.comment = req.post.comments.id(id);
  if(!req.comment) {
      err = new Error("Not Found");
      err.status = 404;
      return next(err);
  }
  next();
});

//GET Discussion Board POSTS
router.get("/discussion-board/posts", function(req, res, next){
  Post.find({})
      .sort({createdAt: -1})
      .exec(function(err, posts) {
      if(err) return next(err);
      res.json(posts);
  });
});

//GET Specific Post
router.get("/discussion-board/posts/:pID", function(req, res){
  res.json(req.post);
});

//POST Post on Discussion Board
router.post("/discussion-board/posts", function(req, res, next){
  var post = new Post(req.body);
  post.save(function(err, post) {
      if(err) return next(err);
      res.status(201);
      res.json(post);
  });
});

//POST Like Post
router.post("/discussion-board/posts/:pID/like", 
    function(req, res, next){
        req.post.like(req.like, function(err, post) {
            if(err) return next(err);
            res.json(post);
        });
});

//POST Comment to Post
router.post("/discussion-board/posts/:pID/comments", function(req, res, next){
  req.post.comments.push(req.body);
  req.post.save(function(err, post){
      if(err) return next(err);
      res.status(201);
      res.json(post);
  });
});

//POST Comment to Comment
router.post("/discussion-board/posts/:pID/:cID/comments", function(req, res, next){
  req.comment.comments.push(req.body);
  req.post.save(function(err, comment){
      if(err) return next(err);
      res.status(201);
      res.json(comment);
  });
});

//POST Like comment
router.post("/discussion-board/posts/:pID/:cID/like", 
    function(req, res, next){
        req.comment.like(req.like, function(err, post) {
            if(err) return next(err);
            res.json(post);
        });
});


module.exports = router;
