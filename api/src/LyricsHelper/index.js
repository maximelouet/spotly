import fetchFromGenius from './sources/genius';
import fetchFromMusixmatch from './sources/musixmatch';
import fetchFromGoogle from './sources/google';
import cleanSongName from './cleanSongName';

const computeRequestHeaders = (clientHeaders) => {
  const userAgent = (clientHeaders['user-agent'] && !clientHeaders['user-agent'].match(/mobile/gi)) ? clientHeaders['user-agent'] : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.122 Safari/537.36';
  return {
    'user-agent': userAgent,
    'accept-language': clientHeaders['accept-language'] || 'en-GB,en;q=0.8,fr-FR;q=0.5,fr;q=0.3',
    accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'upgrade-insecure-requests': 1,
    'cache-control': 'max-age=0',
  };
};

const sources = [
  {
    name: 'Genius',
    method: fetchFromGenius,
  },
  {
    name: 'Musixmatch',
    method: fetchFromMusixmatch,
  },
  {
    name: 'Google',
    method: fetchFromGoogle,
  },
];

class LyricsHelper {
  static async findLyrics(artistName, songName, clientHeaders) {
    const headers = computeRequestHeaders(clientHeaders);
    const cleanedSongName = cleanSongName(songName);
    // eslint-disable-next-line no-restricted-syntax
    for (const source of sources) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const lyrics = await source.method(artistName, cleanedSongName, headers);
        if (!lyrics) {
          throw new Error();
        }
        return {
          lyrics,
          source: source.name,
        };
      } catch { } // eslint-disable-line no-empty
    }
    throw new Error('LYRICS_NOT_FOUND');
  }
}

export default LyricsHelper;
