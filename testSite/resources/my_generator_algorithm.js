function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}

module.exports.generateNames = function generateNames() {
	var fs = require('fs'),
		firebase = require('firebase');
	fs.readFile('./resources/name_table.json','utf8',function(err,data){
		var output = [];
		var dbRef = new firebase('https://whatsinmyfridge.firebaseIO.com/');
		var nameRef = dbRef.child('INGREDIENT_NAMES');
		var idRef = dbRef.child('INGREDIENTS');
		nameRef.once('value', function(nameSnap) {
			idRef.once('value', function(idSnap) {
				var ing_names = nameSnap.val();
				var ing_ids = idSnap.val();
				var ingredients = Object.keys(JSON.parse(data));
				for(var a = 0; a < ingredients.length; a++) {
					var ng = ingredients[a];
					ing_names[ng]['recipes'] = [];
					var id = ing_names[ng].id;
					ing_ids[id]['recipes'] = [];
				}
				var linker = ['with', 'and', 'in', 'served with', 'topped with', 'drizzled over', 'caked in', 'hinted with', 'dashed with', 'covered in', 'paired with'];
				var adjective = [
								"curried",
								"spicy",
								"smoked",
								"warm",
								"cold",
								"hot",
								"browned",
								"fresh",
								"crispy",
								"dried",
								"sweet",
								"sour",
								"savoury",
								"bitter",
								"salted",
								"salty",
								"frozen",
								"chilled"
								];
				var technique = [
								"stuffed",
								"pan-fried",
								"deep-fried",
								"slow cooked",
								"poached",
								"scrambled",
								"fried",
								"baked",
								"braised",
								"sauteed",
								"flambed",
								"crushed",
								"mashed",
								"grilled",
								"boiled",
								"steamed",
								"confit",
								"caramelized",
								"roast"
							];
				var product = [
								"pie",
								"salad",
								"flan",
								"stew",
								"ragout",
								"curry",
								"cookie",
								"puree",
								"sauce",
								"bake",
								"cake",
								"tart",
								"quiche",
								"hotpot",
								"souffle",
								"crisp",
								"brownie",
								"jelly",
								"pasta",
								"cornbread",
								"loaf",
								"bun",
								"noodles",
								"sorbet",
								"chutney",
								"syrup",
								"bread",
								"casserole",
								"butter",
								"lasagna",
								"marmalade",
								"jam",
								"martini",
								"cocktail"
							];
				var mixings = ['mix', 'mash', 'combine', 'stir', 'blend', 'merge', 'put', 'spoon', 'slowly mix', 'inject'];
				var containers = ['small bowl', 'large pot', 'small pot', 'blender', 'oven', 'microwave', 'convection oven', 'mixing bowl', 'pan', 'saucepan', 'container'];

				var output = [];
				for (var i = 0; i < 10000; i++) {
					var recipe = {};
					recipe.ingredients = [];
					recipe.id = i;
					recipe.name = "";
					recipe.name += rand([rand(technique), rand(adjective)]) + ' ';
					var ing = addIngredient(recipe, rand(ingredients), ing_names, ing_ids, i, ingredients);
					recipe.name += ing + ' ';

					recipe.name += rand(linker) + ' ';

					recipe.name += rand([rand(technique), rand(adjective)]) + ' ';

					ing = addIngredient(recipe, rand(ingredients), ing_names, ing_ids, i, ingredients);
					recipe.name += ing;
					if(Math.random() > 0.7)
						recipe.name += ' ' + rand(product);
					var extraIngredients = Math.floor(Math.random()*4);
					for(var j = 0; j < extraIngredients; j++) {
						addIngredient(recipe, rand(ingredients), ing_names, ing_ids, i, ingredients);
					}
					recipe.steps = [];
					for(var l = 0; l < recipe.ingredients.length; l++) {
						var curr = recipe.ingredients[l];
						updateIngredientsLists(recipe, curr, ing_names, ing_ids, i);
					}
					for(var k = 0; k < recipe.ingredients.length; k+=2) {
						var string = "";
						if(k !== recipe.ingredients.length-1) {
							string = rand(mixings) + ' ' + recipe.ingredients[k] + ' and ' + recipe.ingredients[k+1] + ' in ' + rand(containers);
						}
						else {
							string = 'add ' + recipe.ingredients[k];						
						}
						recipe.steps.push(string);
					}
					recipe.steps.push('combine all ingredients together and serve ' + rand(technique));
					output.push(recipe);
					console.log(i);
				}
				nameRef.set(ing_names);
				console.log('names set');
				idRef.set(ing_ids);
				console.log('ids set');
				fs.writeFile( './resources/generated_recipes.json', JSON.stringify(output, null, 4), function(err){
				    if ( err ) throw err;
				    console.log('ok');
				});
				fs.writeFile( './resources/new_names.json', JSON.stringify(ing_names, null, 4), function(err){
				    if ( err ) throw err;
				    console.log('ok');
				});
				fs.writeFile( './resources/new_ids.json', JSON.stringify(ing_ids, null, 4), function(err){
				    if ( err ) throw err;
				    console.log('ok');
				});
				var recipesRef = dbRef.child('RECIPES');
				recipesRef.set(output);
				console.log('recipes set');
			});
		});
	});
}


function addIngredient(recipe, ingredient, ing_names, ing_ids, i, ingredients) {
	if(isInArray(ingredient, recipe.ingredients)) {
		return addIngredient(recipe, rand(ingredients), ing_names, ing_ids, i, ingredients);
	}
	recipe.ingredients.push(ingredient);
	return ingredient;
}

function updateIngredientsLists(recipe, ingredient, ing_names, ing_ids, i) {
	var data = {id: i, ingredients: recipe.ingredients};
	ing_names[ingredient]['recipes'].push(data);
	var id = ing_names[ingredient].id;
	ing_ids[id]['recipes'].push(data);
}


function rand(list) {
	var rand = Math.floor(Math.random()*list.length);
	return list[rand];
}

function isInArray(value, array) {
  return array.indexOf(value) > -1;
}

