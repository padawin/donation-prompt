function getTranslations(locale) {
	var translations = {
		"en_GB": {
			"currency": "£",
			"donate-alt": "Donate",
			"fast-secure": "Donating with JustGiving is fast and secure",
			"support": "others have supported this"
		}
	};

	return translations[locale] ? translations[locale] : translations['en_GB'];
}
