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
		document.cookie = data.username;
		var profile_url = window.location.protocol + "//" + window.location.host + "/";
		window.location.href = profile_url;
	}

}

function unEscapeEmailAddress(email) {
  return email.toLowerCase().replace(',', '/\./g');
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
		var profile_url = window.location.protocol + "//" + window.location.host + "/";
		window.location.href = profile_url;

	}
}

function addIngredient(data, status) {
	$('#addIngredient').val('').typeahead('setQuery', '');
	if(!data.errors) {
		if(curr_ingredients[data.name.toLowerCase()]) {
			increaseCount(data);
		}
		else {
			$('#quantity').append('<p class="unselectable">' + 
				'<span class="glyphicon glyphicon-plus-sign quantityAdder unselectable" id="' + data.id + 'add">' + 
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
	$('.recipeHeader').html('');
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
	var socket = io.connect('http://localhost');
	var enteredIngredients = {};
	var recipeIdsToCloseness = {};
	var closenessToRecipeGroupings = {};
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
		var input = $('#addIngredient').val();
		socket.emit('addIngredient', {'input': input});
		$('#addIngredient').val('').typeahead('setQuery', '');

	});

	function increaseCount(data) {
		var currCount = parseInt($('#' + data.id + 'quantity').html());
		currCount+=1;
		var currIngredient = enteredIngredients[data.name.toLowerCase()]
		currIngredient.quantity += 1;
		$('#' + data.id + 'quantity').html(currCount.toString());
		$('#' + data.id + 'calories').html(currCount * currIngredient.calories);
	}

	function decrementCloseness(currRecipeId) {
		var closeness = recipeIdsToCloseness[currRecipeId];
		var currRecipe = closenessToRecipeGroupings[closeness][currRecipeId];
		if(closeness > 0) {
			var copy = _.clone(currRecipe);
			try {
				//copy recipe to new (decremented) bucket
				closenessToRecipeGroupings[closeness-1][currRecipeId] = copy;
				//delete recipe from current bucket
				//EXTREMELY IMPORTANT: do not make this a variable, delete ONLY	 
				//works with the actual instance NOT even a variable referencing it.
				delete closenessToRecipeGroupings[closeness][currRecipeId];
				console.log(closenessToRecipeGroupings[closeness][currRecipeId]);
			}
			catch(err) {

				//decremented bucket not initialized
				closenessToRecipeGroupings[closeness-1] = {};
				closenessToRecipeGroupings[closeness-1][currRecipeId] = copy;
				//delete recipe from current bucket
				delete closenessToRecipeGroupings[closeness][currRecipeId];
			}
		}
		else {
			//also should never happen but whatevs
			console.log("Closeness of 0 tried to lower");
		}
	}

	function addRecipes(recipes) {
		var newRecipes = [];
		for(var i = 0; i < recipes.length; i++) {
			var currRecipeId = recipes[i];
			if(recipeIdsToCloseness[currRecipeId]) {
				//Recipe matches at least one other ingredient, decrement its closeness
				decrementCloseness(currRecipeId);
			}
			else {
				//Recipe is new, get full info for it.
				newRecipes.push(currRecipeId);
			}
		}
		console.log("ADDED RECIPES");
		socket.emit('newRecipes', newRecipes);
	}

	socket.on('recipeResponse', function(data) {
		console.log('got recipes');
		for(var i = 0; i < data.length; i++) {
			var curr = data[i];
			if(recipeIdsToCloseness[curr.id]) {
				//Recipe got added during async, just decrement it
				decrementCloseness(curr.id);
			}
			else {
				//Recipe was still not added, so add it and assume it matches nothing
				var closeness = curr.ingredients.length - 1;
				if(closeness >= 0) {
					recipeIdsToCloseness[curr.id] = closeness;
					try {
						closenessToRecipeGroupings[closeness][curr.id] = curr;
					}
					catch(err) {
						//recipes not initialized
						closenessToRecipeGroupings[closeness] = {};
						closenessToRecipeGroupings[closeness][curr.id] = curr;
					}
				}
				else {
					//should never happen
					console.log("Recipe with 0 ingredients");
				}
			}
		}
		console.log("RESPONDED TO RECIPES");
		computeDisplayedRecipes();
	});

	function computeDisplayedRecipes() {
		var closeness = 0;
		var count = 0;
		var result = [];
		while(count < 30) {
			if(closeness >= closenessToRecipeGroupings.length) {
				break;
			}
			else if(closenessToRecipeGroupings[closeness]) {
				result[closeness] = [];
				var level = closenessToRecipeGroupings[closeness];
				var keys = Object.keys(level);
				for(var i = 0; i < keys.length; i++) {
					var currKey = keys[i];
					if(count >= 30) {
						break;
					}
					else {
						result[closeness].push(level[currKey]);
						count++;
					}
				}
				closeness++;
			}
			else {
				//empty bucket, move on
				closeness++;
				continue;
			}
		}
		console.log("FOUND DISPLAYED RECIPES");
		displayRecipes(result);
	}

	function displayRecipes(recipes) {
		if(recipes.length > 0) {
			$('.nameOfRecipe').html('');
			$('.recipeHeader').html('');
			$('.recipeHeader').append('<h2>Recipes Found!</h2><div class="list-group"');
			$('.call-to-action').html('');
			for(var i = 0; i < recipes.length; i++) {
				var closenessBucket = recipes[i];
				if(closenessBucket) {
					for(var j = 0; j < closenessBucket.length; j++) {
						var curr = closenessBucket[j];
						$('.nameOfRecipe').append('<a class="list-group-item" data-toggle = "modal" href="#recipe' + curr.id + 'modal" >' + i + ' ingredients in common: ' + capitalize(curr.name) + '</a>');
						$('.nameOfRecipe').append(getRecipeModal(curr));
					}
				}
			}
		}
	}

	function getRecipeModal(recipe) {
		var result = '<div id="recipe' + recipe.id + 'modal" class="modal fade">' + 
	  '<div class="modal-dialog">' + 
	    '<div class="modal-content">' + 
	      '<div class="modal-header">' + 
	        '<button type="button" data-dismiss="modal" aria-hidden="true" class="close">&times;</button>' + 
	        '<h3 class="modal-title text-center">' + capitalize(recipe.name) + '</h3>' + 
	      '</div>' + 
	      '<div class="messages"></div>' + 
	      '<div class="modal-body">' + 
	      	'<h2 id="bitch">Ingredients:</h2>' + 
	      	'<div class="ingredients">';
	      	for(var i = 0; i < recipe.ingredients.length; i++) {
	      		result += "<p>" + capitalize(recipe.ingredients[i]) + "</p>";
	      	}
	      	result += '</div>' + 
	      '</div>' + 
	    '</div>' + 
	'</div>';
	return result;
	}

	socket.on('ingredientResponse', function(data) {
		if(!data.errors) {
			if(enteredIngredients[data.name.toLowerCase()]) {
				increaseCount(data);
			}
			else {
				$('#quantity').append('<p>' + 
					'<span class="glyphicon glyphicon-plus-sign quantityAdder" id="' + data.id + 'add">' + 
					'</span>' + ' <span id="' + data.id + 'quantity">1</span> ' + data.portions.unit + '</p>');
				$('#ingredientName').append('<p>' + capitalize(data.name) + ': ' + 
					'<span id="' + data.id + 'calories">' + data.calories + '</span>' + 
					' calories</p>');
				enteredIngredients[data.name.toLowerCase()] = {id: data.id, quantity: 1, recipes: data.recipes, calories: data.calories};
				$('#' + data.id + 'add').click(function() {
					increaseCount(data)
				});
				addRecipes(data.recipes);
				//possible_recipes = _.union(recipes, data.recipes);
				//processRecipes(recipes, curr_ingredients);
			}
		}
		else {
			alert(data.errors);
		}
	});
});


