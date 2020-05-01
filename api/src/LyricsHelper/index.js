import fetchFromGenius from './providers/genius';
import fetchFromMusixmatch from './providers/musixmatch';
import fetchFromGoogle from './providers/google';
import cleanSongTitle, { hasRemovableSuffixes } from './cleanSongTitle';

const computeRequestHeaders = (clientHeaders) => {
  // site respond differently to mobile user agents so we always choose a desktop one
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
  static async findLyrics(artistName, songName, clientHeaders, secondAttempt = false) {
    const headers = computeRequestHeaders(clientHeaders);
    // remove "Remastered" and other noisy suffixes from Spotify
    const cleanedSongName = cleanSongTitle(songName, secondAttempt);
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
    if (!secondAttempt && hasRemovableSuffixes(songName)) {
      // try again without "feat" or other identifiers
      // we do not remove them initially as some songs have different non-feat lyrics
      return this.findLyrics(artistName, songName, clientHeaders, true);
    }
    throw new Error('LYRICS_NOT_FOUND');
  }
}

export default LyricsHelper;
