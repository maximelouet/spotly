import fetchFromGenius from './genius';
import fetchFromMusixmatch from './musixmatch';
import fetchFromGoogle from './google';

const computeRequestHeaders = (clientHeaders) => {
  return {
    'user-agent': clientHeaders['user-agent'] || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.122 Safari/537.36',
    'accept-language': clientHeaders['accept-language'] || 'en-GB,en;q=0.8,fr-FR;q=0.5,fr;q=0.3',
    accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'upgrade-insecure-requests': 1,
    'cache-control': 'max-age=0',
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
        source: 'Genius',
      };
    } catch (e1) {
      try {
        const lyrics = await fetchFromMusixmatch(artistName, songName, headers);
        if (!lyrics) {
          throw new Error();
        }
        return {
          lyrics,
          source: 'Musixmatch',
        };
      } catch (e) {
        const lyrics = await fetchFromGoogle(artistName, songName, headers);
        return {
          lyrics,
          source: 'Google (LyricFind / Musixmatch)',
        };
      }
    }
  }
}

export default LyricsHelper;
