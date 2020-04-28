const cleanSongName = (songName) => {
  let cleanedUp = songName;
  cleanedUp = cleanedUp.replace(/ - ?\d{0,4} Remaster(ed)?$/gi, '');
  cleanedUp = cleanedUp.replace(/ \(\d{0,4} ?Remaster(ed)?\)$/gi, '');
  cleanedUp = cleanedUp.replace(/ - Live.*$/gi, '');
  cleanedUp = cleanedUp.replace(/ \(Live.*\)$/gi, '');
  cleanedUp = cleanedUp.replace(/ - Remix$/gi, '');
  cleanedUp = cleanedUp.replace(/ \(Remix\)$/gi, '');
  cleanedUp = cleanedUp.replace(/ - Bonus$/gi, '');
  cleanedUp = cleanedUp.replace(/ \(Bonus\)$/gi, '');
  cleanedUp = cleanedUp.replace(/ - Original Mix$/gi, '');
  cleanedUp = cleanedUp.replace(/ \(Original Mix\)$/gi, '');
  cleanedUp = cleanedUp.replace(/ - Acoustic$/gi, '');
  cleanedUp = cleanedUp.replace(/ \(Acoustic\)$/gi, '');
  cleanedUp = cleanedUp.replace(/ - Remaster.+$/gi, '');
  cleanedUp = cleanedUp.replace(/ \(Remaster.+\)$/gi, '');
  cleanedUp = cleanedUp.replace(/ - From .* Soundtrack$/gi, '');
  cleanedUp = cleanedUp.replace(/ \(From .* Soundtrack\)$/gi, '');
  console.log(`SONG NAME ${cleanedUp}`);
  return cleanedUp;
};

export default cleanSongName;
