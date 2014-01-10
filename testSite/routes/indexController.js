
/*
 * GET home page.
 */

exports.display = function(req, res){
	res.render('index', { message: 'Express' });
};

exports.process = function(req, res) {
	console.log('test');
    console.log(req.body);
};