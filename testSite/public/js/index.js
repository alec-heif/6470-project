$(document).ready(function(req, res) {
   $('.ing_typeahead').typeahead({                                
		name: 'ingredients',                                                          
		prefetch: {
			url: '/resources/final_table.json',
			ttl: 0,
			filter: function(data) {
				datum = [];
				for (var i = 0; i < data.length; i++) {
                	datum.push(capitalize(data[i].name));
            	}
            	return datum;
			}
		}
	});
	$('.typeahead.input-sm').siblings('input.tt-hint').addClass('hint-small');
	$('.typeahead.input-lg').siblings('input.tt-hint').addClass('hint-large');  
	$('.tt-hint').css('top','16px').css('background-color', '#f9f3d1');   

});

function capitalize(s) {
	s = s.replace(/\w+/g,
        function(w){return w[0].toUpperCase() + w.slice(1).toLowerCase();});
	return s;
}

$(window).load(function() {
	$('myModal').modal('show');
})

function loginProcess(data, status) {
	$('#loginUser').removeClass('has-error');
	$('#loginUser .help-block').empty();
	$('#loginPassword').removeClass('has-error');
	$('#loginPassword .help-block').empty();

	$('#messages').removeClass('alert alert-success').empty();

	if (!data.success) {
		if (data.invalid) {
			$('#loginUser').addClass('has-error');
			$('#loginUser .help-block').html(data.invalid);
		}
		else if (data.email) {
			$('#loginUser').addClass('has-error');
			$('#loginUser .help-block').html(data.email);
		}
		else if (data.password) {
			$('#loginPassword').addClass('has-error');
			$('#loginPassword .help-block').html(data.password);
		}

	} 
	else {
		// if validation is good add success message
		$('#messages').addClass('alert alert-success').append('<p>' + data.success + '</p>');
	}

}

function createAccountProcess(data, status) {
	$('#createUser').removeClass('has-error');
	$('#createUser .help-block').empty();
	$('#createConfirm').removeClass('has-error');
	$('#createConfirm .help-block').empty();

	$('#messages').removeClass('alert alert-success').empty();

	if ( !data.success) {
		if (data.invalid) {
			$('#createUser').addClass('has-error');
			$('#createUser .help-block').html(data.invalid);
		}
		else if (data.email) {
			$('#createUser').addClass('has-error');
			$('#createUser .help-block').html(data.email);
		}

		else if (data.confirm) {
			$('#createConfirm').addClass('has-error');
			$('#createConfirm .help-block').html(data.confirm);
		}

	} 
	else {
		// if validation is good add success message
		$('#messages').addClass('alert alert-success').append('<p>' + data.success + '</p>');
	}
}

var curr_ingredients = {};
recipes = [];
function addIngredient(data, status) {
	$('#addIngredient').val('').typeahead('setQuery', '');
	if(!data.errors) {
		if(curr_ingredients[data.name.toLowerCase()]) {
			increaseCount(data);
		}
		else {
			$('#quantity').append('<p>' + 
				'<span class="glyphicon glyphicon-plus-sign quantityAdder" id="' + data.id + 'add">' + 
				'</span>' + ' <span id="' + data.id + 'quantity">1</span> ' + data.unit + '</p>');
			$('#ingredientName').append('<p>' + capitalize(data.name) + ': ' + data.calories + ' calories</p>');
			curr_ingredients[data.name.toLowerCase()] = {id: data.id, quantity: 1, recipes: data.recipes};
			$('#' + data.id + 'add').click(function() {
				increaseCount(data)
			});
			recipes = _.union(recipes, data.recipes);
			processRecipes(recipes, curr_ingredients);
		}
	}
	else {
		alert(data.errors);
	}
}

function increaseCount(data) {
	var currCount = parseInt($('#' + data.id + 'quantity').html());
	currCount+=1;
	curr_ingredients[data.name.toLowerCase()].quantity += 1;
	$('#' + data.id + 'quantity').html(currCount.toString());
}

function getRecipes(recipes, curr_ingredients) {
	console.log(recipes);
	console.log(curr_ingredients);
	var output = [];
	for(var i = 0; i < recipes.length; i++) {
		var curr_rec = recipes[i];
		var valid = true;
		for(var j = 0; j < curr_rec.ingredients.length; j++) {
			if(!(curr_ingredients[curr_rec.ingredients[j]])) {
				valid = false
			}
		}
		if(valid) {
			console.log('match');
			output.push(curr_rec.id);
		}
	}
	return output;
}

function processRecipes(recipes, curr_ingredients) {
	$('.nameOfRecipe').html('');
	var valid_recipes = getRecipes(recipes, curr_ingredients);
	var results = {'first': true};
	for(var i = 0; i < valid_recipes.length; i++) {
		var curr_recipe = valid_recipes[i];
		var dbRef = new Firebase('https://whatsinmyfridge.firebaseIO.com/');
		var recipesRef = dbRef.child('RECIPES/' + curr_recipe);
		recipesRef.once('value', function(snapshot) {
			rec = snapshot.val();
			if(!results[rec.name]) {
				if(results.first) {
					$('.recipeHeader').append('<h2>Recipes Found!</h2>');
					results.first = false
				}
				$('.nameOfRecipe').append('<p>' + capitalize(rec.name) + '</p>');
				$('.call-to-action').html('');
				results[rec.name] = true;
			}
		});
	}
}

$(document).ready(function(req, res) {
	$('#loginAccount').submit(function(e) {
		e.preventDefault();
		var input = $(this).serialize();
		$.post('/loginAccount', input, loginProcess);
	});

	$('#createAccount').submit(function(e) {
		e.preventDefault();
		var input = $(this).serialize();
		$.post('/createAccount', input, createAccountProcess);
	});
	$('#ingredientForm').submit(function(e) {
		e.preventDefault();
		var input = $(this).serialize();
		$.post('/addIngredient', input, addIngredient);
	})
});


