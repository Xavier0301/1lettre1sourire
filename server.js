// modules =================================================
const express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

var apiRoute = require('./app/routes/letter');
var publicRoute = require('./app/routes/public');
var registerRoute = require('./app/routes/register');
var loginRoute = require('./app/routes/login.js');
var reviewRoute = require('./app/routes/review.js');
var adminRoute = require('./app/routes/admin.js')

const app = express();

const credentials = {
    key: fs.readFileSync('./keys/key.pem', 'utf8'),
    cert: fs.readFileSync('./keys/cert.pem', 'utf8')
};
   
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

// set our port
const httpPort = 3000;
const httpsPort = 3080;
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
app.use('/admin', adminRoute);

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

// startup our app at https://localhost:3000
httpServer.listen(httpPort, () => console.log(`Listening on port ${httpPort}!`));
httpsServer.listen(httpsPort, () => console.log(`Listening on port ${httpsPort}!`));

module.exports = app;