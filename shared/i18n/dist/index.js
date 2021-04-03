"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  generateId: true,
  F: true,
  defineMessages: true,
  useIntl: true,
  createIntl: true,
  setupCreateIntl: true
};
exports.generateId = generateId;
exports.F = F;
exports.defineMessages = defineMessages;
exports.useIntl = useIntl;
exports.createIntl = createIntl;
exports.setupCreateIntl = setupCreateIntl;
exports.default = void 0;

var _reactIntl = require("react-intl");

Object.keys(_reactIntl).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _reactIntl[key];
    }
  });
});

var _extraction = _interopRequireDefault(require("./extraction"));

var _locale = _interopRequireWildcard(require("./locale"));

Object.keys(_locale).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _locale[key];
    }
  });
});

var _react = _interopRequireDefault(require("react"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Re-export everything and override below what we want to override.
// For the Babel transform plugin.
var _default = _extraction.default; // Our i18n implementation tries to simplify the workflow for the developer
// such that they don't have to explicitly provide an ID every time which can be cumbersome.
// Nonetheless, it's still required by react-intl so we programmatically create an ID based on the message.
// NOTE: This is in sync with i18n-extraction/index.js id generation.

exports.default = _default;

function generateId(id = '', msg = '', description = '') {
  if (id) {
    return id;
  }

  const scrubbedMsg = msg.replace(/\W/g, '_');
  const scrubbedDesc = description.replace(/\W/g, '_');
  return scrubbedMsg + (scrubbedDesc ? '___' : '') + scrubbedDesc;
} // The main way to translate a string.
// To include HTML in the string you can do:
// <F
//   msg="To buy a shoe, <a>visit our website</a> and <cta>eat a shoe</cta>"
//   values={{
//     a: msg => (
//       <a className="external-link" target="_blank" rel="noopener noreferrer" href="https://www.shoe.com/">
//         {msg}
//       </a>
//     ),
//     cta: msg => <strong>{msg}</strong>,
//   }}
// />
// We also augment the original FormattedMessage to add fallback capability.


function F({
  id,
  description,
  fallback,
  msg,
  values
}) {
  const intl = (0, _reactIntl.useIntl)();
  const generatedId = generateId(id, msg, description);

  if (intl.locale !== _locale.default.getDefaultLocale() && fallback && !intl.messages[generatedId]) {
    return fallback;
  }

  msg = transformInternalLocaleMsg(intl.locale, msg); // XXX(mime): Workaround. We do this destructuring of props like this to avoid detection by the
  // i18n message extractor (which would otherwise error here and complain of not
  // having static values for FormattedMessage).

  const props = {
    id: generatedId,
    description,
    defaultMessage: msg,
    values
  };
  return _react.default.createElement("span", {
    className: "i18n-msg"
  }, _react.default.createElement(_reactIntl.FormattedMessage, props));
}

const ACCENTS = {
  a: 'ã',
  b: 'b́',
  c: 'č',
  d: 'đ',
  e: 'ĕ',
  f: 'f́',
  g: 'ġ',
  h: 'ĥ',
  i: 'ĩ',
  j: 'ĵ',
  k: 'ķ',
  l: 'ĺ',
  m: 'ḿ',
  n: 'ñ',
  o: 'ø',
  p: 'ƥ',
  q: 'ʠ',
  r: 'ř',
  s: 'š',
  t: 't́',
  u: 'ū',
  v: 'v̂',
  w: 'ŵ',
  x: 'x̄',
  y: 'ẙ',
  z: 'ž'
};

function transformInternalLocaleMsg(locale, msg) {
  if (locale === 'xx-AE') {
    let newMsg = '';
    let inBracket = false;

    for (let i = 0; i < msg.length; ++i) {
      if (msg[i] === '<' || msg[i] === '{') {
        inBracket = true;
      }

      if (msg[i] === '>' || msg[i] === '}') {
        inBracket = false;
      }

      if (!inBracket && /[a-zA-Z]/.test(msg[i])) {
        newMsg += /[a-z]/.test(msg[i]) ? ACCENTS[msg[i]] : ACCENTS[msg[i]].toUpperCase();
      } else {
        newMsg = msg[i];
      }
    }

    msg = newMsg;
  }

  if (locale === 'xx-LS') {
    msg += 'Looooooooooooooooooooooooooooooooooooooooong';
  }

  return msg;
} // We programmatically define ID's for messages to make things easier for devs.


function defineMessages(values) {
  for (const key in values) {
    if (!values[key].id) {
      values[key].id = generateId('', values[key].msg, values[key].description);
      values[key].defaultMessage = values[key].msg;
    }
  }

  return (0, _reactIntl.defineMessages)(values);
} // We wrap the originalUseIntl so that we can add fallback capability.


function useIntl() {
  const intl = (0, _reactIntl.useIntl)();
  const originalFormatMessage = intl.formatMessage;

  intl.formatMessage = (descriptor, values, fallbackDescriptor) => {
    descriptor.defaultMessage = transformInternalLocaleMsg(intl.locale, descriptor.defaultMessage);

    if (fallbackDescriptor) {
      fallbackDescriptor.defaultMessage = transformInternalLocaleMsg(intl.locale, fallbackDescriptor.defaultMessage);
    }

    const generatedId = generateId(descriptor.id, descriptor.defaultMessage, descriptor.description);

    if (intl.locale !== _locale.default.getDefaultLocale() && fallbackDescriptor && !intl.messages[generatedId]) {
      return originalFormatMessage(fallbackDescriptor, values);
    }

    return originalFormatMessage(descriptor, values);
  };

  return intl;
}

function createIntl(options) {
  if (options) {
    return (0, _reactIntl.createIntl)(options);
  } else {
    if (!didSetupCreateIntl) {
      throw new Error('Need to run setupCreateIntl to use createIntl without options.');
    }

    return presetIntl;
  }
}

const cache = (0, _reactIntl.createIntlCache)();
let presetIntl = null;
let didSetupCreateIntl = false;

function setupCreateIntl({
  defaultLocale,
  locale,
  messages
}) {
  presetIntl = (0, _reactIntl.createIntl)({
    defaultLocale,
    locale,
    messages
  }, cache);
  didSetupCreateIntl = true;
}