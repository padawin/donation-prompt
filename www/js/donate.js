(function(){
	var template, translations;

	function _loadTemplate(parent, template, data) {
		data.translations = translations;
		var html = Mustache.to_html(template, data);
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

	function _build(parent, templateUrl, dataUrl, translations) {
		$.ajax({
			url: dataUrl
		})
		.error(function(e) {
			console.log(e);
		})
		.done(function(data) {
			if (!template) {
				$.ajax({
					url: templateUrl,
					dataType: 'html'
				})
				.done(function(tpl) {
					template = tpl;
					_loadTemplate(parent, template, data);
				});
			}
			else {
				_loadTemplate(parent, template, data);
			}
		});
	}

	var donate = function(parent, options) {
		translations || _loadTranslations(options.translationsUrl);
		var locale = options.locale || 'en_GB';
		this.locale = locale;

		var templateUrl = options.templateUrl || '';
		_build.apply(this, [parent, templateUrl, options.dataUrl]);
	};

	window.Donate = donate;
})();
