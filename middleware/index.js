const Hotspring = require('../models/hotspring');
const Comment = require('../models/comment');
//all the middlware goes here
const middlewareObj = {};

middlewareObj.checkHotspringOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    Hotspring.findById(req.params.id, function(err, foundHotspring) {
      if (err || !foundHotspring) {
        req.flash('error', 'Hotspring not found');
        res.redirect('back');
      } else {
        //does user own the Hotspring?
        if (foundHotspring.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash('error', "You don'nt have permission to do that");
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error', 'You need to be logged in to do that');
    res.redirect('back');
  }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
      if (err || !foundComment) {
        req.flash('error', 'Comment not found');
        res.redirect('back');
      } else {
        //does user own the hotspring?
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error', 'You need to be logged in to do that');
    res.redirect('back');
  }
};

middlewareObj.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'You need to be logged in to do that');
  res.redirect('/login');
};

module.exports = middlewareObj;
