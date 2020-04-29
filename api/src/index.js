/* eslint-disable no-unused-vars */
import Fastify from 'fastify';
import cors from 'cors';
import Spotly from './Spotly';

const fastify = new Fastify({
  logger: true,
});

fastify.use(cors({
  origin: process.env.FRONT_URL,
}));

fastify.get('/getAuthorizeUrl', async (request, reply) => Spotly.getAuthorizeUrl());

fastify.post('/exchangeCode', async (request, reply) => Spotly.exchangeCode(request.body.code));

fastify.post('/refreshToken', async (request, reply) => Spotly.refreshToken(request.body.refreshToken));

fastify.post('/getPlaybackState', async (request, reply) => Spotly.getPlaybackState(request.body.accessToken));

fastify.post('/getPlaybackLyrics', async (request, reply) => Spotly.getPlaybackLyrics(request.body.accessToken, request.headers));

fastify.setNotFoundHandler(async (request, reply) => ({
  error: 'NOT_FOUND',
  message: 'API route not found',
}));

const start = async () => {
  try {
    await fastify.listen(process.env.PORT ? process.env.PORT : 3001, '0.0.0.0');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
