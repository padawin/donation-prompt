(function(){
	/**
	 * List of templates, for memoization purposes
	 */
	var _templates = {},
		/**
		 * List of translations
		 */
		_translations = null,
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
			{locale: this.locale, translations: _translations[this.locale]}
		);
		$(parent).html(html);
		this.socket.on('stats', function(data) {
			$('.prompt-stats .value', that.parent).html(data);
		});
		this.socket.emit('stats', this.cause);

		$('.donation-form', parent).submit(function(e){
			_sendDonation.apply(this, [$('.prompt-input', parent).val()]);
			$('.prompt-input', parent).val('');
			e.preventDefault();
		}.bind(this));
	}

	/**
	 * Private method to send a donation from the value in the input.
	 * if this fails (invalid value for example), no information can be catched,
	 * because of jsonp. Also, this must be done in GET becaus of jsonp as well.
	 */
	function _sendDonation(value) {
		var that = this;
		$.ajax({
			url: this.donationUrl,
			dataType: 'jsonp',
			data: {value: value, cause: this.cause},
			complete: function(json) {
			}
		});
	}

	/**
	 * private method which load the widget's template and build it.
	 */
	function _build(parent) {
		var compileCallback = function() {
			_compileTemplate.apply(
				this,
				[parent, _templates[this.templateUrl]]
			);
		}.bind(this);

		var that = this;
		if (_templates[this.templateUrl] !== null
			&& _templates[this.templateUrl] !== undefined) {
			compileCallback();
		}
		else if (_templates[that.templateUrl] === null) {
			var interval = setInterval(function() {
				if (_templates[that.templateUrl] != null) {
					clearInterval(interval);
					compileCallback();
				}
			}, 50);
		}
		else if (_templates[that.templateUrl] === undefined) {
			_templates[that.templateUrl] = null;
			$.ajax({
				url: this.templateUrl,
				dataType: 'html'
			})
			.done(function(tpl) {
				_templates[that.templateUrl] = tpl;
				compileCallback();
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
			this.socket = new io.connect(
				this.socketUrl,
				{
					resource: 'A/socket.io',
					'force new connection': true,
					query: "cause=" + this.cause
				}
			);
			_build.apply(this, [parent]);
		}.bind(this);

		var locale = options.locale || 'en_GB';

		// set some attributes
		this.parent = parent;
		this.locale = locale;

		this.cause = options.cause || '';
		this.donationUrl = options.donationUrl || '';
		this.socketUrl = options.socketUrl || '';
		this.templateUrl = options.templateUrl || '';

		if (!_translations && !_incomingTranslations) {
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
				_translations = json.responseJSON;
				_incomingTranslations = false;
			}
		});
	}

	window.Donate = donate;
})();
