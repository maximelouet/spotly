import { describe, it } from 'mocha';
import { expect } from 'chai';
import { cleanSongName } from '../src/LyricsHelper/cleaners';

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
    original: 'Ready For You - Acoustic',
    expected: 'Ready For You',
  },
  {
    original: 'Night Fever - From "Saturday Night Fever" Soundtrack',
    expected: 'Night Fever',
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
];

describe('Clean song name', () => {
  it('removes noisy Spotify suffixes', () => {
    songsToClean.forEach((song) => expect(cleanSongName(song.original)).to.equal(song.expected));
  });

  it('keeps some safe suffixes', () => {
    songsToKeep.forEach((song) => expect(cleanSongName(song)).to.equal(song));
  });
});
