import fetch from 'node-fetch';
import { parse } from 'node-html-parser';
import urlify from '../urlify';

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
  const trackInfo = `${encodeURIComponent(urlify(artistName, '+'))}+${encodeURIComponent(urlify(songName, '+'))}`;
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
  // eslint-disable-next-line eqeqeq
  if (!process.env.ENABLE_GOOGLE || (process.env.ENABLE_GOOGLE != 'true' && process.env.ENABLE_GOOGLE != '1')) {
    throw new Error();
  }
  const url = generateGoogleUrl(artistName, songName);
  const result = await fetch(url, {
    headers,
  }).then(r => r.text()).then(text => text.split('\n').slice(1).join('\n'));
  const root = parse(result);
  const lyricsNode = root.querySelector('[data-lyricid]');
  if (!lyricsNode) {
    throw new Error('LYRICS_NOT_FOUND');
  }
  const lyricsHtml = cleanUpResult(lyricsNode.toString());
  return htmlToArray(lyricsHtml);
};

export default fetchFromGoogle;
