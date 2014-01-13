var express = require('express'),
	stylus = require('stylus'),
	nib = require('nib'),
	mocha = require('mocha'),
	grunt = require('grunt'),
	mongoose = require('mongoose');

var index = require('./routes/indexController');

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

app.get('/', index.display);
app.post('/', index.process);
app.get('/profile', function(req, res) {
	res.render('profile');
})
app.use(function(req, res) {
	res.status(404).render('404');
});

app.listen(3000);