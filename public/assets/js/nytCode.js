// Grab the articles as a json
$.getJSON("/articles", function(data) {
	// For each one
	for (var i = 0; i < data.length; i++) {
		// Display the apropos information on the page
		$("#articles").append(
			"<p data-id='" +
				data[i]._id +
				"'>" +
				data[i].title +
				"<br />" +
				data[i].link +
				"</p>"
		);
	}
});

// Whenever someone clicks a p tag
$(document).on("click", "p", function() {
	// Empty the notes from the note section
	$("#notes").empty();
	// Save the id from the p tag
	var thisId = $(this).attr("data-id");

	// Now make an ajax call for the Article
	$.ajax({
		method: "GET",
		url: "/articles/" + thisId
	})
		// With that done, add the note information to the page
		.then(function(data) {
			console.log(data);
			// The title of the article
			$("#notes").append("<h2>" + data.title + "</h2>");
			// An input to enter a new title
			$("#notes").append("<input id='titleinput' name='title' >");
			// A textarea to add a new note body
			$("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
			// A button to submit a new note, with the id of the article saved to it
			$("#notes").append(
				"<button data-id='" + data._id + "' id='savenote'>Save Note</button>"
			);

			// If there's a note in the article
			if (data.note) {
				// Place the title of the note in the title input
				$("#titleinput").val(data.note.title);
				// Place the body of the note in the body textarea
				$("#bodyinput").val(data.note.body);
			}
		});
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
	// Grab the id associated with the article from the submit button
	var thisId = $(this).attr("data-id");

	// Run a POST request to change the note, using what's entered in the inputs
	$.ajax({
		method: "POST",
		url: "/articles/" + thisId,
		data: {
			// Value taken from title input
			title: $("#titleinput").val(),
			// Value taken from note textarea
			body: $("#bodyinput").val()
		}
	})
		// With that done
		.then(function(data) {
			// Log the response
			console.log(data);
			// Empty the notes section
			$("#notes").empty();
		});

	// Also, remove the values entered in the input and textarea for note entry
	$("#titleinput").val("");
	$("#bodyinput").val("");
});


$(document).on("click", "#modalbutton", function() {
	// Empty the notes from the note section
	$("#notes").empty();
	// Save the id from the button tag
	var thisId = $(this).attr("data-id");
	$("#articleID").text(thisId);
	// Now make an ajax call for the Article
	$.ajax({
		method: "GET",
		url: "/articles/" + thisId
	})
		// With that done, add the note information to the page
		.done(function(data) {
			console.log(data);
			// Placeholder for notes
			$("#notes").append("<p id='actualnotes'></p>");
			if (data.notes) {
				$("#actualnotes").append("<ul id='notelist'>");
				for (var i = 0; i < data.notes.length; i++) {
					$("#notelist").append(
						"<li id='" +
							data.notes[i]._id +
							"'>" +
							data.notes[i].body +
							" " +
							"<button data-id='" +
							data.notes[i]._id +
							"' id='deletenote'>X</button></li>"
					);
				}
				$("#actualnotes").append("</ul>");
			} else {
				$("#actualnotes").text("There aren't any notes yet.");
			}
			// A textarea to add a new note body
			$("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
			// A button to submit a new note, with the id of the article saved to it
			$("#notes").append(
				"<button data-id='" + data._id + "' id='savenote'>Save Note</button>"
			);
		});
});
// When you click the savenote button
$(document).on("click", "#savenote", function() {
	// Grab the id associated with the article from the submit button
	var thisId = $(this).attr("data-id");
	// Run a POST request to change the note, using what's entered in the inputs
	$.ajax({
		method: "POST",
		url: "/articles/" + thisId,
		data: {
			// Value taken from note textarea
			body: $("#bodyinput").val()
		}
	})
		// With that done
		.done(function(data) {
			$("#notelist").empty();
			for (var i = 0; i < data.notes.length; i++) {
				$("#notelist").append(
					"<li id='" +
						data.notes[i]._id +
						"'>" +
						data.notes[i].body +
						" " +
						"<button data-id='" +
						data.notes[i]._id +
						"' id='deletenote'>X</button></li>"
				);
			}
		});
	// Also, remove the values entered in the input and textarea for note entry
	$("#bodyinput").val("");
});
// When you click the deletenote button
$(document).on("click", "#deletenote", function() {
	// Grab the id associated with the note
	var thisId = $(this).attr("data-id");
	// Run a POST request to delete the note
	$.ajax({
		method: "GET",
		url: "/notes/" + thisId
	})
		// With that done
		.done(function(data) {
			$("#" + data._id).remove();
		});
});