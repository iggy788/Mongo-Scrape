// Dependencies
// =============================================================
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const path = require('path');
const logger = require('morgan');
// const favicon = require('serve-favicon');

// Sets up the Express App
// =============================================================
const app = express();

// Setup MongoDB & Heroku
// ===========================================================
const config = require('./config/database');
mongoose.Promise = Promise;
mongoose
	.connect(config.database)
	.then(result => {
		console.log(
			`Connected to database '${result.connections[0].name}' on ${
				result.connections[0].host
			}:${result.connections[0].port}`
		);
	})
	.catch(err => console.log('There was an error with your connection:', err));

// Middleware
// ===========================================================

// Morgan Middleware
app.use(logger('dev'));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);

// Handlebars Middleware
app.engine(
    'handlebars',
    exphbs({
        defaultLayout: 'main'
    })
);
app.set('view engine', 'handlebars');

// Set Static Directories
// ===========================================================
app.use(express.static(path.join(__dirname, '/public')));
app.use('/articles', express.static(path.join(__dirname, 'public')));
app.use('/notes', express.static(path.join(__dirname, 'public')));

// Routes
// ===========================================================
var routes = require('./controllers/scrapeController.js');
app.use('/', routes);

// Listener
// ===========================================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
    console.log(`App listening on http://localhost:'${PORT}`);
});