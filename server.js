// modules =================================================
const express = require('express');
const app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');

var apiRoute = require('./app/routes/lettersAPI');
var publicRoute = require('./app/routes/public');
var registerRoute = require('./app/routes/register');
var loginRoute = require('./app/routes/login.js');
var reviewRoute = require('./app/routes/review.js');

// set our port
const port = 3000;
// configuration ===========================================

// config files
var db = require('./config/db');
console.log("connecting--",db);
mongoose.connect(db.url); //Mongoose connection created

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static(__dirname + 'src'));

//use sessions for tracking logins
app.use(session({
    secret: 'brobroskiski',
    resave: true,
    saveUninitialized: false
  }));

app.use('/api', apiRoute);
app.use('/', publicRoute);
app.use('/register', registerRoute);
app.use('/login', loginRoute);
app.use('/review', reviewRoute);
// app.use('/admin', adminRoute);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('404: Not Found');
    err.status = 404;
    next(err);
});
  
// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send(err.message);
});

// startup our app at http://localhost:3000
app.listen(port, () => console.log(`Listening on port ${port}!`));

module.exports = app;