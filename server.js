const express = require("express");
const bodyParser = require("body-parser");
var PORT = process.env.PORT || 3000;

const app = express();
app.use(express.static(__dirname + "/public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const exphbs = require("express-handlebars");

// app.engine(
// 	"handlebars",
// 	exphbs({
// 		defaultLayout: "main",
// 		// Uses multiple partials dirs, templates in "shared/templates/" are shared
// 		// with the client-side of the app (see below).
// 		partialsDir: "views/partials/"
// 	})
// );
app.engine(
	"handlebars",
	exphbs({ defaultLayout: "main", partialsDir: 'views/partials/' })
);
app.set("view engine", "handlebars");

// app.use(routes);

app.listen(PORT, function() {
  console.log("App now listening at localhost:" + PORT);
});