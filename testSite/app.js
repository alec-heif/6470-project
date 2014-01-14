var express = require('express'),
	stylus = require('stylus'),
	nib = require('nib'),
	mocha = require('mocha'),
	grunt = require('grunt'),
	firebase = require('firebase'),
	bcrypt = require('bcrypt');


var index = require('./routes/indexController');
var login = require('./routes/loginPost');

var processFood = require('./resources/processFood.js')

var dbRef = new firebase('https://whatsinmyfridge.firebaseIO.com/');

var app = express();


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

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	res.render('index');
});
app.post('/', index.process);

app.get('/profile', function(req, res) {
	res.render('profile');
})

app.get('/login', function(req, res) {
	res.render('login');
})
app.post('/login', login.loginPost)

app.use(function(req, res) {
	res.status(404).render('404');
});

app.listen(3000);