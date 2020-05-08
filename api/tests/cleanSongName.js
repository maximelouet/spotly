const { describe, it } = require('mocha');
const { expect } = require('chai');
const { cleanSongTitle } = require('../src/LyricsHelper/cleanSongTitle');

const songsToClean = [
  {
    original: 'Drive My Car - Remastered 2009',
    expected: 'Drive My Car',
  },
  {
    original: 'Travesti - 2009 Remastered',
    expected: 'Travesti',
  },
  {
    original: 'Enola Gay - Remastered',
    expected: 'Enola Gay',
  },
  {
    original: 'High Hopes - 2011 Remaster',
    expected: 'High Hopes',
  },
  {
    original: 'Eclipse - 2011 Remastered Version',
    expected: 'Eclipse',
  },
  {
    original: 'Résiste - Remasterisé en 2004',
    expected: 'Résiste',
  },
  {
    original: 'Mad About You - Live at Koningin Elisabethzaal 2012',
    expected: 'Mad About You',
  },
  {
    original: 'Learning To Fly - Live, Delicate Sound Of Thunder, 2019 Remix',
    expected: 'Learning To Fly',
  },
  {
    original: 'Shine On You Crazy Diamond - Live',
    expected: 'Shine On You Crazy Diamond',
  },
  {
    original: 'Good as Hell (feat. Ariana Grande) - Remix',
    expected: 'Good as Hell (feat. Ariana Grande)',
  },
  {
    original: 'Apollo - Electro Mix',
    expected: 'Apollo',
  },
  {
    original: 'Backyard - Bonus Track',
    expected: 'Backyard',
  },
  {
    original: 'Backyard - Bonus',
    expected: 'Backyard',
  },
  {
    original: 'Ready For You - Acoustic',
    expected: 'Ready For You',
  },
  {
    original: 'Ready For You - Acoustic Version',
    expected: 'Ready For You',
  },
  {
    original: 'Night Fever - From "Saturday Night Fever" Soundtrack',
    expected: 'Night Fever',
  },
  {
    original: 'Side 4, Pt. 4: Louder Than Words',
    expected: 'Louder Than Words',
  },
  {
    original: 'Que veux-tu (Madeon Remix) [Bonus Track]',
    expected: 'Que veux-tu (Madeon Remix)',
  },
];

const songsToCleanAggressive = [
  {
    original: 'Drive My Car - Remastered 2009',
    expected: 'Drive My Car',
  },
  {
    original: 'The Modjo Radio Gang - Radio Version',
    expected: 'The Modjo Radio Gang',
  },
  {
    original: 'Solo (Reprise)',
    expected: 'Solo',
  },
  {
    original: 'Solo - Reprise',
    expected: 'Solo',
  },
  {
    original: 'Heroine - Radio Edit',
    expected: 'Heroine',
  },
  {
    original: 'Heroine - Radio Edit',
    expected: 'Heroine',
  },
  {
    original: 'Test & Recognise - Flume Re-work',
    expected: 'Test & Recognise',
  },
  {
    original: 'Faded (Interlude)',
    expected: 'Faded',
  },
  {
    original: 'Faded - Interlude',
    expected: 'Faded',
  },
  {
    original: 'Faces - Original Extended Version',
    expected: 'Faces',
  },
  {
    original: 'Trop vite - Version single',
    expected: 'Trop vite',
  },
];

const songsToKeep = [
  'Forest Fire - Extended Version',
  'It\'s Time To Wake Up (2023)',
  'Be Somebody - Instrumental',
  'The Modjo Radio Gang - Radio Version',
  'Sorry About the Carpet - Edit',
  'Live This Nightmare - NGHTMRE Remix',
  'Clockwork - Original Mix',
  'One Slip - 2019 Remix',
  'Don\'t Stop Me Now - 2011 Mix',
  'A song with remix in it',
  'Solo (Reprise)',
  'Faces - Original Extended Version',
  'Trop vite - Version single',
];

const songsToKeepAggressive = [
  'It\'s Time To Wake Up (2023)',
  'Be Somebody - Instrumental',
  'Acoustic song',
  'A song with remix in it',
  'Interlude',
];

describe('Clean song name', () => {
  it('removes noisy Spotify suffixes', () => {
    songsToClean.forEach(
      (song) => expect(cleanSongTitle(song.original, false)).to.equal(song.expected),
    );
  });

  it('aggressively removes Spotify suffixes', () => {
    songsToCleanAggressive.forEach(
      (song) => expect(cleanSongTitle(song.original, true)).to.equal(song.expected),
    );
  });

  it('keeps some safe suffixes on first try', () => {
    songsToKeep.forEach((song) => expect(cleanSongTitle(song, false)).to.equal(song));
  });

  it('keeps some safe suffixes in aggressive mode', () => {
    songsToKeepAggressive.forEach((song) => expect(cleanSongTitle(song, true)).to.equal(song));
  });
});
