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
	$('.tt-hint').css('top','16px');                                                 
});

$(window).load(function() {
	$('myModal').modal('show');
})

function process(data, status) {
	console.log(data);
	if(data == 'SUCCESS') {
		var profile_url = window.location.protocol + "//" + window.location.host + "/profile";
		window.location.href = profile_url;
	}
}

$(document).ready(function(req, res) {
	$('#loginAccount').submit(function(e) {
		e.preventDefault();
		var input = $(this).serialize();
		$.post('/loginAccount', input, process);
	});

	$('#createAccount').submit(function(e) {
		e.preventDefault();
		var input = $(this).serialize();
		$.post('createAccount', input, process);

	})
});