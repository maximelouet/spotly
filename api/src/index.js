/* eslint-disable no-unused-vars */
const Fastify = require('fastify');
const cors = require('cors');
const fastifyRateLimit = require('fastify-rate-limit');
const { exchangeCodeSchema, refreshTokenSchema, loggedInSchema } = require('./validation');
const Spotly = require('./Spotly');

const trustProxy = process.env.TRUST_PROXY && (process.env.TRUST_PROXY === 'true' || process.env.TRUST_PROXY === '1');

const fastify = new Fastify({
  logger: true,
  trustProxy,
});

const requiredEnvironmentVariables = [
  'FRONT_URL',
  'SPOTIFY_CLIENT_ID',
  'SPOTIFY_CLIENT_SECRET',
];

requiredEnvironmentVariables.forEach((envVar) => {
  if (process.env[envVar] === undefined) throw new Error('Missing required environment variable');
});

fastify.use(cors({
  origin: process.env.FRONT_URL,
}));

fastify.register(fastifyRateLimit, {
  max: 8,
  timeWindow: 3000,
  keyGenerator: (req) => (req.body?.accessToken)
      || req.headers['x-real-ip']
      || req.raw.ip
  ,
});

fastify.get('/getAuthorizeUrl', async (req, reply) => Spotly.getAuthorizeUrl());

fastify.post('/exchangeCode', {
  schema: exchangeCodeSchema,
}, async (req, reply) => Spotly.exchangeCode(req.body.code));

fastify.post('/refreshToken', {
  schema: refreshTokenSchema,
}, async (req, reply) => Spotly.refreshToken(req.body.refreshToken));

fastify.post('/getPlaybackState', {
  schema: loggedInSchema,
}, async (req, reply) => Spotly.getPlaybackState(req.body.accessToken));

fastify.post('/getPlaybackLyrics', {
  schema: loggedInSchema,
}, async (req, reply) => Spotly.getPlaybackLyrics(req.body.accessToken, req.headers, req.log));

fastify.setNotFoundHandler(async (request, reply) => ({
  error: 'NOT_FOUND',
  message: 'API route not found',
}));

const start = async () => {
  try {
    await fastify.listen(process.env.PORT ?? 3001, '0.0.0.0');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
