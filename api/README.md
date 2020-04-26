# Spot API

The API uses [fastify](https://www.fastify.io/) as a Web server framework.

## Environment variables

| Environment variable  | Description                                                                     | Mandatory |
|-----------------------|---------------------------------------------------------------------------------|-----------|
| FRONT_URL             | URL of the frontend for redirect_uri and CORS access                            | YES       |
| SPOTIFY_CLIENT_ID     | `client_id` of your [Spotify app](https://developer.spotify.com/dashboard/)     | YES       |
| SPOTIFY_CLIENT_SECRET | `client_secret` of your [Spotify app](https://developer.spotify.com/dashboard/) | YES       |

## Running locally

### Standard way

- Make sure you're using NodeJS v12, or run `nvm use`
- Run `npm install`
- Put the required environment variables in `.env`, in the format `NAME=VALUE`
- Run `npm start`

The server auto-reloads on code changes.

### Docker way

- Run `docker build . -t spot-api`
- Put the required environment variables in `.env`, in the format `NAME=VALUE`
- Run `docker run --env-file=.env -p 3001:3001 spot-api`

Please note that auto-reload is disabled with Docker.
