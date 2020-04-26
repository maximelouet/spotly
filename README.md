# Spotly

Display lyrics from your currently playing song on Spotify.

## Features

Display the current song you play on Spotify along with its lyrics, updated in
~real-time (see Limitations).

## How it works

The backend (`api/`) parses Google (other sites will be added in the future) for
lyrics and returns them to the frontend (`front/`) for display. It performs a
Google search query in the form of `ARTIST SONG lyrics` and tries to find the
embedded lyrics that Google displays.

## Limitations

- The backend only polls Google for lyrics. As such, if Google does not display
  them, the API cannot return them either. I plan to add other lyrics sites as a
  fallback.
- Some song titles are unrecognised by Google because they contain additional
  unneeded data for lyrics, such as "Remastered", "2020 Mix", etc. In most cases
  it still manages to find the lyrics though. See
  https://github.com/maximelouet/spotly/issues/4
- Current refresh mechanism is a simple interval that polls the API every x
  seconds for current song info and lyrics. This generates useless load on the
  API and on the user's network, and does not take into account the current song
  state (if it's about to finish we should prepare to poll the API for new song
  info and lyrics). See https://github.com/maximelouet/spotly/issues/2

## Running locally

This project uses [nvm](https://github.com/nvm-sh/nvm) to ensure NodeJS version
consistency. If you are not running NodeJS v12, please install nvm and run `nvm
use` in the repository.

See the respective README files in `api/` and `front/` for instructions on how
to run each part.

## Contributing

The easiest way to contribute is to report issues with a detailed explanation of
your problem in the [issues
section](https://github.com/maximelouet/spotly/issues), after checking that it's
not already been reported.

## License

This project is licensed under the Apache License 2.0. See
[`LICENSE`](https://github.com/maximelouet/spotly/blob/master/LICENSE) for
details.
