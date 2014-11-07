var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var donate = require('./modules/donate');

app.get('/public/*', function (req, res) {
	res.sendFile(
		req.params[0],
		{
			root: __dirname + '/www/'
		}
	);
});


/**
 * Route to get the available translations, per locale.
 * Return format:
 * {
 * 		locale1: {
 * 			key: value,
 * 			key: value,
 * 			key: value
 * 		},
 * 		locale2: {
 * 			key: value,
 * 			key: value,
 * 			key: value
 * 		}
 * }
 */
app.get('/translations.json', function (req, res) {
	res.set({'Content-Type': 'application/json'});
	res.jsonp({
		"en_GB": {
			"headline_llama": "£10 could buy a llama",
			"headline_cancer": "£10 could help cure cancer",
			"currency": "£",
			"donate-alt": "Donate",
			"fast-secure": "Donating with JustGiving is fast and secure",
			"support": "others have supported this"
		},
		"fr_FR": {
			"headline_llama": "10€ peuvent payer un llama",
			"headline_cancer": "10€ peuvent soigner un cancer",
			"currency": "€",
			"donate-alt": "Donner",
			"fast-secure": "Donner via JustGiving est rapide et sécurisé",
			"support": "autres personnes ont supporté cette cause"
		}
	});
});

/**
 * Route to get the stats for a given cause.
 * A cause's stats is just the number of donations for the given cause
 * Return format:
 * int
 */
app.get('/stats.json', function (req, res) {
	res.set({'Content-Type': 'application/json'});
	res.jsonp(donate.getDonations(req.query.cause));
});

/**
 * Route to add a new donation for a given cause
 * Return format:
 * ['OK'] if the donation is done
 * ['Bad value'] if the donation is invalid (status code 400)
 *
 * Should be post, but POST does not work with jsonp
 */
app.get('/donation', function (req, res) {
	res.set({'Content-Type': 'application/json'});
	try {
		donate.addDonation(req.query.cause, req.query.value);
		io.to(req.query.cause).emit('stats', donate.getDonations(req.query.cause));
		res.jsonp(['OK']);
	}
	catch (e) {
		res.status(400);
		res.jsonp(['Bad value']);
	}
});

io.on('connection', function(socket) {
	socket.join(socket.handshake.query.cause);
	socket.on('stats', function(e) {
		socket.emit('stats', donate.getDonations(socket.handshake.query.cause));
	});
});

var server = http.listen(3000, function () {

	var host = server.address().address,
		port = server.address().port;

  console.log('Server listening at http://%s:%s', host, port);
});
