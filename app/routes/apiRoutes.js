// Database configuration
var databaseUrl = "scraper";
var collections = ["scrapedData"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
	console.log("Database Error:", error);
});

// Main route (simple Hello World Message)
app.get("/", function(req, res) {
	res.send("Hello world");
}); // Route 1
// =======
// This route will retrieve all of the data
// from the scrapedData collection as a json (this will be populated
// by the data you scrape using the next route)
// Make request to grab the HTML from `awwards's` clean website section
app.get("/scrape", function(req, res) {
	request("https://www.theonion.com/", function(error, response, html) {
		// Make an empty array for saving our scraped info
		var $ = cheerio.load(html);
		// Make an empty array for saving our scraped info
		var results = [];
		$("h1.headline").each(function(i, element) {
			// Save the text of the h1-tag as "title"
			var title = $(element).text();
			// Find the h4 tag's parent a-tag, and save it's href value as "link"
			// var link = $(element)
			//   .find("a")
			//   .attr("href");
			var link = $(element)
				.children()
				.attr("href");

			// Make an object with data we scraped for this h4 and push it to the results array
			results.push({
				title,
				link
			});
		});
		// After looping through each element found, log the results to the console
		db.scrapedData.insert(results);
		res.json(results);
	});
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

// Listen on port 3000
app.listen(3000, function() {
	console.log("App running on port 3000!");
});