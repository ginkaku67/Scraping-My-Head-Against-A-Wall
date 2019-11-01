var cheerio = require("cheerio");
var axios = require("axios");
//var logger = require("morgan");
var mongoose = require("mongoose");
var express = require("express")
//var Handlebars = require("express-handlebars")

var PORT = 3000;


var db = require("./models");

// Initialize Express
var app = express();

//app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect("mongodb://localhost/scrapedb", { useNewUrlParser: true });
axios.get("https://www.kansascity.com/").then(function(response) {

  // Load the Response into cheerio and save it to a variable
  // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
  var $ = cheerio.load(response.data);

  // An empty array to save the data that we'll scrape
  var results = [];

  // With cheerio, find each p-tag with the "title" class
  // (i: iterator. element: the current element)
  $("div.package").each(function(i, element) {

    // Save the text of the element in a "title" variable
    var package = $(element).text();

    //var link = $(element).children().attr("href");

    results.push({
      package: package,
      //link: link
    });
  });
  // Route for retrieving all Notes from the db
app.get("/notes", function(req, res) {
    // Find all Notes
    db.Note.find({})
      .then(function(dbNote) {
        // If all Notes are successfully found, send them back to the client
        res.json(dbNote);
      })
      .catch(function(err) {
        // If an error occurs, send the error back to the client
        res.json(err);
      });
  });
  
  // Route for retrieving all Users from the db
  app.get("/user", function(req, res) {
    // Find all Users
    db.User.find({})
      .then(function(dbUser) {
        // If all Users are successfully found, send them back to the client
        res.json(dbUser);
      })
      .catch(function(err) {
        // If an error occurs, send the error back to the client
        res.json(err);
      });
  });
  
  // Route for saving a new Note to the db and associating it with a User
  app.post("/submit", function(req, res) {
    // Create a new Note in the db
    db.Note.create(req.body)
      .then(function(dbNote) {
        // If a Note was created successfully, find one User (there's only one) and push the new Note's _id to the User's `notes` array
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return db.User.findOneAndUpdate({}, { $push: { notes: dbNote._id } }, { new: true });
      })
      .then(function(dbUser) {
        // If the User was updated successfully, send it back to the client
        res.json(dbUser);
      })
      .catch(function(err) {
        // If an error occurs, send it back to the client
        res.json(err);
      });
  });
  
  app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });
  

  console.log(results);
});