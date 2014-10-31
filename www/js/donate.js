(function(){
	/**
	 * List of templates, for memoization purposes
	 */
	var _templates = {},
		/**
		 * List of translations
		 */
		translations = null,
		/**
		 * boolean, true if the translations have been requested
		 */
		_incomingTranslations = false;

	/**
	 * Private method to compile a template with the translations.
	 * Then Starts the stats and set the events on the template.
	 */
	function _compileTemplate(parent, template) {
		var that = this,
			html = Mustache.to_html(
			template,
			{locale: this.locale, translations: translations[this.locale]}
		);
		$(parent).html(html);

		$('.add-donation-button', parent).click(function(){
			_sendDonation.apply(this, [$('.prompt-input', parent).val()]);
			$('.prompt-input', parent).val('');
		}.bind(this));
	}

	/**
	 * Private method to send a donation from the value in the input.
	 * if this fails (invalid value for example), no information can be catched,
	 * because of jsonp. Also, this must be done in GET becaus of jsonp as well.
	 */
	function _sendDonation(value) {
		$.ajax({
			url: this.donationUrl,
			dataType: 'jsonp',
			data: {value: value, cause: this.cause},
			complete: function(json) {
				translations = json.responseJSON;
			}
		});
	}

	/**
	 * Private method to fetch the widget's stats in an interval of 10 seconds
	 */
	function _startStats(statsUrl) {
		setInterval(function() {
			var statsContainer = $('.prompt-stats .value', this.parent);
			if (statsContainer.length == 1) {
				$.ajax({
					url: statsUrl,
					data: {cause: this.cause},
					dataType: 'jsonp'
				})
				.done(function(data) {
					statsContainer.html(data);
				});
			}
		}.bind(this), 1000);
	}

	/**
	 * private method which load the widget's template and build it.
	 */
	function _build(parent) {
		var that = this;
		if (_templates[this.templateUrl]) {
			_compileTemplate.apply(that, [parent, _templates[this.templateUrl]]);
		}
		else {
			$.ajax({
				url: this.templateUrl,
				dataType: 'html'
			})
			.done(function(tpl) {
				_templates[that.templateUrl] = tpl;
				_compileTemplate.apply(that, [parent, _templates[that.templateUrl]]);
			});
		}
	}

	/**
	 * Widget entry point.
	 * The main process is in a local function, to be deferred if the
	 * translations are not here yet, because they are needed to build the
	 * template.
	 * This way, if multiple instances of the widget are used in a page, the
	 * translations will be loaded once only.
	 */
	var donate = function(parent, options) {
		// Callback to built the widget and start the stats
		var next = function() {
			var locale = options.locale || 'en_GB';

			this.parent = parent;
			this.locale = locale;

			this.cause = options.cause || '';
			this.donationUrl = options.donationUrl || '';
			this.templateUrl = options.templateUrl || '';

			_build.apply(this, [parent]);
			_startStats.apply(this, [options.statsUrl]);
		}.bind(this);

		if (!translations && !_incomingTranslations) {
			throw "Translations are needed to use the widget.";
		}
		// The translations are here, let's proceed
		else if (!_incomingTranslations) {
			next();
		}
		// Otherwise, if transactions are incoming, wait until they are here
		// to build the widget
		else {
			var interval = setInterval(function() {
				if (!_incomingTranslations) {
					clearInterval(interval);
					next();
				}
			}, 50);
		}
	};

	/**
	 * Load the translations. To be called
	 */
	donate.loadTranslations = function(url) {
		_incomingTranslations = true;
		$.ajax({
			url: url,
			dataType: 'jsonp',
			complete: function(json) {
				translations = json.responseJSON;
				_incomingTranslations = false;
			}
		});
	}

	window.Donate = donate;
})();
