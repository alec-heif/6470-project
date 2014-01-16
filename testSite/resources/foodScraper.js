function splitAll() {
	var fs = require('fs');
	var request = require('request');
	var result = {};
	var str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".toLowerCase();
	function splitString(string) {
		request(string, function(e, res, body) {
			var returned = body.replace("[ ", '').replace(' ]', '').replace(/\"/g, "").split(', ');
			for(var k = 0; k < returned.length; k++) {
				if(!result[returned[k]]) {
					result[returned[k]] = true;
				}
			}
		});
	}
	for(var i = 0; i < str.length; i++) {
		for(var j = 0; j < str.length; j++) {
				var req = 'http://supercook.com/dyn/autoc?term=' + str[i] + str[j];
				splitString(req);
		}
	}
	setTimeout(function() { 
		fs.writeFile( './resources/simple_foods.json', JSON.stringify(result, null, 4), function(err){
	        if ( err ) throw err;
	        console.log('ok');
	    });
	}, 60000);
};