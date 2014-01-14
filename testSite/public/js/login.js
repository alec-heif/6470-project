$(document).ready(function(req, res) {
	$('#login').submit(function(e) {
		e.preventDefault();
		var input = $(this).serialize();
		$.post('/login', input, process);

		function process(data, status) {
			console.log(data);
			console.log(status);
		}
	});
});

