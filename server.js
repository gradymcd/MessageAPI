// Import required packages
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
var ejs = require('ejs');

// Connect to the database
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/node-rest-oauth');

// Create the Express application
var app = express();
// Set view engine to ejs
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(passport.initialize());

// Use express session support since OAuth2orize requires it
app.use(session({
	secret: 'Super Secret Session Key', // CHANGE THIS KEY IN YOUR INSTALLATION
	saveUninitialized: true,
	resave: true
}));

var user = require('./controllers/User');
var room = require('./controllers/Room');
var oauth = require('./controllers/OAuth');

app.use('/user', user);
app.use('/room', room);
app.use('/oauth', oauth);

// Start the server
var port = process.env.PORT || 8080;
app.listen(port);
console.log('Server listening on port ' + port);
