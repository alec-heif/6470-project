$(document).ready(function(req, res) {
   $('.ing_typeahead').typeahead({                                
		name: 'ingredients',                                                          
		prefetch: {
			url: '/resources/final_table.json',
			ttl: 0,
			filter: function(data) {
				datum = [];
				for (var i = 0; i < data.length; i++) {
                	datum.push(data[i].name);
            	}
            	return datum;
			}
		}
	});
	$('.typeahead.input-sm').siblings('input.tt-hint').addClass('hint-small');
	$('.typeahead.input-lg').siblings('input.tt-hint').addClass('hint-large');  
	$('.tt-hint').css('top','16px').css('background-color', '#f9f3d1');                                                
});

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
	}

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
	}
}

function addIngredient(data, status) {
	$('#plusSign').append('<div><a href="#">' + 
		'<span class="glyphicon glyphicon-plus">' + 
		'</span>' +
		'</a></div>');
}

$(document).ready(function(req, res) {
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
		var input = $(this).serialize();
		$.post('/addIngredient', input, addIngredient);
	})
});


