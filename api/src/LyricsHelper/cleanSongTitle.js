// noisy suffixes that can probably be removed without getting different lyrics
const safeSuffixes = [
  / - ?\d{0,4} Remaster.*$/gi,
  / \(\d{0,4} ?Remaster.*\)$/gi,
  / - Remaster.+$/gi,
  / \(Remaster.+\)$/gi,
  / - Live.*$/gi,
  / \(Live.*\)$/gi,
  / - Remix$/gi,
  / \(Remix\)$/gi,
  / - Electro Mix$/gi,
  / \(Electro Mix\)$/gi,
  / - Bonus( Track)?$/gi,
  / \(Bonus( Track)?\)$/gi,
  / - Acoustic$/gi,
  / \(Acoustic\)$/gi,
  / - From .* Soundtrack$/gi,
  / \(From .* Soundtrack\)$/gi,
  /Side \d{1,2}, Pt\. \d{1,2}:/gi,
];

// suffixes that should only be removed if we do not find lyrics with them
const unsafeSuffixes = [
  / ?(\(|\[)feat\.? .*(\)|\]) ?/,
  / ?\(with .*\) ?/,
  / - .* Version$/gi,
  / \(.* Version\)$/gi,
  / - .* Remix$/gi,
  / \(.* Remix\)$/gi,
  / - Original Mix$/gi,
  / \(Original Mix\)$/gi,
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
