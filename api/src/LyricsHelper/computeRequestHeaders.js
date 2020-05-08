const computeRequestHeaders = (clientHeaders) => {
  // site respond differently to mobile user agents so we always choose a desktop one
  const userAgent = (clientHeaders['user-agent'] && !clientHeaders['user-agent'].match(/mobile/gi))
    ? clientHeaders['user-agent']
    : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.129 Safari/537.36';
  return {
    'user-agent': userAgent,
    'accept-language': clientHeaders['accept-language'] || 'en-GB,en;q=0.8,fr-FR;q=0.5,fr;q=0.3',
    accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'upgrade-insecure-requests': 1,
    'cache-control': 'max-age=0',
  };
};

module.exports = computeRequestHeaders;
