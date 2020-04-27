import fetch from 'node-fetch';
import { parse } from 'node-html-parser';

const computeRequestHeaders = (clientHeaders) => {
  return {
    'User-Agent': clientHeaders.userAgent || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.122 Safari/537.36',
    'Accept-Language': clientHeaders.acceptLanguage || 'en-GB,en;q=0.8,fr-FR;q=0.5,fr;q=0.3',
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'Upgrade-Insecure-Requests': 1,
    'Cache-Control': 'max-age=0',
  };
};

const generateGoogleSearchUrl = (artistName, songName) => {
  let random = Math.random();
  let domain;
  if (random < 0.3) {
    domain = 'fr';
  } else if (random < 0.6) {
    domain = 'co.uk';
  } else {
    domain = 'com';
  }
  random = Math.random();
  const begin = random > 0.5 ? 'lyrics+' : '';
  const end = random > 0.5 ? '' : '+lyrics';
  return `https://www.google.${domain}/search?q=${begin}${encodeURIComponent(artistName.toLowerCase()).replace('%20', '+')}+${encodeURIComponent(songName.toLowerCase()).replace('%20', '+')}${end}`;
};

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
  static async findLyrics(artistName, songName, clientHeaders) {
    const headers = computeRequestHeaders(clientHeaders);
    // TODO: implement other fetching methods
    return this.fromGoogle(artistName, songName, headers);
  }

  static async fromGoogle(artistName, songName, headers) {
    const url = generateGoogleSearchUrl(artistName, songName);
    console.log(url);
    const result = await fetch(url, {
      headers,
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
