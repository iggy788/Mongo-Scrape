
// =============================================================================
// When you Click ARTICLE NOTES this will display the notes
$(document).on("click", "#modalbutton", function () {
  // Empty Notes
  $("#notes").empty();
  // Save the ID VALUE from the button tag
  var thisId = $(this).attr("data-id");
  $("#articleID").text(thisId);
  // GET the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // Add Note to Page
    .done(function(data) {
	  console.log(data);

      $("#notes").append("<p id='actualnotes'></p>");
      if (data.notes) {
        $("#actualnotes").append("<ul id='notelist'>");
          for (var i = 0; i < data.notes.length; i++) {
            $('#notelist').append("<li id='" + data.notes[i]._id + "'>" + data.notes[i].body + " " +
            "<button data-id='" + data.notes[i]._id +
            "' id='deletenote'>X</button></li>");
          }
        $('#actualnotes').append("</ul>");
      } else {
        $('#actualnotes').text("There aren't any notes yet.");
      }
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
    });
});

// =============================================================================
// When you Click SAVE NOTE in the Modal this will save the notes
$(document).on("click", "#savenote", function() {
  var thisId = $(this).attr("data-id");
  // POST to Add Note
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    .done(function(data) {
      $("#notelist").empty();
      for (var i = 0; i < data.notes.length; i++) {
        $("#notelist").append("<li id='" + data.notes[i]._id + "'>" + data.notes[i].body + " " + "<button data-id='" + data.notes[i]._id +
        "' id='deletenote'>X</button></li>");
      }
    });
  $("#bodyinput").val("");
});

// =============================================================================
// When you Click DELETE FROM SAVED in the Modal this will save the notes
$(document).on("click", "#deletenote", function() {
  // Save the ID VALUE from the button tag
  var thisId = $(this).attr("data-id");
  // DELETE Request to Remove the Note
  $.ajax({
    method: "DELETE",
    url: "/articles/" + thisId,
  })
    .done(function(data) {
      $("#" + data._id).remove();
    });
});