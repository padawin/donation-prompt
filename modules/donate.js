var donations = 0;

var donate = {
	getDonations: function() {
		return donations;
	},

	addDonation: function(value) {
		if (value != parseInt(value, 10)
			|| value < 0) {
			throw "Invalid donation";
		}

		donations += parseInt(value);
	}
};

module.exports = donate;
