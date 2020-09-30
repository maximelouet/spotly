# Spotly front

The frontend uses [React](https://reactjs.org/).

## Environment variables

| Environment variable | Description                       | Mandatory |
|----------------------|-----------------------------------|-----------|
| API_URL              | URL of the API                    | YES       |
| VERSION              | Spotly version for footer display | no        |

## Running locally

These examples assume that the API is started on port 3001. You can change this
by setting the `API_URL` environment variable, whose default value is
`http://localhost:3001`, in the `.env` file.

### Standard way

- Make sure you're using NodeJS v14, or run `nvm use`
- Run `npm install`
- Set values in `.env` or copy the default configuration: `cp .env.dev .env`
- Run `npm start`
- The frontend is accessible on port 3000

The frontend auto-reloads on code changes.

### Docker way

- Run `docker build . -t spotly-front`
- Run `docker run -p 3000:3000 spotly-front`
- The frontend is accessible on port 3000

You can configure the frontend's environment variables like this:

`docker run -e API_URL=http://localhost:3001 spotly-front`

Please note that auto-reload is disabled with Docker.
