module.exports = function processFood() {
	var fs = require('fs');

	// open the file
	fs.readFile('./resources/foods.json','utf8',function(err,data){
	    if (err) throw err;
	    var output = [];

	    // parse the file from a string into an object
	    data = JSON.parse(data);

	    // Loop through each element
	    data.forEach(function(d,i){
	    	if(i == 0) console.log(d);
	        // decide which parts of the object you'd like to keep
	        var element = {
	            name: d.description,
	            group: d.group
	        };

	        var BreakException = {};

	        // for example here I'm just keeping vitamins
	        try {
		        d.nutrients.forEach(function(n,i){
		            if ( n.description.indexOf("Energy") == 0 && n.units.indexOf("kcal") == 0) {
		            	element.calories = n.value;
		            	throw BreakException;
		            }
		        });
		    }
		    catch(e) {
    			if (e!==BreakException) throw e;
			}

	        output.push(element);
	    });

	    fs.writeFile( './resources/output.json', JSON.stringify(output, null, 4), function(err){
	        if ( err ) throw err;
	        console.log('ok');
	    });
	});
}