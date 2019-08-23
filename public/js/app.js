var updateFrontPage = function() {
  $("#the-news").empty();
  $.ajax({
    url: "/unsaved",
    method: "GET"
  }).then(function(data) {
    data.forEach(res => {
      $("#the-news").append("<div class='card mt-2' data-id='" +
        res._id +
        "'><div class='card-body'><h2>" +
        res.title +
        "</h2><p><em>" +
        res.info +
        "</em></p><a href='" +
        res.link +
        "' target='_blank'><p>" +
        res.link +
        "</p></a>" +
        "<button class='save-article btn btn-success' value='" +
        res._id +
        "'>Save!</button></div></div>"
      );
    });
  });
};

var updateNotes = function() {
  $(".your-notes").empty();
  $(".your-articles").each(function() {
    $.ajax({
      url: "/notes/" + $(this).attr("data-id"),
      type: "GET"
    }).then(function(data) {
      console.log(data);
      data.forEach(function(noteData) {
        $(".your-notes[data-id='" + noteData.articleId + "']").append("<div class='card mt-1 offset-1' style='width: 80%;' data-id='" +
          noteData._id +
          "'><div class='card-header'><h3>" +
          noteData.title +
          "</h3></div><div class='card-body'><p class='card-text d-inline-block'>" +
          noteData.body +
          "</p><button class='btn btn-danger delete-note float-right' value='" +
          noteData._id +
          "'>X</button></div></div>"
        );
      });
    });
  });   
};

// This function not used in this version -------------------------------
var updateOneNote = function(noteId) {
  $.ajax({
    url: "/note/" + noteId,
    type: "GET"
  }).then(function(data) {
    $(".your-notes[data-id='" + data.articleId + "']").append("<div class='card mt-1 offset-1' style='width: 80%;' data-id='" +
      data._id +
      "'><div class='card-header'><h3>" +
      data.title +
      "</h3></div><div class='card-body'><p class='card-text d-inline-block'>" +
      data.body +
      "</p><button class='btn btn-danger delete-note float-right' value='" +
      data._id +
      "'>X</button></div></div>"
    );
  });
};
// Above function not used in this version -------------------------------

var scrapeNow = function() {
  $.ajax({
      url: "/scrape",
      type: "GET"
  }).then(function(newData) {
    console.log("seen by front end");
    newData.forEach(function(data) {
      $.ajax({
        url: "/articles",
        type: "POST",
        data: data
      }).then(function(newData) {
        console.log(newData);
      });
    });
    updateFrontPage();
  });
};

var saveArticle = function() {
  var id = $(this).val();
  console.log(id);
  $.ajax({
    url: "articles/" + id,
    type: "PUT"
  }).then(function(data) {
    console.log("updated");
    console.log(data);
  });
  updateFrontPage();
};

var deleteArticle = function() {
  var id = $(this).val();
  $.ajax({
    url: "clear/" + id,
    type: "DELETE"
  }).then(function() {
    console.log("deleted");
    $(".your-articles[data-id='" + id + "']").remove(); 
    $.ajax({
      url: "/notes/" + id,
      type: "DELETE"
    })
    .then(function() {
      console.log("notes gone, too");
    })
  });
};

var startNote = function() {
  var id = $(this).val();
  $('#note-modal').modal('show');
  $(".publish-note").val(id);
};

var publishNote = function() {
  var id = $(".publish-note").val();
  $.ajax({
    url: "/articles/" + id,
    type: "POST",
    data: {
      title: $("#note-title").val(),
      body: $("#note-body").val(),
      articleId: id
    }
  }).then(function() {
    console.log("post made");
  });

  updateNotes();
  $("#note-modal").modal("hide");
  $("#note-title").val("");
  $("#note-body").val("");
};

var deleteNote = function() {
  var id = $(this).val();
  $.ajax({
    url: "/note/" + id,
    type: "DELETE"
  }).then(function() {
    console.log("note deleted");
  });
  updateNotes();
};

var clearArticles = function() {
  $.ajax({
    url: "/clear",
    type: "DELETE"
  }).then(function(data) {
    console.log("deleted all unsaved articles");
    console.log(data);
  });
  updateFrontPage();
};

$(document).on("click", ".save-article", saveArticle);
$(document).on("click", ".delete-article", deleteArticle);
$(document).on("click", ".delete-note", deleteNote);
$(document).on("click", ".add-note", startNote);
$(document).on("click", ".publish-note", publishNote);
$("#scrape-now").on("click", scrapeNow);
updateFrontPage();
updateNotes();