const express = require('express');
const router = express.Router({ mergeParams: true });
const Hotspring = require('../models/hotspring');
const Comment = require('../models/comment');
const middleware = require('../middleware');

//NEW hotspring comment GET route
router.get('/new', middleware.isLoggedIn, function(req, res) {
  Hotspring.findById(req.params.id, function(err, hotspring) {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', { hotspring: hotspring });
    }
  });
});

//CREATE hotspring comments post route
router.post('/', middleware.isLoggedIn, function(req, res) {
  //lookup hotspring using id
  Hotspring.findById(req.params.id, function(err, hotspring) {
    if (err) {
      req.flash('error', 'Something went wrong');
      console.log(err);
      res.redirect('/hotsprings');
    } else {
      Comment.create(req.body.comment, function(err, comment) {
        if (err) {
          console.log(err);
        } else {
          //add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          //save comment
          comment.save();
          hotspring.comments.push(comment);
          hotspring.save();
          req.flash('success', 'Successfully added comment');
          res.redirect('/hotsprings/' + hotspring._id);
        }
      });
    }
  });
});

//COMMENT EDIT ROUTE (renders the form)
router.get('/:comment_id/edit', middleware.checkCommentOwnership, function(
  req,
  res,
) {
  Hotspring.findById(req.params.id, function(err, foundHotspring) {
    if (err || !foundHotspring) {
      req.flash('error', 'Cannot find that hotspring');
      return res.redirect('back');
    }
    Comment.findById(req.params.comment_id, function(err, foundComment) {
      if (err) {
        res.redirect('back');
      } else {
        res.render('comments/edit', {
          hotspring_id: req.params.id,
          comment: foundComment,
        });
      }
    });
  });
});

//COMMENT UPDATE (sends a PUT request to update listing with what's in the edit form)
router.put('/:comment_id', middleware.checkCommentOwnership, function(
  req,
  res,
) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(
    err,
    updatedComments,
  ) {
    if (err) {
      res.redirect('back');
    } else {
      res.redirect('/hotsprings/' + req.params.id);
    }
  });
});

//COMMENT DESTROY ROUTE
router.delete('/:comment_id', middleware.checkCommentOwnership, function(
  req,
  res,
) {
  //find by id and remove
  Comment.findByIdAndRemove(req.params.comment_id, function(err) {
    if (err) {
      res.redirect('back');
    } else {
      req.flash('success', 'Comment deleted');
      res.redirect('/hotsprings/' + req.params.id);
    }
  });
});

module.exports = router;
