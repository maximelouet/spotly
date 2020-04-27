# Spotly

Display lyrics from your currently playing song on Spotify.

## Features

Display the current song you play on Spotify along with its lyrics, updated in
~real-time.

## How it works

The backend (`api/`) parses several lyric sites for lyrics and returns the first
found to the frontend (`front/`) for display.

## Limitations

- Google has advanced scraping detection mechanisms. Low rate scraping (i.e.
  running Spotly locally) is not detected but the https://spotly.fi instance is.

- Some song titles are unrecognised by Google because they contain additional
  unneeded data for lyrics, such as "Remastered", "2020 Mix", etc. In most cases
  it still manages to find the lyrics though. See
  https://github.com/maximelouet/spotly/issues/4

## Running locally

### With Docker

The `docker-compose.yml` allows you to run the app locally. Prior to starting it
you must set some environment variables in `api/.env`. See
[`api/README.md`](https://github.com/maximelouet/spotly/blob/master/api/README.md)
for more informations. Set `http://localhost` as `FRONT_URL`.

Once the environment variables are set, run the project with:

```shell
$ docker-compose up
```

The frontend will be available on `http://localhost/` (port 80).

### Standard way

This method is recommended if you are developing and want auto-reload upon code
change.

If you are not running NodeJS v12, please install
[nvm](https://github.com/nvm-sh/nvm) and run `nvm use` in the repository.

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
