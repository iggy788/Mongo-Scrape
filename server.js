// Dependencies
// =============================================================
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");

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


// Routes
// ===========================================================
// require("./app/routes/apiRoutes")(app);
require("./app/routes/htmlRoutes")(app);

// Listener
// ===========================================================
app.listen(PORT, function () {
	console.log("App listening on PORT " + PORT);
});