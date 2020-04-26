import SpotifyWebApi from 'spotify-web-api-node';
import LyricsHelper from './LyricsHelper';

const scopes = ['user-read-playback-state', 'user-read-currently-playing'];

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
    const playbackState = await api.getMyCurrentPlaybackState({}).then((res) => res.body);
    // remove unused fields to save network resources and protect the user's privacy
    if (playbackState.actions) {
      delete playbackState.actions;
    }
    if (playbackState.item && playbackState.item.available_markets) {
      delete playbackState.item.available_markets;
    }
    if (playbackState.item && playbackState.item.album
      && playbackState.item.album.available_markets) {
      delete playbackState.item.album.available_markets;
    }
    if (playbackState.device) {
      delete playbackState.device;
    }
    return { playbackState };
  }

  static async getSongLyrics(accessToken) {
    const playbackState = await this.getPlaybackState(accessToken).then(ps => ps.playbackState);
    const isPlaying = playbackState.item && playbackState.item.artists[0];
    if (!isPlaying) {
      return {
        error: 'NOTHING_PLAYING',
      };
    }
    try {
      const lyrics = await LyricsHelper.findLyrics(playbackState.item.artists[0].name,
        playbackState.item.name);
      return {
        playbackState,
        ...lyrics,
      };
    } catch (e) {
      return {
        playbackState,
        lyrics: '',
        error: e.message,
      };
    }
  }
}

export default Spotly;
