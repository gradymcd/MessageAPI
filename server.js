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

// Load controllers
var roomController = new require('./controllers/Room');
var userController = new require('./controllers/User');
var authController = new require('./controllers/Auth');
var oauthClientController = new require('./controllers/OauthClient');
var oauthController = new require('./controllers/Oauth');

// Create the Express application
var app = express();
// Set view engine to ejs
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
	extended: true
}));

// Create the Express router
var router = express.Router();

// Initial dummy route for testing
// http://localhost:3000/api
router.get('/', function (req, res) {
	res.json({message: 'Wooooooo!!!!!!!!!! Through some sorcery, this actually worked and seems to still not be broken if you are seeing this message.'});
});

//Routes
router.route('/test').get(authController.isAuthenticated, function (req, res) {
	res.send(req.user._id);
});

//Room
router.route('/room/create')
	.post(authController.isAuthenticated, roomController.post_create);
router.route('/room/:room').get(authController.isAuthenticated, roomController.get);
router.route('/room/:room/message')
	.post(authController.isAuthenticated, roomController.post_message);
router.route('/room/:room/message/:message')
	.get(authController.isAuthenticated, roomController.get_message);

//User
router.route('/user')
	.post(userController.post_users);
router.route('/me')
	.get(authController.isAuthenticated, userController.get_account);

//Oauth
router.route('/clients')
	.post(authController.isAuthenticated, oauthClientController.postClients)
	.get(authController.isAuthenticated, oauthClientController.getClients);
router.route('/oauth2/authorize')
	.get(authController.isAuthenticated, oauthController.authorization)
	.post(authController.isAuthenticated, oauthController.decision);
router.route('/oauth2/token')
	.post(authController.isClientAuthenticated, oauthController.token);

// Use express session support since OAuth2orize requires it
app.use(session({
	secret: 'Super Secret Session Key',
	saveUninitialized: true,
	resave: true
}));

// Register routes
app.use('/api', router);

// Start the server
var port = process.env.PORT || 8080;
app.listen(port);
console.log('Server listening on port ' + port);
