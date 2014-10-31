var _donations = {};

var donate = {
	getDonations: function(cause) {
		return _donations[cause] | 0;
	},

	addDonation: function(cause, value) {
		if (value != parseInt(value, 10)
			|| value < 0) {
			throw "Invalid donation";
		}

		_donations[cause] = (_donations[cause] | 0) + parseInt(value);
	}
};

module.exports = donate;
