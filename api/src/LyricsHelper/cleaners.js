const removalRules = [
  / - ?\d{0,4} Remaster(ed)?$/gi,
  / \(\d{0,4} ?Remaster(ed)?\)$/gi,
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
  / - Remaster.+$/gi,
  / \(Remaster.+\)$/gi,
  / - From .* Soundtrack$/gi,
  / \(From .* Soundtrack\)$/gi,
];

export const cleanSongName = (songName) => {
  let cleanedUp = songName;
  removalRules.forEach((regexp) => {
    cleanedUp = cleanedUp.replace(regexp, '');
  });
  return cleanedUp;
};

const featRemovalRules = [
  / ?(\(|\[)feat\.? .*(\)|\]) ?/,
  / ?\(with .*\) ?/,
];

export const removeFeat = (songName) => {
  let cleanedUp = songName;
  featRemovalRules.forEach((regexp) => {
    cleanedUp = cleanedUp.replace(regexp, '');
  });
  return cleanedUp;
};
