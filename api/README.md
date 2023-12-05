# Spotly API

The API uses [fastify](https://www.fastify.io/) as a Web server framework.

## Environment variables

| Environment variable  | Description                                                                                                                   | Mandatory |
|-----------------------|-------------------------------------------------------------------------------------------------------------------------------|-----------|
| FRONT_URL             | URL of the frontend for redirect_uri and [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) access                | YES       |
| SPOTIFY_CLIENT_ID     | `client_id` of your [Spotify app](https://developer.spotify.com/dashboard/)                                                   | YES       |
| SPOTIFY_CLIENT_SECRET | `client_secret` of your [Spotify app](https://developer.spotify.com/dashboard/)                                               | YES       |
| LISTEN_IP             | Network IP to listen to. Set `::1` for all IPv6 (+ all IPv4 if your OS has dual-stack mode). Defaults to `0.0.0.0` (all IPv4) | no        |
| LISTEN_PORT           | Network port to listen to. Defaults to `3001`                                                                                 | no        |
| ENABLE_GOOGLE         | Enable Google lyrics fetching as a fallback. Defaults to `false`                                                              | no        |
| TRUST_PROXY           | Trust `X-Forwarded-For` headers. Turn it on if you're deploying Spotly behind a reverse proxy. Defaults to `false`            | no        |

Note: `ENABLE_GOOGLE` is not recommended on shared instances as Google easily
detects scraping and blocks the server's IP (or at least asks a human to solve a
CAPTCHA).

## Running locally

### Standard way

- Make sure you're using NodeJS v20, or run `nvm use`
- Run `npm install`
- Put the required environment variables in `.env`, in the format `NAME=VALUE`
  An example is available in `.env.dev`.
- Run `npm start`

The server auto-reloads on code changes.

### Docker way

- Run `docker build . -t spotly-api`
- Put the required environment variables in `.env`, in the format `NAME=VALUE`.
  An example is available in `.env.dev`.
- Run `docker run --env-file=.env -p 3001:3001 spotly-api`. If you changed the
  `LISTEN_PORT`, change the `-p` parameter accordingly

Please note that auto-reload is disabled with Docker.

## Help! What are `client_id` and `client_secret`?

The Spotify API uses [OAuth2](https://oauth.net/2/) as an authentication
mechanism. To access the Spotify API (and run Spotly) you need to register an
"app" on [the Spotify developer
portal](https://developer.spotify.com/dashboard/). The https://spotly.fi
instance uses my own credentials, but I don't share them with anyone as the API
is rate limited.

Creating a Spotify developer app only takes a few seconds, no verification is
required on Spotify's side. Make sure to add your front URL followed by
`/callback` to the list of your Authorized URLs.
