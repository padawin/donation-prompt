/**
 * Module to manage donations.
 */

/**
 * Collection of donations. The collections are grouped by cause, and each
 * cause contains an array of donations (int)
 */
var _donations = {};

/**
 * Public module
 */
var donate = {
	/**
	 * Method to get the number of donations for a given cause
	 */
	getDonations: function(cause) {
		if (!cause) {
			throw "Empty cause";
		}

		if (_donations[cause]) {
			return _donations[cause].length;
		}
		else {
			return 0;
		}
	},

	/**
	 * Add a donation to a given cause.
	 * A Donation must be a positive integer.
	 * Will throw an exception if the donation is not valid.
	 */
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
