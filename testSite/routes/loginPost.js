exports.loginPost= function(req, res) {
	var data = req.body;
	(data.username == 'user' && data.password == 'password') ? res.send('pass') : res.send('fail');
}