var _donations = {};

var donate = {
	getDonations: function(cause) {
		if (_donations[cause]) {
			return _donations[cause].length;
		}
		else {
			return 0;
		}
	},

	addDonation: function(cause, value) {
		if (value != parseInt(value, 10)
			|| value < 0) {
			throw "Invalid donation";
		}

		if (!_donations[cause]) {
			_donations[cause] = [];
		}

		_donations[cause].push(parseInt(value));
	}
};

module.exports = donate;
