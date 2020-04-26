# Spot front

The frontend uses [React](https://reactjs.org/).

## Environment variables

| Environment variable | Description    | Mandatory |
|----------------------|----------------|-----------|
| REACT_APP_API_URL    | URL of the API | YES       |

## Running locally

These examples use `http://localhost:3001` as the API URL.

### Standard way

- Make sure you're using NodeJS v12, or run `nvm use`
- Run `npm install`
- Provide the `REACT_APP_API_URL` environment variable to `npm start`, such as:
  `REACT_APP_API_URL=http://localhost:3001 npm start`

The frontend auto-reloads on code changes.

### Docker way

- Run `docker build . --build-arg REACT_APP_API_URL=http://localhost:3001 -t
  spot-api`
- Run `docker run -p 3001:3001 spot-api`

Please note that auto-reload is disabled with Docker.
