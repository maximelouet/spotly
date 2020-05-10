/* eslint-disable quote-props */
const slugify = require('slugify');

const geniusUrlify = (string) => {
  const separator = '-';
  slugify.extend({
    '&': 'and',
    '/': separator,
    'Ø': '',
  });
  const asciiOnly = string.replace(/[^\x20-\xFF]/g, '');
  return slugify(asciiOnly, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@/?]/g, // Genius strips special characters from its URLs
  });
};

const searchify = (string, separator = ' ') => {
  slugify.extend({
    '&': '&',
    '+': separator,
    '/': '/',
    'Ø': 'O',
  });
  return slugify(string, {
    replacement: separator,
    lower: true,
  });
};

module.exports = {
  geniusUrlify,
  searchify,
};
