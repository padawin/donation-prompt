var app = require('express')();

app.get('/translations.json', function (req, res) {
	res.set({'Content-Type': 'application/json'});
	res.jsonp({
		"en_GB": {
			"headline": "£10 could buy a llama",
			"currency": "£",
			"donate-alt": "Donate",
			"fast-secure": "Donating with JustGiving is fast and secure",
			"support": "others have supported this"
		},
		"fr_FR": {
			"headline": "10€ peuvent payer un llama",
			"currency": "€",
			"donate-alt": "Donner",
			"fast-secure": "Donner via JustGiving est rapide et sécurisé",
			"support": "autres personnes ont supporté cette cause"
		}
	});
});

var server = app.listen(3000, function () {

	var host = server.address().address,
		port = server.address().port;

  console.log('Server listening at http://%s:%s', host, port);
});
