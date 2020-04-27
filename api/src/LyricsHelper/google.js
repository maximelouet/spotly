import fetch from 'node-fetch';
import { parse } from 'node-html-parser';

const generateGoogleUrl = (artistName, songName) => {
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
  const trackInfo = `${encodeURIComponent(artistName.toLowerCase()).replace(/%20/g, '+')}+${encodeURIComponent(songName.toLowerCase()).replace(/%20/g, '+')}`;
  return `https://www.google.${domain}/search?q=${begin}${trackInfo}${end}`;
};

const cleanUpResult = (html) => {
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

const fetchFromGoogle = async (artistName, songName, headers) => {
  const url = generateGoogleUrl(artistName, songName);
  const result = await fetch(url, {
    headers,
  }).then(r => r.text()).then(text => text.split('\n').slice(1).join('\n'));
  const root = parse(result);
  const lyricsNode = root.querySelector('[data-lyricid]');
  if (!lyricsNode) {
    if (result.includes('Our systems have detected unusual traffic from your computer network')) {
      throw new Error('GOOGLE_ANTI_CRAWL_LIMIT');
    }
    if (songName.includes('feat')) {
      return fetchFromGoogle(artistName, songName.substring(0, songName.indexOf('feat')));
    }
    throw new Error('LYRICS_NOT_FOUND');
  }
  const lyricsHtml = cleanUpResult(lyricsNode.toString());
  const lyrics = htmlToArray(lyricsHtml);
  return { lyrics };
};

export default fetchFromGoogle;
