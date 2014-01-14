exports.loginPost= function(req, res) {
	var data = req.body;
	dbRef.once('value', function(snapshot) {
		
	})


	(data.username == 'user' && data.password == 'password') ? res.send('pass') : res.send('fail');
}