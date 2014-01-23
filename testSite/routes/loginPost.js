exports.loginAuth = function (req, res, dbRef, bcrypt) {
	var validator = require('validator');
	var email = validator.toString(req.body.username);
	var data = {};
	if(!validator.isEmail(email)) {
		data.invalid = "Invalid email.";
		res.send(data);
		return;
	}
	var password = validator.toString(req.body.password);
	var escaped_email = escapeEmailAddress(email);
	var user = dbRef.child('USERS').child(escaped_email);
	user.once('value', function(snapshot) {
		if(snapshot.val() === null) {
			data.email = "Email does not exist.";
		}
		else {
			bcrypt.compare(password, snapshot.val().password, function(err, result) {
				if(result) {
					req.session.user_id = escaped_email;
    				data.success = "Success!";
				}
				else {
					data.password = "Incorrect password.";
				}
				res.send(data);

			});
		}
		res.send(data);
	});
}

exports.addIngredient = function(req, res) {
	var ingredients = dbRef.child('INGREDIENTS')
}







exports.createAccount = function (req, res, dbRef, bcrypt) {
	var validator = require('validator');
	var email = validator.toString(req.body.username);
	var data = {};
	if(!validator.isEmail(email)) {
		data.invalid = "Invalid email.";
		res.send(data);
		return;
	}

	var password = validator.toString(req.body.password);
	var confirmPassword = validator.toString(req.body.confirmPassword);
	if(password !== confirmPassword) {
		data.confirm = "Passwords don't match."
		res.send(data);
		return;
	}

	var escaped_email = escapeEmailAddress(email);
	var user = dbRef.child('USERS').child(escaped_email);
	user.once('value', function(snapshot) {
		if(snapshot.val() !== null) {
			data.email = "Email address taken."
		}
		else {
			bcrypt.hash(password, 8, function(err, hash) {
				req.session.user_id = escaped_email;
				user.set({'password': hash, recipes_written: [], recipes_cooked: [], });
				data.success = "Success!";
			});
		}
		res.send(data);
	});


}

// Replaces '.' (not allowed in a Firebase key) with ','
function escapeEmailAddress(email) {
  return email.toLowerCase().replace(/\./g, ',');
}
