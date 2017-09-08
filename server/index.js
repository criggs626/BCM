//import packages
var express = require('express');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var app = express();
var MongoClient=require('mongodb').MongoClient;
var mongo=require('mongodb');
var md5 = require('md5');
const url="mongodb://localhost:27017/bcm";

//require passport for authentication, pass it dependencies
require('./config/passport')(MongoClient, passport,mongo,md5,url);
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
app.use(session({
	secret: 'BCMchristLikeTHinking',
	resave: true,
	saveUninitialized: true
 }));
app.use(passport.initialize());
app.use(passport.session());

//require routes for front end integration and REST endpoints
require('./routes.js')(app,passport, express, MongoClient,url,mongo,md5);
var port=parseInt(80);
app.listen(port, function () {
    console.log('Example app listening on port' + port);
});
