const express = require('express');
const router = express.Router();
const Hotspring = require('../models/hotspring');
const hotspring = require('../models/hotspring');
const middleware = require('../middleware');

// INDEX ROUTE -displays list of all hotsprings
router.get('/', (req, res) => {
  //get all hotsprings from DB
  Hotspring.find({}, function(err, allHotsprings) {
    if (err) {
      console.log(err);
    } else {
      res.render('hotsprings/index', { hotsprings: allHotsprings });
    }
  });
});

//CREATE route- add new hotspring to DB
router.post('/', middleware.isLoggedIn, (req, res) => {
  //get data from form and add to hotsprings array
  const name = req.body.name;
  const price = req.body.price;
  const image = req.body.image;
  const desc = req.body.description;
  const author = {
    id: req.user._id,
    username: req.user.username,
  };
  const newHotspring = {
    name: name,
    price: price,
    image: image,
    description: desc,
    author: author,
  };
  //create a new hotspring and save to database
  Hotspring.create(newHotspring, function(err, newlyCreated) {
    if (err) {
      console.log(err);
    } else {
      //redirect back to hotsprings page
      console.log(newlyCreated);
      res.redirect('/hotsprings');
    }
  });
});

//NEW route- Show form to create new hotspring
router.get('/new', middleware.isLoggedIn, (req, res) => {
  //should show form that sends data to route
  res.render('hotsprings/new');
});

//SHOW route- Show more information about one hotspring
router.get('/:id', (req, res) => {
  //find hotspring with provided ID
  Hotspring.findById(req.params.id)
    .populate('comments')
    .exec(function(err, foundHotspring) {
      if (err || !foundHotspring) {
        req.flash('error', 'Hotspring not found');
        res.redirect('back');
      } else {
        //render show template with that hotspring
        res.render('hotsprings/show', { hotspring: foundHotspring });
      }
    });
});

//EDIT HOTSPRING ROUTE
router.get('/:id/edit', middleware.checkHotspringOwnership, function(req, res) {
  Hotspring.findById(req.params.id, function(err, foundHotspring) {
    res.render('hotsprings/edit', { hotspring: foundHotspring });
  });
});

//UPDATE HOTSPRING ROUTE
router.put('/:id', middleware.checkHotspringOwnership, function(req, res) {
  //find and update the correct hotspring
  Hotspring.findByIdAndUpdate(req.params.id, req.body.hotspring, function(
    err,
    updatedHotspring,
  ) {
    if (err) {
      res.redirect('/hotsprings');
    } else {
      res.redirect('/hotsprings/' + req.params.id);
    }
  });
  //redirect somewhere(show page)
});

//DESTROY HOTSPRING & COMMENTS ROUTE
router.delete('/:id', middleware.checkHotspringOwnership, async (req, res) => {
  try {
    let foundHotspring = await Hotspring.findById(req.params.id);
    await foundHotspring.remove();
    res.redirect('/hotsprings');
  } catch (error) {
    console.log(error.message);
    res.redirect('/hotsprings');
  }
});

module.exports = router;
