"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setLocales = setLocales;
exports.getDefaultLocale = getDefaultLocale;
exports.getLocales = getLocales;
exports.getLocaleFromRequest = getLocaleFromRequest;
exports.isValidLocale = isValidLocale;
exports.isInternalLocale = isInternalLocale;
exports.default = void 0;
const SETTINGS = {
  defaultLocale: 'en',
  locales: ['en']
};
const INTERNAL_LOCALES = ['xx-AE', 'xx-LS'];

function setLocales({
  defaultLocale,
  locales
}) {
  SETTINGS.defaultLocale = defaultLocale;
  SETTINGS.locales = locales;
}

function getDefaultLocale() {
  return SETTINGS.defaultLocale;
}

function getLocales() {
  return SETTINGS.locales;
} // Based on the request object (and other metrics, if you so chose) deduce the locale
// that the app should be rendered with.


function getLocaleFromRequest(req) {
  // You can add logic here to extract a locale from your user object.
  // if (user.preferences.locale) {
  //   return findRelevantLocale(user.preferences.locale);
  // }
  // Language override via URL.
  if (req.query.lang) {
    const locale = findRelevantLocale(req.query.lang);

    if (locale) {
      return locale;
    }
  } // If not in user's preferences, we try to extract from the browser 'Accept-Language' header.


  if (req.headers['accept-language']) {
    const rawHeader = req.headers['accept-language'];
    const possibleLanguages = rawHeader.split(',').map(lang => lang.replace(/;q=.*/, ''));

    for (const language of possibleLanguages) {
      const locale = findRelevantLocale(language);

      if (locale) {
        return locale;
      }
    }
  } // Final fallback


  return SETTINGS.defaultLocale;
} // Find the exact match locale, if supported, or the next best locale if possible.
// e.g. if `fr-FR` isn't found then `fr` will be used.


function findRelevantLocale(locale) {
  if (isValidLocale(locale)) {
    return locale;
  }

  const baseLocale = locale.split('-')[0];

  if (isValidLocale(baseLocale)) {
    return baseLocale;
  }
} // Whether the locale is found in our supported locale list. Must be exact.


function isValidLocale(locale) {
  return SETTINGS.locales.indexOf(locale) !== -1 || isInternalLocale(locale);
}

function isInternalLocale(locale) {
  return process.env.NODE_ENV === 'development' && INTERNAL_LOCALES.indexOf(locale) !== -1;
}

var _default = {
  getDefaultLocale,
  getLocaleFromRequest,
  getLocales,
  isValidLocale,
  isInternalLocale
};
exports.default = _default;