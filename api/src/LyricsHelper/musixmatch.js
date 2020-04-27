import fetch from 'node-fetch';
import { parse } from 'node-html-parser';

const generateSearchUrl = (artistName, songName) => {
  const trackInfo = `${encodeURIComponent(artistName.toLowerCase().replace(/^\w/, c => c.toUpperCase())).replace(/%20/g, ' ')} ${encodeURIComponent(songName.toLowerCase()).replace(/%20/g, ' ')}`;
  return `https://www.musixmatch.com/search/${trackInfo}`;
};

const htmlToArray = (html) => {
  const text = html.replace(/<span class="lyrics__content__ok">/gi, '\n');
  const lines = text.split('\n');
  let currentIndex = 0;
  const array = lines.reduce((acc, curr) => {
    const line = curr.trim().replace(/<.*?>/gi, '');
    if (!line) {
      currentIndex += 1;
    } else {
      if (!acc[currentIndex]) {
        acc[currentIndex] = [];
      }
      acc[currentIndex].push(line);
    }
    return acc;
  }, []);
  return array.filter(e => e.length);
};

const fetchFromMusixmatch = async (artistName, songName, headers) => {
  const url = generateSearchUrl(artistName, songName);
  const searchPage = await fetch(url, {
    headers,
  }).then(r => r.text());
  const searchRoot = parse(searchPage);
  const resultsDiv = searchRoot.querySelector('#search-all-results .box-style-plain .media-card-title .title');
  const link = resultsDiv.toString().replace(/<a class="title" href="(.*?)".*/gi, '$1');
  const lyricsPage = await fetch(`https://www.musixmatch.com${link}`, {
    headers,
  }).then(r => r.text());
  const root = parse(lyricsPage);
  const lyricsNode = root.querySelectorAll('.mxm-lyrics__content');
  const lyricsFor = root.querySelector('div.lyrics-to.hidden-xs.hidden-sm');
  if (!lyricsNode
    || !lyricsNode[0]
    || root.text.includes('submitted the lyrics for this song. Are the lyrics correct?')
    || root.text.includes('These lyrics are waiting for review')
    || !lyricsFor.text.toLowerCase().includes(artistName.split(' ')[0].toLowerCase())) {
    throw new Error('LYRICS_NOT_FOUND');
  }
  const lyricsString = lyricsNode.reduce((acc, curr) => acc + curr.toString(), '');
  return htmlToArray(lyricsString);
};

export default fetchFromMusixmatch;
