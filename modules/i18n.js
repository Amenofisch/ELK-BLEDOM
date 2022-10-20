const { I18n } = require('i18n');
const path = require('path');

const i18n = new I18n({
    locales: ['de','en', 'hu'],
    staticCatalog: {
        de: require('../locale/de.json'),
        en: require('../locale/en.json'),
        hu: require('../locale/hu.json'),
    },
    defaultLocale: 'de'
});


module.exports = { i18n };