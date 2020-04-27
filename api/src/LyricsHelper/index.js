import fetchFromGoogle from './google';
import fetchFromGenius from './genius';

const computeRequestHeaders = (clientHeaders) => {
  return {
    'User-Agent': clientHeaders.userAgent || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.122 Safari/537.36',
    'Accept-Language': clientHeaders.acceptLanguage || 'en-GB,en;q=0.8,fr-FR;q=0.5,fr;q=0.3',
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'Upgrade-Insecure-Requests': 1,
    'Cache-Control': 'max-age=0',
  };
};

class LyricsHelper {
  static async findLyrics(artistName, songName, clientHeaders) {
    const headers = computeRequestHeaders(clientHeaders);
    try {
      const lyrics = await fetchFromGenius(artistName, songName, headers);
      if (!lyrics) {
        throw new Error();
      }
      return {
        lyrics,
        source: 'GENIUS',
      };
    } catch (e) {
      const lyrics = await fetchFromGoogle(artistName, songName, headers);
      return {
        lyrics,
        source: 'GOOGLE',
      };
    }
  }
}

export default LyricsHelper;
