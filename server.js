// modules =================================================
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const morgan = require('morgan');
const rfs = require('rotating-file-stream')
const log4js = require('log4js');
const connectMongo = require('connect-mongo');
// var Queue = require('bull');

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

const env = process.env.NODE_ENV;
function getCredentials() {
    if(env === 'production') {
        return {
            key: fs.readFileSync('/etc/letsencrypt/live/review1l1s.com/privkey.pem', 'utf8'),
            cert: fs.readFileSync('/etc/letsencrypt/live/review1l1s.com/cert.pem', 'utf8')
        };
    } else {
        return {
            key: fs.readFileSync('./keys/privkey.pem', 'utf8'),
            cert: fs.readFileSync('./keys/cert.pem', 'utf8')
        };
    }
}
const credentials = getCredentials();
const httpsServer = https.createServer(credentials, app);

function getHttpServer() {
    if(env === 'production') {
        const redirectApp = express();
        redirectApp.all('*', (req, res) => res.redirect('https://review1l1s.com/'));
        return http.createServer(redirectApp);
    } else {
        return http.createServer(app);
    }
}
const httpServer = getHttpServer();

// set our ports
const httpPort = env === 'production' ? 80 : 3000;
const httpsPort = env === 'production' ? 443 : 3080;
// configuration ===========================================

// logger

log4js.configure({
    appenders: { runtime: { type: 'file', filename: 'runtime.log' } },
    categories: { default: { appenders: ['runtime'], level: 'error' } }
});
const logger = log4js.getLogger('runtime');

// mongoose
const dbConf = require('./config/db');
mongoose.connect(dbConf.url, dbConf.options); 

// create a rotating write stream
if(env === 'production') {
    var accessLogStream = rfs.createStream('access.log', {
        interval: '1d', // rotate daily
        path: path.join(__dirname, 'log')
    })

    var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
    app.use(morgan('combined', { stream: accessLogStream }))
} else {
    app.use(morgan('dev'));
}

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static(__dirname + '/public'));

const MongoStore = connectMongo(session);

app.use(session({ 
    secret: 'brobroskiski', 
    cookie: { maxAge: 60000 }, 
    resave: false, 
    saveUninitialized: false,
    store: new MongoStore(mongoose.connection)
}));

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
    res.status(err.status || 500);

    res.json({'errors': {
        message: err.message,
        error: err
    }});
});

// startup our app at https://localhost:3000
httpsServer.listen(httpsPort, () => logger.info("https server started listening."));
httpServer.listen(httpPort, () => logger.info("http server started listening"));

module.exports = app;