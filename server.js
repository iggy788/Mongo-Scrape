// Dependencies
// =============================================================
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
// Parses our HTML and helps us find elements
var cheerio = require("cheerio");
// Makes HTTP request for HTML page
var request = require("request");
// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3000;

// View Engine
// =============================================================
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "/app/views"));

// Body Parser Middleware
// ===========================================================
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

// Set Static Path
// ===========================================================
app.use(express.static(__dirname + "/app/public"));

const exphbs = require("express-handlebars");
app.engine(
	"handlebars",
	exphbs({
		defaultLayout: "main",
		layoutsDir: path.join(__dirname, "app/views/layouts"),
		partialsDir: path.join(__dirname, "app/views/partials")
	})
);

// Parses our HTML and helps us find elements
var cheerio = require("cheerio");
// Makes HTTP request for HTML page
var request = require("request");

// First, tell the console what server.js is doing
console.log("\n***********************************\n" +
	"Grabbing every article headline and link\n" +
	"from New York Times webdev board:" +
	"\n***********************************\n");

app.get("/scrape", function (req, res) {
	request("https://www.nytimes.com/", function (
		error,
		response,
		html
	) {
		// Make an empty array for saving our scraped info
		var $ = cheerio.load(html);

		// Make an empty array for saving our scraped info
		var results = [];

		// With cheerio, find each h4-tag with the class "headline-link" and loop through the results
		$(".story-heading").each(function (i, element) {
			// Save the text of the h4-tag as "title"
			var title = $(element).text();
				// .find("a")


			// .split("\n")[0];
			// Find the h4 tag's parent a-tag, and save it's href value as "link"
			var link = $(element)
				.children()
				.attr("href");

			// var summary = $(element)
			// 	.find("p")
			// 	.text();
			// Make an object with data we scraped for this h4 and push it to the results array
			results.push({
				title: title,
				link: link
			});
		});
		// After looping through each element found, log the results to the console
		db.scrapedData.insert(results);
		res.json(results);
	});
	// Log the results once you've looped through each of the elements found with cheerio
	console.log(results);
});
// Route 2
// =======
// When you visit this route, the server will
// scrape data from the site of your choice, and save it to
// MongoDB.
// TIP: Think back to how you pushed website data
// into an empty array in the last class. How do you
// push it into a MongoDB collection instead?

/* -/-/-/-/-/-/-/-/-/-/-/-/- */



// Routes
// ===========================================================
// require("./app/routes/apiRoutes")(app);
require("./app/routes/htmlRoutes")(app);

// Listener
// ===========================================================
app.listen(PORT, function () {
	console.log("App listening on PORT " + PORT);
});