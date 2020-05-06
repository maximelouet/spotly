/* eslint-disable quote-props */
import slugify from 'slugify';

const geniusUrlify = (string) => {
  const separator = '-';
  slugify.extend({
    '&': 'and',
    'ø': '',
    'Ø': '',
    '/': separator,
    ':': separator,
  });
  return slugify(string, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g, // Genius strips special characters from its URLs
  });
};

const searchify = (string, separator = ' ') => {
  slugify.extend({
    '&': '&',
    '+': separator,
    'ø': 'o',
    'Ø': 'o',
  });
  return slugify(string, {
    replacement: separator,
    lower: true,
    strict: true,
  });
};

export {
  geniusUrlify,
  searchify,
};
