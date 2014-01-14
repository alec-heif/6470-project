var express = require('express'),
	stylus = require('stylus'),
	nib = require('nib'),
	mocha = require('mocha'),
	grunt = require('grunt'),
	firebase = require('firebase');

var index = require('./routes/indexController');
var login = require('./routes/loginPost');
var db = new firebase('https://whatsinmyfridge.firebaseIO.com/');

var app = express();

function compile(str, path) {
	return stylus(str)
		.set('filename', path)
		.use(nib());
}

function processFood() {
	var fs = require('fs');

	// open the file
	fs.readFile('./resources/foods.json','utf8',function(err,data){
	    if (err) throw err;
	    var output = [];

	    // parse the file from a string into an object
	    data = JSON.parse(data);

	    // Loop through each element
	    data.forEach(function(d,i){
	    	if(i == 0) console.log(d);
	        // decide which parts of the object you'd like to keep
	        var element = {
	            name: d.description,
	            group: d.group
	        };

	        var BreakException = {};

	        // for example here I'm just keeping vitamins
	        try {
		        d.nutrients.forEach(function(n,i){
		            if ( n.description.indexOf("Energy") == 0 && n.units.indexOf("kcal") == 0) {
		            	element.calories = n.value;
		            	throw BreakException;
		            }
		        });
		    }
		    catch(e) {
    			if (e!==BreakException) throw e;
			}

	        output.push(element);
	    });

	    fs.writeFile( './resources/output.json', JSON.stringify(output, null, 4), function(err){
	        if ( err ) throw err;
	        console.log('ok');
	    });
	});
}

processFood();

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