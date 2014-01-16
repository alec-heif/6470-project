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

