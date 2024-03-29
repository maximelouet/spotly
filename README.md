# Spotly

Display the current song you play on Spotify along with its lyrics, in a
minimalist and lightweight Web page.

## How it works

Once you login to Spotify, we query the Spotify API to retrieve your currently
playing track. The backend (`api/`) then searches several lyrics sites for the
corresponding lyrics and returns the first found to the frontend (`front/`) for
display.

## Limitations

- Perfect real-time song updates are not possible as the Spotify API does not
  provide a listening/socket feature. The frontend polls the API every 10
  seconds to check for song changes, and it automatically queries the API after
  an automatic song change, but it cannot detect a user-triggered change
  immediately — it will only be reflected a few seconds later. Feel free to
  refresh the page manually to update.

- We do not invent lyrics! If the popular sites we fetch do not know a song's
  lyrics, we cannot either. "Lyrics not found" errors for low-popularity songs
  are "normal".

- Some lyrics are marked as "unverified"/"waiting for review" on Musixmatch. The
  current strategy is to drop them as they may be completely invalid: we prefer
  to return "Lyrics not found" for many songs rather than incorrect lyrics for
  some songs. A possible strategy to adopt would be to show these lyrics (if no
  other source are found) with an "unverified" indicator.

## Running locally

### With Docker

The `docker-compose.yml` allows you to run the app locally. Prior to starting it
you must set some environment variables in `api/.env` and `front/.env`. See
[`api/README.md`](https://github.com/maximelouet/spotly/blob/main/api/README.md)
and
[`front/README.md`](https://github.com/maximelouet/spotly/blob/main/front/README.md)
for detailed instructions.

Once the environment variables are set, run the project with:

```shell
$ docker-compose up
```

With the default configuration (from the `.env.dev` file), the frontend will be
available on `http://localhost:3000/`.

### Standard way

This method is recommended if you are developing and want auto-reload upon code
change.

If you are not running NodeJS v20, please install
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
[`LICENSE`](https://github.com/maximelouet/spotly/blob/main/LICENSE) for
details.
