var express = require("express");
var router = express.Router();
var request = require("request");
var cheerio = require("cheerio");
var mongoose = require("mongoose");
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

var Note = require("../models/Note.js");
var Article = require("../models/Article.js");

// First, tell the console what server.js is doing
console.log(
	"\n***********************************\n" +
	"Grabbing every article headline and link\n" +
	"from New York Times webdev board:" +
	"\n***********************************\n"
);

router.get("/", function (req, res) {
	res.render("index");
});

// A GET request to scrape the new york times website
router.post("/scrape", function (req, res) {
	// First, we grab the body of the html with request
	request("http://www.nytimes.com/", function (error, response, html) {
		// Then, we load that into cheerio and save it to $ for a shorthand selector
		var $ = cheerio.load(html);

		// Make emptry array for temporarily saving and showing scraped Articles.
		var scrapedArticles = {};
		// Now, we grab every h2 within an article tag, and do the following:
		$("article").each(function (i, element) {
			// Save an empty result object
			var result = {};

			// Add the text and href of every link, and save them as properties of the result object
			result.title = $(this)
				.children("h2")
				.text();
			// console.log("What's the result title? " + result.title);
			result.link = $(this)
				.children("h2")
				.children("a")
				.attr("href");

			result.summary = $(this)
					.children("p.summary")
					.text();
				console.log("What's the result summary? " + result.summary);


			scrapedArticles[i] = result;
		});

		console.log("Scraped Articles object built nicely: " + scrapedArticles);
		var hbsArticleObject = {
			articles: scrapedArticles
		};
		res.render("index", hbsArticleObject);
	});
});

// This will get the articles scraped and saved in db and show them in list.
router.get("/savedarticles", function (req, res) {
	// Grab every doc in the Articles array
	Article.find({}, function (error, doc) {
		// Log any errors
		if (error) {
			console.log(error);
		}
		// Or send the doc to the browser as a json object
		else {
			var hbsArticleObject = {
				articles: doc
			};
			res.render("savedarticles", hbsArticleObject);
		}
	});
});

// Route for saving/updating an Article's associated Note
router.post("/save", function (req, res) {
	console.log("This is the title: " + req.body.title);

	var newArticleObject = {};
	newArticleObject.title = req.body.title;
	newArticleObject.link = req.body.link;
	newArticleObject.summary = req.body.summary;

	var entry = new Article(newArticleObject);
	console.log("We can save the article: " + entry);
	// Now, save that entry to the db
	entry.save(function (err, doc) {
		// Log any errors
		if (err) {
			console.log(err);
		} else {
			// Or log the doc
			console.log(doc);
		}
	});

	res.redirect("/savedarticles");
});

// Route for deleting an Article's associated Note
router.get("/delete/:id", function (req, res) {
	console.log("ID is getting read for delete" + req.params.id);
	console.log("Able to activate delete function.");

	Article.findOneAndRemove({
		_id: req.params.id
	}, function (err, offer) {
		if (err) {
			console.log("Not able to delete:" + err);
		} else {
			console.log("Able to delete, Yay");
		}
		res.redirect("/savedarticles");
	});
});

// Route for grabbing a specific Article by id, populate it with it's note
router.get("/notes/:id", function (req, res) {
	console.log("ID is getting read for delete" + req.params.id);
	console.log("Able to activate delete function.");

	Note.findOneAndRemove({
		_id: req.params.id
	}, function (err, doc) {
		if (err) {
			console.log("Not able to delete:" + err);
		} else {
			console.log("Able to delete, Yay");
		}
		res.send(doc);
	});
});

// This will grab an article by it's ObjectId
router.get("/articles/:id", function (req, res) {
	console.log("ID is getting read" + req.params.id);

	// Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
	Article.findOne({
			"_id": req.params.id
		})
		.populate('notes')
		.exec(function (err, doc) {
			if (err) {
				console.log("Not able to find article and get notes.");
			} else {
				console.log("We are getting article and maybe notes? " + doc);
				res.json(doc);
			}
		});
});

// Create a new note or replace an existing note
router.post("/articles/:id", function (req, res) {
	// Create a new note and pass the req.body to the entry
	var newNote = new Note(req.body);
	// And save the new note the db
	newNote.save(function (error, doc) {
		// Log any errors
		if (error) {
			console.log(error);
		} else {
			// Use the article id to find it and then push note
			Article.findOneAndUpdate({
					"_id": req.params.id
				}, {
					$push: {
						notes: doc._id
					}
				}, {
					new: true,
					upsert: true
				})
				.populate('notes')
				.exec(function (err, doc) {
					if (err) {
						console.log("Cannot find article.");
					} else {
						console.log("On note save we are getting notes? " + doc.notes);
						res.send(doc);
					}
				});
		}
	});
});
// Export routes for server.js to use.
module.exports = router;