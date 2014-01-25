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
			res.send(data);
			return;
		}
		else {
			bcrypt.compare(password, snapshot.val().password, function(err, result) {
				if(result) {
					req.session.user_id = escaped_email;
    				data.success = "Success!";
				}
				else {
					console.log('pass fail');
					data.password = "Incorrect password.";
				}
				res.send(data);

			});
		}
	});
}

exports.organizeRecipes = function organizeRecipes(recipes, curr_ingredients) {

}

exports.addIngredient = function(req, res, dbRef) {
	var ingRef = dbRef.child('INGREDIENT_NAMES/' + req.body.ingredient.toLowerCase());
	var data = {};
	ingRef.once('value', function(snapshot) {
		if(snapshot.val() === null) {
			res.send({errors: 'Invalid ingredient name'});
			return;
		}
		var ingredient = snapshot.val();
		data.name = req.body.ingredient;
		try {
			data.calories = ingredient.calories;
		}
		catch(err) {
			data.calories = "Unknown"
		}
		try {
			data.id = ingredient.id;
		}
		catch(err) {
			data.id = -1;
		}
		try {
			data.recipes = ingredient.recipes;
		}
		catch(err) {
			data.recipes = [];
		}
		try {
			data.quantity = ingredient.portions.amount;
		}
		catch(err) {
			data.quantity = 1;
		}
		try {
			data.unit = ingredient.portions.unit;
		}
		catch(err) {
			data.unit = "unit";
		}
		res.send(data);
	})
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
			res.send(data);
			return;
		}
		else {
			bcrypt.hash(password, 8, function(err, hash) {
				req.session.user_id = escaped_email;
				user.set({'password': hash, recipes_written: [], recipes_cooked: [], });
				data.success = "Success!";
				res.render(data);
			});
		}
	});


}

// Replaces '.' (not allowed in a Firebase key) with ','
function escapeEmailAddress(email) {
  return email.toLowerCase().replace(/\./g, ',');
}
