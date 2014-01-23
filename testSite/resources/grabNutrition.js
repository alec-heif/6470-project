module.exports.grabNutrition = function grabNutrition() {
	var fs = require('fs');

	// open the file
	fs.readFile('./resources/simple_foods.json','utf8',function(err,data){
		fs.readFile('./resources/simple_foods_with_id.json','utf8', function(err2, data2) {
			//if (err) throw err;
		    var output = [];
		    // parse the file from a string into an object
		    var food_names = JSON.parse(data);
		    var food_data = JSON.parse(data2);
		    console.log('ran');


		    food_names.forEach(function(curr_name,i) {
		    	var element = {
		    		name: curr_name
		    	};

	    		curr_name = curr_name.split(' ');
	    		var curr_id = findName(curr_name.length, food_data, curr_name, i);
	    		element.id = curr_id;
	    		output.push(element);
	    		console.log(i)
		    });

		    fs.writeFile( './resources/combined_table.json', JSON.stringify(output, null, 4), function(err){
		        if ( err ) throw err;
		        console.log('ok');
		    });
		});    
	});
}

function findName(occurences, food_data, curr_name, i) {
	var max_length = 10000;
	var max_index_length = 10000;
	var curr_id = -1;
	food_data.forEach(function(curr_val,j) {
		var count = 0;
		var possible_name = curr_val.name.toLowerCase();
		/*if(i===4) {
			console.log(possible_name);
			console.log(curr_name);
		}*/
		var curr_if = 0;
		curr_name.forEach(function(curr_word, k) {
			curr_if = 0;
			if(possible_name.indexOf(curr_word) !== -1) {
				count++;
				curr_if += possible_name.indexOf(curr_word);
			}
			curr_if /= (count * 1.0);
		});
		if(count >= occurences && possible_name.length <= max_length && curr_if <= max_index_length) {
			max_length = possible_name.length;
			max_index_length = curr_if;
			curr_id = j;
		}
	});
	if(curr_id === -1) {
		if(occurences > 1) {
			return findName(occurences-1, food_data, curr_name);
		}
		else {
			return -1;
		}
	}
	return curr_id;
}

module.exports.removeInvalidFoods = function removeInvalidFoods() {
	var fs = require('fs');

	// open the file
	fs.readFile('./resources/combined_table.json','utf8',function(err,data){
	    var output = [];
	    // parse the file from a string into an object
	    var foods = JSON.parse(data);

	    foods.forEach(function(curr,i) {
	    	if(curr.id !== -1 && curr.name !== "") {
	    		var element = {
	    			name: curr.name,
	    			id: curr.id
	    		};
	    		output.push(element);
	    	}
	    });

	    fs.writeFile( './resources/combined_valid_table.json', JSON.stringify(output, null, 4), function(err){
	        if ( err ) throw err;
	        console.log('ok');
	    });
	});
}

module.exports.fillNutritionInfo = function fillNutritionInfo() {
	var fs = require('fs');

	// open the file
	fs.readFile('./resources/combined_valid_table.json','utf8',function(err,data){
		fs.readFile('./resources/simple_foods_with_id.json','utf8', function(err2, data2) {
			//if (err) throw err;
		    var output = [];
		    // parse the file from a string into an object
		    var food_names = JSON.parse(data);
		    var food_data = JSON.parse(data2);
		    console.log('ran');


		    food_names.forEach(function(curr_name,i) {
		    	var element = {
		    		name: curr_name.name,
		    		id: i
		    	};

	    		var match = food_data[curr_name.id];
	    		element.calories = match.calories;
	    		element.protein = match.protein;
	    		element.fat = match.fat;
	    		element.carbs = match.carbs;
	    		element.portions = match.portions[0];
	    		element.overall_id = curr_name.id;
	    		output.push(element);
		    });

		    fs.writeFile( './resources/final_table.json', JSON.stringify(output, null, 4), function(err){
		        if ( err ) throw err;
		        console.log('ok');
		    });
		});    
	});
}

module.exports.createIdTable = function createIdTable() {
	var fs = require('fs');

	// open the file
	fs.readFile('./resources/final_table.json','utf8',function(err,data){
	    var output = {};
	    // parse the file from a string into an object
	    var foods = JSON.parse(data);
	    var element = {};
	    foods.forEach(function(curr,i) {
	    	element = {};
	    	element.calories = curr.calories;
	    	element.protein = curr.protein;
	    	element.fat = curr.fat;
	    	element.carbs = curr.carbs;
	    	element.id = curr.id;
	    	element.overall_id = curr.overall_id;
	    	element.portions = curr.portions;
	    	output[curr.name] = element;
	    });

	    fs.writeFile( './resources/name_table.json', JSON.stringify(output, null, 4), function(err){
	        if ( err ) throw err;
	        console.log('ok');
	    });
	});
}





