import fetch from 'node-fetch';
import { parse } from 'node-html-parser';
import { DomHandler } from 'domhandler';
import { Parser } from 'htmlparser2';
import * as DomUtils from 'domutils';
import CSSselect from 'css-select';
import { XmlEntities as Entities } from 'html-entities';
import { geniusUrlify } from '../urlify';

const entities = new Entities();

const generateGeniusUrl = (artistName, songName) => {
  const trackInfo = `${encodeURIComponent(geniusUrlify(artistName))}-${encodeURIComponent(geniusUrlify(songName))}`;
  return `https://genius.com/${trackInfo}-lyrics`;
};

const isSkippableLine = (line) => {
  const triggers = [
    /Intéressé\(e\) par l'explication des paroles de cette chanson ou d'autres \? Venez faire l'analyse des textes avec nous !/,
    /^\[Click here to.*]$/i,
    /^\[Music Video]$/i,
  ];
  // eslint-disable-next-line no-restricted-syntax
  for (const trig of triggers) {
    if (line.match(trig)) {
      return true;
    }
  }
  return false;
};

const textToArray = (text, fixAlternativeLayoutAnnotations = false) => {
  const lines = text.split('\n');
  let currentIndex = 0;
  const array = lines.reduce((acc, curr) => {
    const line = curr.trim();
    if (!line || isSkippableLine(line)) {
      currentIndex += 1;
    } else {
      if (fixAlternativeLayoutAnnotations && line.match(/^\[.*]$/g)) {
        currentIndex += 1;
      }
      if (!acc[currentIndex]) {
        acc[currentIndex] = [];
      }
      acc[currentIndex].push(line);
    }
    return acc;
  }, []);
  return array.filter((e) => e.length);
};

const fetchPage = async (url, headers) => {
  let finalUrl = '';
  let status = 404;
  const result = await fetch(url, {
    headers,
  }).then((r) => {
    finalUrl = r.url;
    status = r.status;
    return r.text();
  }).then((text) => text.split('\n').slice(1).join('\n'));
  return {
    result,
    status,
    url: finalUrl,
  };
};

const parseAlternativeLayout = (html) => new Promise((resolve) => {
  const handler = new DomHandler((error, dom) => {
    if (error) {
      throw error;
    }
    const lyricsNode = CSSselect('[class*="Lyrics__Container-"]', dom);
    if (!lyricsNode) {
      const instruNode = CSSselect('[class*="LyricsPlaceholder__Message"]', dom);
      if (instruNode) {
        if (DomUtils.getText(instruNode) === 'This song is an instrumental') {
          throw new Error('INSTRUMENTAL');
        }
      } else {
        throw new Error('LYRICS_NOT_FOUND');
      }
    }
    const text = DomUtils.getText(lyricsNode);
    if (!text) {
      throw new Error('LYRICS_NOT_FOUND');
    }
    const decodedText = entities.decode(text);
    resolve(textToArray(decodedText, true));
  });
  const parser = new Parser(handler);
  parser.write(html);
  parser.end();
});

const fetchFromGenius = async (artistName, songName, headers) => {
  let fetchUrl = generateGeniusUrl(artistName, songName);
  const fetchResult = await fetchPage(fetchUrl, headers);
  let { result, url } = fetchResult;
  const { status } = fetchResult;
  if (status === 404) {
    // some Genius song names include "ft" instead of "feat"
    if (songName.includes('feat')) {
      fetchUrl = generateGeniusUrl(artistName, songName.replace('feat', 'ft'));
      const newResult = await fetchPage(fetchUrl, headers);
      result = newResult.result;
      url = newResult.url;
    } else {
      throw new Error('LYRICS_NOT_FOUND');
    }
  }
  const root = parse(result);
  const lyricsNode = root.querySelector('[initial-content-for="lyrics"]');
  let lyrics;
  if (lyricsNode) {
    lyrics = textToArray(lyricsNode.text);
  } else {
    // Sometimes (every ~10 requests) Genius returns an alternative HTML page (A/B testing?)
    lyrics = await parseAlternativeLayout(result);
    if (!lyrics) {
      throw new Error('LYRICS_NOT_FOUND');
    }
  }
  if (lyrics.length === 1 && lyrics[0].length === 1 && lyrics[0][0] === '[Instrumental]') {
    throw new Error('INSTRUMENTAL');
  }
  return {
    lyrics,
    url,
  };
};

export default fetchFromGenius;
