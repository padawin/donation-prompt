var donate = require('../modules/donate');

var cause = 'test-cause';

exports['get-donation-no-donation'] = function (test) {
	try {
		donate.getDonations();
		test.equal(1, 0);
	}
	catch (e) {
		test.equal(e, 'Empty cause');
	}

	test.equal(donate.getDonations(cause), 0);

	test.done();
};

exports['add-donation'] = function (test) {
	donate.addDonation(cause, 42);
    test.equal(donate.getDonations(cause), 1);
    try {
		donate.addDonation(cause, -42);
		test.equal(1, 0);
	}
	catch (e) {
		test.equal(e, 'Invalid donation');
		test.equal(donate.getDonations(cause), 1);
	}

	try {
		donate.addDonation(cause, 'some string');
		test.equal(1, 0);
	}
	catch (e) {
		test.equal(e, 'Invalid donation');
		test.equal(donate.getDonations(cause), 1);
	}
    test.done();
};
