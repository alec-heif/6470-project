"use strict";

var express = require('express'),
	stylus = require('stylus'),
	nib = require('nib'),
	mocha = require('mocha'),
	grunt = require('grunt'),
	firebase = require('firebase'),
	bcrypt = require('bcrypt'),
	validator = require('validator');

var index = require('./routes/indexController');
var login = require('./routes/loginPost');

var grabNutrition = require('./resources/grabNutrition.js');
var processFoods = require('./resources/processFood.js');
var generateRecipes = require('./resources/my_generator_algorithm.js');


var dbRef = new firebase('https://whatsinmyfridge.firebaseIO.com/');

var users = dbRef.child('USERS');

var app = express();

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
	if(req.session.userId) {
		res.render('index', {user: req.session.userId});
		console.log(req.session.userId);
	}
	else
		res.render('index');
});

app.get('/profile', function(req, res) {
	res.render('profile');
});

app.get('/login', function(req, res) {
	res.render('login');
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

app.use(function(req, res) {
	res.status(404).render('404');
});

app.listen(process.env.PORT || 3000)