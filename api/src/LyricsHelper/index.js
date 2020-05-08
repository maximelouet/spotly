const fetchFromGenius = require('./providers/genius');
const fetchFromMusixmatch = require('./providers/musixmatch');
const fetchFromGoogle = require('./providers/google');
const { cleanSongTitle } = require('./cleanSongTitle');
const computeRequestHeaders = require('./computeRequestHeaders');

const sources = [
  {
    name: 'Genius',
    method: fetchFromGenius,
    enabled: true,
  },
  {
    name: 'Musixmatch',
    method: fetchFromMusixmatch,
    enabled: true,
  },
  {
    name: 'Google',
    method: fetchFromGoogle,
    enabled: (process.env.ENABLE_GOOGLE && (process.env.ENABLE_GOOGLE === 'true' || process.env.ENABLE_GOOGLE === '1')),
  },
];

class LyricsHelper {
  static async findLyrics(artistName, songName, clientHeaders, logger, secondAttempt = false) {
    const headers = computeRequestHeaders(clientHeaders);
    // remove "Remastered" and other noisy suffixes from Spotify
    const cleanedSongName = cleanSongTitle(songName, secondAttempt);
    // eslint-disable-next-line no-restricted-syntax
    for (const source of sources) {
      if (!source.enabled) continue; // eslint-disable-line no-continue
      try {
        // eslint-disable-next-line no-await-in-loop
        const lyrics = await source.method(artistName, cleanedSongName, headers);
        if (!lyrics || !lyrics.lyrics) {
          throw new Error('EMPTY_LYRICS_OBJECT');
        }
        return {
          ...lyrics,
          source: source.name,
        };
      } catch (e) {
        if (e.message === 'INSTRUMENTAL') {
          return {
            lyrics: [['Instrumental']],
            source: source.name,
          };
        }
        if (e.message !== 'LYRICS_NOT_FOUND') {
          logger.warn(e);
        }
      }
    }
    if (!secondAttempt) {
      // try again, without "feat" or other identifiers
      // we do not remove them initially as some songs have different non-feat lyrics
      // we try again even if there are no removable suffixes since some requests fail randomly
      logger.info({ artistName, songName }, 'Second attempt');
      return this.findLyrics(artistName, songName, clientHeaders, logger, true);
    }
    logger.info({ artistName, songName }, 'Lyrics not found');
    throw new Error('LYRICS_NOT_FOUND');
  }
}

module.exports = LyricsHelper;
