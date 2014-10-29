(function(){
	var template, translations;

	function _loadTemplate(parent, template, data) {
		data.translations = translations;
		var html = Mustache.to_html(template, data);
		$(parent).html(html);
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

	var donate = function(parent, options, tsl) {
		translations = tsl;
		var templateUrl = options.templateUrl || '';
		_build.apply(this, [parent, templateUrl, options.dataUrl]);
	};

	window.Donate = donate;
})();
