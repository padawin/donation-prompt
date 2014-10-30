(function(){
	var _templates = {}, translations;

	function _loadTemplate(parent, template) {
		var html = Mustache.to_html(
			template,
			{locale: this.locale, translations: translations[this.locale]}
		);
		$(parent).html(html);
	}

	function _loadTranslations(url) {
		$.ajax({
			url: url,
			dataType: 'jsonp',
			async: false,
			complete: function(json) {
				translations = json.responseJSON;
			}
		});
	}

	function _startStats(statsUrl) {
		setInterval(function() {
			var statsContainer = $('.prompt-stats .value', this.parent);
			if (statsContainer.length == 1) {
				$.ajax({
					url: statsUrl
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
		translations || _loadTranslations(options.translationsUrl);
		var locale = options.locale || 'en_GB';

		this.parent = parent;
		this.locale = locale;

		var templateUrl = options.templateUrl || '';
		_build.apply(this, [parent, templateUrl]);
		_startStats.apply(this, [options.statsUrl]);
	};

	window.Donate = donate;
})();
