// modules =================================================
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const lettersRoute = require('./app/routes/letter');
const publicRoute = require('./app/routes/public');
const loginRoute = require('./app/routes/user/login.js');
const reviewRoute = require('./app/routes/review.js');
const adminRoute = require('./app/routes/admin.js')
const batchesRoute = require('./app/routes/batches.js');
const userRoute = require('./app/routes/user/manage');
const statsRoute = require('./app/routes/stats');

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

// mongoose
const dbConf = require('./config/db');
mongoose.connect(dbConf.url, dbConf.options); 

app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static(__dirname + '/public'));

app.use(session({ secret: 'brobroskiski', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));

app.use('/', publicRoute);
app.use('/letters', lettersRoute);
app.use('/login', loginRoute);
app.use('/review', reviewRoute);
app.use('/admin', adminRoute);
app.use('/batches', batchesRoute);
app.use('/user', userRoute);
app.use('/stats', statsRoute);

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

    res.json({'errors': {
        message: err.message,
        error: err
    }});
});

// startup our app at https://localhost:3000
httpServer.listen(httpPort, () => {
    console.log(`Listening on port ${httpPort}!`);
    console.log(process.version);
});
httpsServer.listen(httpsPort, () => console.log(`Listening on port ${httpsPort}!`));

module.exports = app;