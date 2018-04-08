const router = require('express').Router();
const request = require('request');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const path = require('path');
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;
const db = require('../models');
const Note = require('../models/Note');
const Article = require('../models/Article');

// First, tell the console what server.js is doing
console.log(
	'\n***********************************\n' +
	'Grabbing every article headline and link\n' +
	'from New York Times' +
	'\n***********************************\n'
);

// Index Routes
// =============================================================================
//Renders the index page
router.get('/', function (req, res) {
	res.render('index');
});

// Scrape Routes shown on index.handlebars
// =============================================================================
// Scrapes the New York Times home page for articles
router.post('/scrape', function (req, res) {
	// First, we grab the body of the html with request
	request('http://www.nytimes.com/', function (error, response, html) {
		// Then, we load that into cheerio and save it to $ for a shorthand selector
		let $ = cheerio.load(html);
		// Make empty array for temporarily saving and showing scraped Articles.
		let scrapedArticles = {};

		// Now, we grab every h2 & summary class within an article tag:
		$('article').each(function (i, element) {
			// Save an empty result object
			let result = {};

			// Find the Text of every title in the article tag
			result.title = $(this)
				.children('h2')
				.text();
			result.summary = $(this)
				.children('.summary')
				.text();
			// Only find the summary and link if the title is not blank or not null
			if (result.title != '' && result.title != null && result.summary != '' && result.summary != null) {
				result.link = $(this)
					.children('h2')
					.children('a')
					.attr('href');
				console.log('What\'s the result summary? ' + result.summary);
				// Store All Contents of the Article
				scrapedArticles[i] = result;
				//Checks to see if the article is already in the database, and if it isn't then it adds it
				db.Article.findOne(
					{
						title: result.title
					},
					function(err, doc) {
						if (doc == null) {
							let entry = new Article(result);

							entry.save(function(err, doc) {
								if (err) {
									console.log(err);
								} else {
									console.log(doc);
								}
							});
						} else {
							console.log('Already in DB');
						}
					}
				);
			}
		});
		console.log('All Scraped Articles: ');
		console.log(scrapedArticles);

		const hbsArticleObject = {
			articles: scrapedArticles
		};
		res.render('index', hbsArticleObject);
	});
});

// Article Routes for index.handlebars
// =============================================================================
// Route for saving/updating an Article's associated Note
router.post('/save/', function (req, res) {
	console.log('This is the title: ' + req.body.summary);

	const newArticleObject = {};
	newArticleObject.title = req.body.title;
	newArticleObject.summary = req.body.summary;
	newArticleObject.link = req.body.link;

	const entry = new Article(newArticleObject);
	console.log('Save this Article: ' + entry);
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

	res.redirect('/savedarticles');
});
// Article Routes for savedarticles.handlebars
// =============================================================================

// Show this on savedarticles.handlebars
router.get('/savedarticles', function (req, res) {
	// Grab every doc in the Articles array
	db.Article.find({}, function (err, doc) {
		// Log any errors
		if (err) {
			console.log(err);
		}
		// Or send the doc to the browser as a json object
		else {
			const hbsArticleObject = {
				articles: doc
			};
			res.render('savedarticles', hbsArticleObject);
		}
	});
});

// Route for deleting an Article's associated Note in index.handlebars
router.get('/delete/:id', function (req, res) {
	db.Article
		.findOneAndRemove({
			_id: req.params.id
		}, function (err, offer) {
		if (err) {
			console.log('Not able to delete:' + err);
		} else {
			console.log('Able to delete, Yay');
		}
		res.redirect('/savedarticles');
	});
});

// Notes Routes
// =============================================================================
// This will grab an article by it's ObjectId
router.get('/articles/:id', function (req, res) {
	console.log('ID is getting read' + req.params.id);

	// Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
	db.Article.findOne({
			'_id': req.params.id
		})
		.populate('notes')
		.exec(function (err, doc) {
			if (err) {
				console.log('Not able to find article and get notes.');
			} else {
				console.log('We are getting article and maybe notes? ' + doc);
				res.json(doc);
			}
		});
});

// Route for grabbing a specific Article by id, populate it with it's note in in index.handlebars
router.get('/notes/:id', function (req, res) {
	console.log('ID is getting read for delete' + req.params.id);
	console.log('Able to activate delete function.');

	db.Note.findOne({
		_id: req.params.id
	}, function (err, doc) {
		if (err) {
			console.log('Not able to delete:' + err);
		} else {
			console.log('Able to delete, Yay');
		}
		res.send(doc);
	});
});

// Create a new note or replace an existing note
router.post('/articles/:id', function (req, res) {
	// Create a new note and pass the req.body to the entry
	db.Note.create(req.body)
		.then(function (dbNote) {

		})
	const newNote = new Note(req.body);
	// And save the new note the db
	newNote.save(function (error, doc) {
		// Log any errors
		if (error) {
			console.log(error);
		} else {
			// Use the article id to find it and then push note
			db.Article.findOneAndUpdate({
					'_id': req.params.id
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
						console.log('Cannot find article.');
					} else {
						console.log('On note save we are getting notes? ' + doc.notes);
						res.send(doc);
					}
				});
		}
	});
});
// Export Routes
module.exports = router;