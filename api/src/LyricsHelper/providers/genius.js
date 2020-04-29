import fetch from 'node-fetch';
import { parse } from 'node-html-parser';
import urlify from '../urlify';

const generateGeniusUrl = (artistName, songName) => {
  const trackInfo = `${encodeURIComponent(urlify(artistName))}-${encodeURIComponent(urlify(songName))}`;
  return `https://genius.com/${trackInfo}-lyrics`;
};

const textToArray = (text) => {
  const lines = text.split('\n');
  let currentIndex = 0;
  const array = lines.reduce((acc, curr) => {
    const line = curr.trim();
    if (!line || line === 'Intéressé(e) par l\'explication des paroles de cette chanson ou d\'autres ? Venez faire l\'analyse des textes avec nous !') {
      currentIndex += 1;
    } else {
      if (!acc[currentIndex]) {
        acc[currentIndex] = [];
      }
      acc[currentIndex].push(line);
    }
    return acc;
  }, []);
  return array.filter((e) => e.length);
};

const fetchFromGenius = async (artistName, songName, headers) => {
  const url = generateGeniusUrl(artistName, songName);
  const result = await fetch(url, {
    headers,
  }).then((r) => r.text()).then((text) => text.split('\n').slice(1).join('\n'));
  const root = parse(result);
  const lyricsNode = root.querySelector('[initial-content-for="lyrics"]');
  if (!lyricsNode) {
    throw new Error('LYRICS_NOT_FOUND');
  }
  return textToArray(lyricsNode.text);
};

export default fetchFromGenius;
