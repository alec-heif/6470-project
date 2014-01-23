'use strict';
module.exports = function grabNutrition() {
	var fs = require('fs');

	// open the file
	fs.readFile('./resources/simple_foods.json','utf8',function(err,data){
		fs.readFile('.resources/output.json','utf8', function(err2, data2) {
			if (err) throw err;
		    var output = [];

		    // parse the file from a string into an object
		    var food_names = JSON.parse(data);
		    var food_data = JSON.parse(data2);
		    food_names.forEach(function(curr_name,i) {
		    	var element = {
		    		name: curr_name
		    	};

	    		curr_name = curr_name.split();
	    		var max_length = 1000;
	    		var curr_id = -1;
	    		food_data.forEach(function(curr_val,j) {
	    			var count = 0;
	    			var possible_name = curr_val.description;
	    			curr_name.forEach(function(curr_word, k) {
	    				if(possible_name.indexOf(curr_word) !== -1) {
	    					count++;
	    				}
	    			});
	    			if(count == curr_name.length && possible_name.length < max_length) {
	    				max_length = possible_name.length;
	    				curr_id = j;
	    			}
	    		});
	    		element.id = curr_id;
	    		output.push(element);
	    		console.log(i)
		    });

		    fs.writeFile( './resources/final_table.json', JSON.stringify(output, null, 4), function(err){
		        if ( err ) throw err;
		        console.log('ok');
		    });
		});    
	});
}