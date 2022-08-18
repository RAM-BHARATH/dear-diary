var createError = require('http-errors');
var express = require('express');

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var diaryRouter = require('./routes/diary');

const session = require('express-session');
const auth = require('./auth');
const passport = require('passport');

const mongoose = require('mongoose')

// const myDB = require('./connection');

var app = express();

// const MongoStore = require('connect-mongo')(session)

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));

const mongo_DB_URI = process.env.MONGO_DB_URI;

mongoose.connect(mongo_DB_URI, { useNewUrlParser: true , useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// myDB(async (client) => {
  //   const UserCollection = await client.collection('User')
  //   const EntryCollection = await client.collection('Entry')
  // })
  // myDB();
  // auth(app, db);
app.use(passport.initialize());
app.use(passport.session());

auth()

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/diary', diaryRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
