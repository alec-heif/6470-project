exports.loginAuth = function (req, res, dbRef, bcrypt) {
	var validator = require('validator');
	var email = validator.toString(req.body.username);
	if(!validator.isEmail(email)) {
		res.send('INVALID_EMAIL');
		return;
	}
	var password = validator.toString(req.body.password);
	var escaped_email = escapeEmailAddress(email);
	var user = dbRef.child('USERS').child(escaped_email);
	user.once('value', function(snapshot) {
		if(snapshot.val() === null) {
			res.send('UNKNOWN_EMAIL');
		}
		else {
			bcrypt.compare(password, snapshot.val().password, function(err, result) {
				if(result) {
					req.session.user_id = escaped_email;
    				res.send('SUCCESS');
				}
				else {
					res.send('INVALID_PASSWORD')
				}
			});
		}
	})
}

exports.createAccount = function (req, res, dbRef, bcrypt) {
	var validator = require('validator');
	var email = validator.toString(req.body.username);
	if(!validator.isEmail(email)) {
		res.send('INVALID_EMAIL');
		return;
	}

	var password = validator.toString(req.body.password);
	var confirmPassword = validator.toString(req.body.confirmPassword);
	if(password !== confirmPassword) {
		res.send('INVALID_CONFIRM');
		return;
	}

	var escaped_email = escapeEmailAddress(email);
	var user = dbRef.child('USERS').child(escaped_email);
	user.once('value', function(snapshot) {
		if(snapshot.val() !== null) {
			res.send('EMAIL_EXISTS');
		}
		else {
			bcrypt.hash(password, 8, function(err, hash) {
				req.session.user_id = escaped_email;
				user.set({'password': hash});
				res.send('SUCCESS');
			});
		}
	})
}

// Replaces '.' (not allowed in a Firebase key) with ','
function escapeEmailAddress(email) {
  return email.toLowerCase().replace(/\./g, ',');
}
