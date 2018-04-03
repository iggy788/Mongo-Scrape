// Dependencies
// =============================================================
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var path = require("path");

// Our scraping tools
// =============================================================
// Parses our HTML and helps us find elements
var cheerio = require("cheerio");
// Makes HTTP request for HTML page
var request = require("request");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3000;

// Body Parser Middleware
// ===========================================================
// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(
	bodyParser.urlencoded({
		extended: true
	})
);

// Set Static Path
// ===========================================================
app.use(express.static(__dirname + "/app/public"));
app.use(express.static(path.join(__dirname, "/public")));

var exphbs = require("express-handlebars");
app.engine(
	"handlebars",
	exphbs({
		defaultLayout: "main"
	})
);
app.set("view engine", "handlebars");

// Import Routes
// ===========================================================
var routes = require("./controllers/scrapeController.js");
app.use("/", routes);

// Setup MongoDB on Heroku
// ===========================================================
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scrapeMongo";
var db = mongoose.connection;

mongoose.connect(
	"mongodb://heroku_pgw06cvt:h4tndnndkpu36u5boek8dalkil@ds127139.mlab.com:27139/heroku_pgw06cvt"
);
// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

// Listener
// ===========================================================
app.listen(PORT, function() {
	console.log("App listening on PORT " + PORT);
});
