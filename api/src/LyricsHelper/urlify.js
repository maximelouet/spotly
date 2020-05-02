import slugify from 'slugify';

const urlify = (string, separator = '-') => {
  slugify.extend({ '&': separator });
  return slugify(string, {
    replacement: separator,
    lower: true,
    strict: true,
  });
};

export default urlify;
