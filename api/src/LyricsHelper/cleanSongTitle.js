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
];

const secondSuffixes = [
  / ?(\(|\[)feat\.? .*(\)|\]) ?/,
  / ?\(with .*\) ?/,
];

const cleanSongTitle = (songName, aggressive) => {
  let cleanedUp = songName;
  safeSuffixes.forEach((regexp) => {
    cleanedUp = cleanedUp.replace(regexp, '');
  });
  if (aggressive) {
    secondSuffixes.forEach((regexp) => {
      cleanedUp = cleanedUp.replace(regexp, '');
    });
  }
  return cleanedUp;
};

const hasRemovableSuffixes = (songName) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const regexp of secondSuffixes) {
    if (songName.match(regexp)) return true;
  }
  return false;
};

export default cleanSongTitle;
export { hasRemovableSuffixes };
