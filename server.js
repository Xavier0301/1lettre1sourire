// modules =================================================
const express = require('express');
const app = express();
var bodyParser = require('body-parser')
var mongoose = require('mongoose');

var apiRouter = require('./app/routes/letters_api');
var publicRouter = require('./app/routes/public')

// set our port
const port = 3000;
// configuration ===========================================

// config files
var db = require('./config/db');
console.log("connecting--",db);
mongoose.connect(db.url); //Mongoose connection created

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users

app.use('/api', apiRouter);
app.use('/', publicRouter);

// frontend routes =========================================================
app.get('/', (req, res) => res.send('Yo bru'));

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     next(createError(404));
//   });
  
//   // error handler
//   app.use(function(err, req, res, next) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};
  
//     // render the error page
//     res.status(err.status || 500);
//     res.send(err.status);
//   });

// startup our app at http://localhost:3000
app.listen(port, () => console.log(`Listening on port ${port}!`));

module.exports = app;