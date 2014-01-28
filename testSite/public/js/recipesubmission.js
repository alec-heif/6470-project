entered_ingredients = {};
possible_recipes = [];

function capitalize(s) {
	s = s.replace(/\w+/g,
        function(w){return w[0].toUpperCase() + w.slice(1).toLowerCase();});
	return s;
}

$('#recipeNameInput').bind('keyup', function(e) {
	var value = $(this).val();
	if(value.length > 0)
		$('.recipeNameOutput').html(value);
	else
		$('.recipeNameOutput').html("New Recipe");
});

$('#peopleServedAdder').click(function() {
	increaseServingCount()
});

$('#peopleServedSubtractor').click(function() {
	decreaseServingCount()
});

function increaseCount(data) {
	var currCount = parseInt($('#' + data.id + 'quantity').html());
	currCount+=1;
	var currIngredient = enteredIngredients[data.name.toLowerCase()]
	currIngredient.quantity += 1;
	$('#' + data.id + 'quantity').html(currCount.toString());
	$('#' + data.id + 'calories').html(currCount * currIngredient.calories);
}

function increaseServingCount() {
	var currCount = parseInt($('#servedCount').html());
	currCount+=1;
	$('#servedCount').html(currCount.toString());
	if(currCount !== 1)
		$('#servedUnit').html(" people");
	else
		$('#servedUnit').html(" person");
}

$('.dropdown-menu li').click(function(e){
	e.preventDefault();
	  var selected = $(this).text();
	  $('.category').val(selected);  
	  $('.newText').html(selected);
});

function decreaseServingCount() {
	var currCount = parseInt($('#servedCount').html());
	currCount-=1;
	if(currCount > -1) {
		$('#servedCount').html(currCount.toString());
		if(currCount !== 1)
			$('#servedUnit').html(" people");
		else
			$('#servedUnit').html(" person");
	}
}

$(document).ready(function(req, res) {
	var enteredIngredients = {};
	var socket = io.connect('http://localhost');
	var stepCount = 1;
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


	$('#ingredientForm').submit(function(e) {
		e.preventDefault();
		var input = $('#addIngredient').val();
		socket.emit('addIngredient', {'input': input});
		$('#addIngredient').val('').typeahead('setQuery', '');
	});

	$('#stepForm').submit(function(e) {
		e.preventDefault();
		var result = {};
		result.name = $('#recipeNameInput').val();
		result.serves = parseInt($('#servedCount').html());
		result.time = $('#time').val();
		result.summary = $('#summary').val();
		result.ingredients = Object.keys(enteredIngredients);
		result.steps = [];
		for(var i = 1; i <= stepCount; i++) {
			result.steps.push($('#step' + i).val());
		}
		console.log(result);
		alert('Successfully submitted!');
		socket.emit('addRecipe', result);
		window.location.href = window.location.protocol + "//" + window.location.host + "/";

	}) ;

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
				//possible_recipes = _.union(recipes, data.recipes);
				//processRecipes(recipes, curr_ingredients);
			}
		}
		else {
			alert(data.errors);
		}
	});
	$('#addStep').click(function(e) {
		e.preventDefault();
		stepCount++;
		$('.steps').append("<textarea class='step' placeholder = 'Step " + stepCount + "' name='step" + stepCount + "' id='step" + stepCount + "'></textarea>");
	});
});





function submitRecipes(recipe, curr_ingredients) {

}

//var nextId = 1
//  , container = document.getElementById('#container');

//function addStep() {
//    var d = document.createElement("h2");
//    var txt = document.createElement("textarea.step-area")
//    var b = document.createElement("button.btn.step-button")
//    document.destroyElement
//    d.id = "div" + nextId;
//    b.onclick = addStep;
//    d.innerHTML = "Step" + nextId ;
//    container.appendChild(d);
//    nextId += 1;
//}

//addStep();