# Spotly API

The API uses [fastify](https://www.fastify.io/) as a Web server framework.

## Environment variables

| Environment variable  | Description                                                                     | Mandatory |
|-----------------------|---------------------------------------------------------------------------------|-----------|
| FRONT_URL             | URL of the frontend for redirect_uri and CORS access                            | YES       |
| SPOTIFY_CLIENT_ID     | `client_id` of your [Spotify app](https://developer.spotify.com/dashboard/)     | YES       |
| SPOTIFY_CLIENT_SECRET | `client_secret` of your [Spotify app](https://developer.spotify.com/dashboard/) | YES       |
| PORT                  | Fastify listen port. Defaults to 3001                                           | no        |

## Running locally

### Standard way

- Make sure you're using NodeJS v12, or run `nvm use`
- Run `npm install`
- Put the required environment variables in `.env`, in the format `NAME=VALUE`
- Run `npm start`

The server auto-reloads on code changes.

### Docker way

- Run `docker build . -t spotly-api`
- Put the required environment variables in `.env`, in the format `NAME=VALUE`
- Run `docker run --env-file=.env -p 3001:3001 spotly-api`. If you changed the `PORT`, change the `-p` parameter accordingly

Please note that auto-reload is disabled with Docker.

## Help! What are `client_id` and `client_secret`?

The Spotify API uses [OAuth2](https://oauth.net/2/) as an authentication
mechanism. To access the Spotify API (and run Spotly) you need to register an
"app" on [the Spotify developer
portal](https://developer.spotify.com/dashboard/). The https://spotly.fi
instance uses my own credentials, but I don't share them with anyone as the API
is rate limited.

Creating a Spotify developer app takes only a few minutes, no verification is
needed on Spotify's side. Make sure to add the URL of your front + `/callback`
to the list of your Authorized URLs.
