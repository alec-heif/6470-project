exports.handle = function(socket, dbRef) {
	socket.on('addIngredient', function(data) {
		data.input = data.input.toLowerCase();
		var ingredientRef = dbRef.child('INGREDIENT_NAMES/' + data.input);
		ingredientRef.once('value', function(snapshot) {
			if(snapshot.val() != null) {
				result = snapshot.val();
				result.name = data.input;
				socket.emit('ingredientResponse',result);
			}
			else {
				socket.emit('ingredientResponse', {'errors': 'Ingredient not found'});
			}
		});
	});

	socket.on('getRecipeInfo', function(data) {
		//do nothing for now
	});

	socket.on('newRecipes', function(data) {
		var results = [];
		console.log('Started getting recipe info');
		data.forEach(function(curr, i) {
			var childRef = dbRef.child('RECIPES/' + curr);
			childRef.on('value', function(snapshot) {
				if(snapshot.val() == null) {
					results.push(null);
				}
				else {
					results.push(snapshot.val());
				}
				if(results.length == data.length) {
					socket.emit('recipeResponse', results);
				}
			});
		});
	});
}