$('#login').submit(function(e) {
    e.preventDefault(); // Prevents the page from refreshing
    var $this = $(this); // `this` refers to the current form element
    alert($this.attr('submit'))
    $.post(
        $this.attr('/submit'), // Gets the URL to sent the post to
        $this.serialize(), // Serializes form data in standard format
        function(data) { alert('test'); },
        "json" // The format the response should be in
    );
});