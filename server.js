require("dotenv").config();
var express = require("express");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");
var logger = require("morgan");
var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");
var PORT = 3000;
var app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/news-scraper";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// Handlebars
app.engine(
    "handlebars",
    exphbs({
      defaultLayout: "main"
    })
);
app.set("view engine", "handlebars");

//Handlebar routes
app.get("/", function(req, res) {
  db.User.find({}).then(function(dbUsers) {
    res.render("index", {
      msg: "Welcome to Scrape The News!",
      users: dbUsers
    });
  });
});

// Listen on port 3000
app.listen(PORT, function() {
    console.log("App running on http://localhost:3000");
});
