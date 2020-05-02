// noisy suffixes that can probably be removed without getting different lyrics
const safeSuffixes = [
  / - ?\d{0,4} Remaster.*$/i,
  / \(\d{0,4} ?Remaster.*\)$/i,
  / - Remaster.+$/i,
  / \(Remaster.+\)$/i,
  / - Live.*$/i,
  / \(Live.*\)$/i,
  / - Remix$/i,
  / \(Remix\)$/i,
  / - Electro Mix$/i,
  / \(Electro Mix\)$/i,
  / - Bonus( Track)?$/i,
  / \(Bonus( Track)?\)$/i,
  / - Acoustic$/i,
  / \(Acoustic\)$/i,
  / - From .* Soundtrack$/i,
  / \(From .* Soundtrack\)$/i,
  /Side \d{1,2}, Pt\. \d{1,2}:/i,
];

// suffixes that should only be removed if we do not find lyrics with them
const unsafeSuffixes = [
  / ?(\(|\[)feat\.? .*(\)|\]) ?/i,
  / ?\(with .*\) ?/i,
  / - .* Version$/i,
  / \(.* Version\)$/i,
  / - .* Remix$/i,
  / \(.* Remix\)$/i,
  / - Original Mix$/i,
  / \(Original Mix\)$/i,
];

const cleanSongTitle = (songName, aggressive) => {
  let cleanedUp = songName;
  safeSuffixes.forEach((regexp) => {
    cleanedUp = cleanedUp.replace(regexp, '');
  });
  if (aggressive) {
    unsafeSuffixes.forEach((regexp) => {
      cleanedUp = cleanedUp.replace(regexp, '');
    });
  }
  return cleanedUp;
};

const hasRemovableSuffixes = (songName) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const regexp of unsafeSuffixes) {
    if (songName.match(regexp)) return true;
  }
  return false;
};

export default cleanSongTitle;
export { hasRemovableSuffixes };
