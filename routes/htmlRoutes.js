module.exports = function(app) {
	var users = [
		{
			name: "Mike",
			age: 29
		},
		{
			name: "Jeff",
			age: 22
		},
		{
			name: "Bill",
			age: 52
		}
	];

	// Routes
	app.get("/", function(req, res) {
		var title = "Articles";
		res.render("index", { title: "Articles", users: users });
		// res.send('Hello World');
	});
};