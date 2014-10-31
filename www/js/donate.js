(function(){
	var _templates = {}, translations = null, _incomingTranslations = false;

	function _loadTemplate(parent, template) {
		var html = Mustache.to_html(
			template,
			{locale: this.locale, translations: translations[this.locale]}
		);
		$(parent).html(html);
	}

	function _loadTranslations(url, doneCallback) {
		_incomingTranslations = true;
		$.ajax({
			url: url,
			dataType: 'jsonp',
			complete: function(json) {
				translations = json.responseJSON;
				_incomingTranslations = false;
				doneCallback();
			}
		});
	}

	function _startStats(statsUrl) {
		setInterval(function() {
			var statsContainer = $('.prompt-stats .value', this.parent);
			if (statsContainer.length == 1) {
				$.ajax({
					url: statsUrl,
					dataType: 'jsonp'
				})
				.done(function(data) {
					statsContainer.html(data);
				});
			}
		}.bind(this), 1000);
	}

	function _build(parent, templateUrl, translations) {
		var that = this;
		if (_templates[templateUrl]) {
			_loadTemplate.apply(that, [parent, _templates[templateUrl]]);
		}
		else {
			$.ajax({
				url: templateUrl,
				dataType: 'html'
			})
			.done(function(tpl) {
				_templates[templateUrl] = tpl;
				_loadTemplate.apply(that, [parent, _templates[templateUrl]]);
			});
		}
	}

	var donate = function(parent, options) {
		var next = function() {
			var locale = options.locale || 'en_GB';

			this.parent = parent;
			this.locale = locale;

			var templateUrl = options.templateUrl || '';
			_build.apply(this, [parent, templateUrl]);
			_startStats.apply(this, [options.statsUrl]);
		}.bind(this);

		if (!translations && !_incomingTranslations) {
			_loadTranslations(options.translationsUrl, next);
		}
		else if (_incomingTranslations) {
			var interval = setInterval(function() {
				if (!_incomingTranslations) {
					clearInterval(interval);
					next();
				}
			}, 50);
		}
	};

	window.Donate = donate;
})();
