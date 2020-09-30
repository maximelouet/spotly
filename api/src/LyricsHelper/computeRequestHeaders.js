const computeRequestHeaders = (clientHeaders) => {
  // site respond differently to mobile user agents so we always choose a desktop one
  const userAgent = (clientHeaders['user-agent'] && !clientHeaders['user-agent'].match(/mobile/gi))
    ? clientHeaders['user-agent']
    : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36';
  return {
    'user-agent': userAgent,
    'accept-language': clientHeaders['accept-language'] || 'en,en-US;q=0.9',
    accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'upgrade-insecure-requests': 1,
    'cache-control': 'max-age=0',
  };
};

module.exports = computeRequestHeaders;
