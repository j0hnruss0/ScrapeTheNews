require("dotenv").config();
var express = require("express");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");
var logger = require("morgan");
var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");
var PORT = process.env.PORT || 3000;
var app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//app.use(express.static(path.join(__dirname, "public")));
app.use('*/style', express.static('public/style'));
app.use('*/js', express.static('public/js'));

// Handlebars
app.engine(
    "handlebars",
    exphbs({
      defaultLayout: "main"
    })
);
app.set("view engine", "handlebars");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/news-scraper";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

//Handlebar HTML routes
app.get("/", function(req, res) {
  res.render("index", {
    msg: "Welcome to Scrape The News!"
  });
});

app.get("/saved", function(req, res) {
  db.Article.find({}).then(function(dbArticles) {
    res.render("saved", {
      msg: "Saved Articles",
      saved: dbArticles
    });
  });
});

//Scrape and Data routes
app.get("/scrape", function(req, res) {
  var arr = [];
  axios.get("http://weeklyworldnews.com/").then(function(response) {
    var $ = cheerio.load(response.data);
    $(".entry-excerpt").each(function() {
      var result = {};

      result.title = $(this)
        .find(".entry-title")
        .text();
      result.info = $(this)
        .children("p")
        .eq(1)
        .text();
      result.link = $(this)
        .find(".entry-title")
        .children("a")
        .attr("href");
      result.saved = false;

      arr.push(result);
    });
    res.json(arr);
  });
});

app.delete("/clear", function(req, res) {
  db.Article.deleteMany({ saved: false })
    .then(function(dbArticles) {
      res.json(dbArticles)
    })
    .catch(function(err) {
      console.log(err);
    });
});

app.get("/articles", function(req, res) {
  db.Article.find({})
    .populate("note")
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.post("/articles", function(req, res) {
  db.Article.insertMany(req.body)
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      console.log(err);
    });
});

app.get("/unsaved", function(req, res) {
  db.Article.find({ saved: false })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Listen on port 3000
app.listen(PORT, function() {
    console.log("App running on http://localhost:3000");
});

module.exports = app;
