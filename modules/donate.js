var _donations = 0;

var donate = {
	getDonations: function() {
		return _donations;
	},

	addDonation: function(value) {
		if (value != parseInt(value, 10)
			|| value < 0) {
			throw "Invalid donation";
		}

		_donations += parseInt(value);
	}
};

module.exports = donate;
