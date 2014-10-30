var donations = 0;

var donate = {
	getDonations: function() {
		return donations;
	},

	addDonation: function(value) {
		if (data !== parseInt(data, 10)
			|| data < 0) {
			throw "Invalid donation";
		}

		donations += value;
	}
};

module.exports = donate;
