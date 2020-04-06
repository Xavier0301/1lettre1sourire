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
var loginRoute = require('./app/routes/user/login.js');
var reviewRoute = require('./app/routes/review.js');
var adminRoute = require('./app/routes/admin.js')
var batchesRoute = require('./app/routes/batches.js');
var userRoute = require('./app/routes/user/manage');


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

app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(require('method-override')());
app.use(express.static(__dirname + '/public'));

app.use(session({ secret: 'brobroskiski', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));

app.use('/', publicRoute);
app.use('/api', apiRoute);
app.use('/login', loginRoute);
app.use('/review', reviewRoute);
app.use('/admin', adminRoute);
app.use('/batches', batchesRoute);
app.use('/user', userRoute);

// app.use(express.static(__dirname + '/public'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('404: Not Found');
    err.status = 404;
    next(err);
});

app.use(function(err, req, res, next) {
    console.log(err.stack);

    res.status(err.status || 500);

    if(err.status === 401) {
        console.log('???');
        res.redirect('/');
    } else {
        res.json({'errors': {
            message: err.message,
            error: err
        }});
    }
});

// startup our app at https://localhost:3000
httpServer.listen(httpPort, () => {
    console.log(`Listening on port ${httpPort}!`);
    console.log(process.version);
});
httpsServer.listen(httpsPort, () => console.log(`Listening on port ${httpsPort}!`));

module.exports = app;