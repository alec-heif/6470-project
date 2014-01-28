"use strict";

var express = require('express'),
	stylus = require('stylus'),
	nib = require('nib'),
	mocha = require('mocha'),
	grunt = require('grunt'),
	firebase = require('firebase'),
	bcrypt = require('bcrypt'),
	validator = require('validator'),
	http = require('http');

var index = require('./routes/indexController');
var login = require('./routes/loginPost');
var socketHandler = require('./routes/socketHandler');

//var grabNutrition = require('./resources/grabNutrition.js');
//var processFoods = require('./resources/processFood.js');
//var generateRecipes = require('./resources/my_generator_algorithm.js');


var dbRef = new firebase('https://whatsinmyfridge.firebaseIO.com/');

var users = dbRef.child('USERS');

var app = express();
var server = http.createServer(app);

var io = require('socket.io').listen(server);

io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});
//grabNutrition.grabNutrition();
//grabNutrition.removeInvalidFoods();
//grabNutrition.fillNutritionInfo();
//grabNutrition.createIdTable();

//generateRecipes.generateNames();

function compile(str, path) {
	return stylus(str)
		.set('filename', path)
		.use(nib());
}

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(stylus.middleware( 
	{
		src: __dirname + '/views',
		dest: __dirname + '/public',
		compile: compile
	}
));

app.use(express.cookieParser());
app.use(express.cookieSession({
  key: 'email.sess',
  secret: '$2a$08$N0RLrmSGA/c.'
}));


app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	console.log("USERNAME: " + req.session.userId);
	if(req.session.userId) {
		res.render('index', {'user': req.session.userId});
	}
	else
		res.render('index');
});

app.get('/profile', function(req, res) {
	res.render('profile');
});

app.get('/password', function(req, res) {
	if(req.session.userId)
		res.render('password');
	else
		res.redirect('/');
});

app.get('/login', function(req, res) {
	res.render('login');
});

app.get('/logout', function(req, res) {
	req.session.userId = null;
	res.redirect('/');
});

app.post('/loginAccount', function(req, res) {
	login.loginAuth(req, res, dbRef, bcrypt);
});

app.post('/createAccount', function(req, res) {
	login.createAccount(req, res, dbRef, bcrypt);
});

app.post('/addIngredient', function(req, res) {
	login.addIngredient(req, res, dbRef);
});

app.get('/submit', function(req, res) {
	res.render('recipesubmission');
})

app.use(function(req, res) {
	res.status(404).render('404');
});

io.sockets.on('connection', function(socket) {
	socketHandler.handle(socket, dbRef);
});

server.listen(process.env.PORT || 3000)