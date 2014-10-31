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

	function _build(parent) {
		var that = this;
		if (_templates[this.templateUrl]) {
			_loadTemplate.apply(that, [parent, _templates[this.templateUrl]]);
		}
		else {
			$.ajax({
				url: this.templateUrl,
				dataType: 'html'
			})
			.done(function(tpl) {
				_templates[that.templateUrl] = tpl;
				_loadTemplate.apply(that, [parent, _templates[that.templateUrl]]);
			});
		}
	}

	var donate = function(parent, options) {
		var next = function() {
			var locale = options.locale || 'en_GB';

			this.parent = parent;
			this.locale = locale;

			this.templateUrl = options.templateUrl || '';
			_build.apply(this, [parent]);
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
