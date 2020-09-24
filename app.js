const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

console.log(process.env);
const app = express();
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const Hotspring = require('./models/hotspring');
const Comment = require('./models/comment');
const User = require('./models/user');

const commentRoutes = require('./routes/comments');
const hotspringRoutes = require('./routes/hotsprings');
const indexRoutes = require('./routes/index');

const db = process.env.MONGODB_URL;

// Production DB connection
const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log('MongoDB Atlas is Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

connectDB();

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(`${__dirname}/public`));
app.use(methodOverride('_method'));
app.use(flash());

// PASSPORT CONFIGURATION
app.use(
  require('express-session')({
    secret: 'Ingrid and Axel are running around!',
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

app.use('/', indexRoutes);
app.use('/hotsprings', hotspringRoutes);
app.use('/hotsprings/:id/comments', commentRoutes);

app.listen(process.env.PORT || 4000, () => {
  console.log('Therme is live on Heroku or Port 4000');
});
