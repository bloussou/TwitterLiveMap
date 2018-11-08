var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var twitterRouter = require('./routes/twitter');

var app = express();

// io initialization
app.io = twitterRouter.io;


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', process.env.FRONT_URL); //192.168.99.100:4200
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
app.use(bodyParser.json());
app.use(express.json());

app.use('/', twitterRouter);


module.exports = app;
