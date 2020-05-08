const SpotifyWebApi = require('spotify-web-api-node');
const LyricsHelper = require('./LyricsHelper');

const scopes = ['user-read-playback-state', 'user-read-currently-playing'];

const serializePlaybackStateFromSpotify = (ps) => {
  if (!ps.item?.artists[0]) {
    return {
      isPlaying: false,
    };
  }
  return {
    isPlaying: ps.is_playing,
    song: {
      id: ps.item.id,
      name: ps.item.name,
      artists: ps.item.artists.reduce((acc, cur) => [...acc, cur.name], []),
      image: ps.item.album.images[ps.item.album.images.length - 1].url,
      progressMs: ps.progress_ms,
      durationMs: ps.item.duration_ms,
    },
  };
};

class Spotly {
  static getApiInstance(params) {
    return new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      redirectUri: `${process.env.FRONT_URL.replace(/\/$/, '')}/callback`,
      ...params,
    });
  }

  static getAuthorizeUrl() {
    return {
      url: this.getApiInstance().createAuthorizeURL(scopes, '', false),
    };
  }

  static async exchangeCode(code) {
    const authData = await this.getApiInstance().authorizationCodeGrant(code);
    return authData.body;
  }

  static async refreshToken(rToken) {
    const authData = await this.getApiInstance({
      refreshToken: rToken,
    }).refreshAccessToken();
    return authData.body;
  }

  static async getPlaybackState(accessToken) {
    const api = this.getApiInstance({
      accessToken,
    });
    const psResponse = await api.getMyCurrentPlaybackState({}).then((res) => res.body);
    const playbackState = serializePlaybackStateFromSpotify(psResponse);
    if (!playbackState.song) {
      return {
        error: 'NOTHING_PLAYING',
      };
    }
    return {
      playbackState,
    };
  }

  static async getPlaybackLyrics(accessToken, clientHeaders, logger) {
    const rawPlaybackState = await this.getPlaybackState(accessToken);
    if (rawPlaybackState.error) {
      return rawPlaybackState;
    }
    const { playbackState } = rawPlaybackState;
    try {
      const lyricsData = await LyricsHelper.findLyrics(playbackState.song.artists[0],
        playbackState.song.name, clientHeaders, logger);
      return {
        playbackState,
        lyricsData,
      };
    } catch (e) {
      return {
        playbackState,
        error: e.message,
      };
    }
  }
}

module.exports = Spotly;
