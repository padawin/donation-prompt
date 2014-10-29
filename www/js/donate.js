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
			dataType: 'json',
			async: false,
			complete: function(data) {
				translations = JSON.parse(data.responseText);
			}
		});
	}

	function _build(parent, templateUrl) {
		if (!_templates[templateUrl]) {
			$.ajax({
				url: templateUrl,
				dataType: 'html'
			})
			.done(function(tpl) {
				_templates[templateUrl] = tpl;
				_loadTemplate.apply(this, [parent, _templates[templateUrl]]);
			});
		}
		else {
			_loadTemplate.apply(this, [parent, template]);
		}
	}

	var donate = function(parent, options) {
		translations || _loadTranslations(options.translationsUrl);
		var locale = options.locale || 'en_GB';
		this.locale = locale;

		var templateUrl = options.templateUrl || '';
		_build.apply(this, [parent, templateUrl]);
	};

	window.Donate = donate;
})();
