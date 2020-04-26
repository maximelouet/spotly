import fetch from 'node-fetch';
import { parse } from 'node-html-parser';

const cleanUpGoogleResult = (html) => {
  let cleanedUp = html;
  cleanedUp = cleanedUp.replace(/<\/?span.*?>/gi, '');
  cleanedUp = cleanedUp.replace(/<\/?div.*?>/gi, '<br>');
  cleanedUp = cleanedUp.replace(/<br><br>/gi, '</p><p>');
  cleanedUp = cleanedUp.replace(/<br>/gi, '|BR|');
  cleanedUp = cleanedUp.replace(/<p>([^<]+)&hellip; <\/p>/gi, '');
  cleanedUp = cleanedUp.replace(/\|BR\|/gi, '<br>');
  cleanedUp = cleanedUp.replace(/^<\/p>/g, '');
  cleanedUp = cleanedUp.replace(/<p><br>$/g, '');
  cleanedUp = cleanedUp.replace(/ <br>/g, '<br>');
  if (cleanedUp.endsWith('</p>')) {
    cleanedUp = cleanedUp.slice(0, -4);
  }
  return cleanedUp;
};

const htmlToArray = (html) => {
  const paragraphs = html.split('</p><p>');
  let final = [];
  paragraphs.forEach(elm => {
    final.push(elm.split('<br>').filter(e => e !== '<p>' && e !== '</p>' && e.length));
  });
  final = final.filter(e => e.length);
  return final;
};

class LyricsHelper {
  static async findLyrics(artistName, songName) {
    // TODO: implement other fetching methods
    return this.fromGoogle(artistName, songName);
  }

  static async fromGoogle(artistName, songName) {
    const url = `https://www.google.com/search?q=Lyrics+${encodeURIComponent(artistName).replace('%20', '+')}+${encodeURIComponent(songName).replace('%20', '+')}`;
    const result = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:76.0) Gecko/20100101 Firefox/76.0',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-GB,en;q=0.8,fr-FR;q=0.5,fr;q=0.3',
      },
    }).then(r => r.text()).then(text => text.split('\n').slice(1).join('\n'));
    const root = parse(result);
    const lyricsNode = root.querySelector('[data-lyricid]');
    if (!lyricsNode) {
      if (songName.includes('feat')) {
        return this.fromGoogle(artistName, songName.substring(0, songName.indexOf('feat')));
      }
      throw new Error('LYRICS_NOT_FOUND');
    }
    const lyricsHtml = cleanUpGoogleResult(lyricsNode.toString());
    const lyrics = htmlToArray(lyricsHtml);
    return { lyrics };
  }
}

export default LyricsHelper;
