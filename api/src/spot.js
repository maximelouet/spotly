import SpotifyWebApi from 'spotify-web-api-node';
import LyricsHelper from './lyrics';

const scopes = ['user-read-playback-state', 'user-read-currently-playing'];

class Spot {
  static getApiInstance(params) {
    return new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      redirectUri: process.env.SPOTIFY_REDIRECT_URI,
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

  static async getPlaybackState(accessToken) {
    const api = this.getApiInstance({
      accessToken,
    });
    const playbackState = await api.getMyCurrentPlaybackState({}).then((res) => res.body);
    // remove unused resources to save network resources and protect the user's privacy
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
        message: 'No music is currently playing',
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
        lyricsStatus: e.message,
      };
    }
  }
}

export default Spot;
