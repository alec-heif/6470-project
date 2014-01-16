$(document).ready(function(req, res) {
   $('.ing_typeahead').typeahead({                                
		name: 'ingredients',                                                          
		prefetch: {
			url: '/resources/simple_foods.json',
			ttl: 0
		},
	});
	$('.typeahead.input-sm').siblings('input.tt-hint').addClass('hint-small');
	$('.typeahead.input-lg').siblings('input.tt-hint').addClass('hint-large');                                                   
});

