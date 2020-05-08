/* eslint-disable quote-props */
import slugify from 'slugify';

const geniusUrlify = (string) => {
  slugify.extend({
    '&': 'and',
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
