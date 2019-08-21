var updateFrontPage = function() {
  $("#the-news").empty();
  $.ajax({
    url: "/articles",
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
        "<div class='col-2'><button class='btn btn-success' value='" +
        res._id +
        "'>Save!</button></div></div>"
      );
    });
  });
};

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

$("#scrape-now").on("click", scrapeNow);
updateFrontPage();