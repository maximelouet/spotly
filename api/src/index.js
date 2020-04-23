/* eslint-disable no-unused-vars */
import Fastify from 'fastify';
import cors from 'cors';
import Spot from './spot';

const fastify = new Fastify({
  logger: true,
});

fastify.use(cors({
  origin: process.env.FRONT_URL,
}));

fastify.get('/', async (request, reply) => {
  return { hello: 'world' };
});

fastify.get('/getAuthorizeUrl', async (request, reply) => Spot.getAuthorizeUrl());

fastify.post('/exchangeCode', async (request, reply) => Spot.exchangeCode(request.body.code));

fastify.post('/getPlaybackState', async (request, reply) => Spot.getPlaybackState(request.body.accessToken));

fastify.post('/getPlaybackLyrics', async (request, reply) => Spot.getSongLyrics(request.body.accessToken));

fastify.setNotFoundHandler(async (request, reply) => {
  return {
    error: 'NOT_FOUND',
    message: 'API route not found',
  };
});

const start = async () => {
  try {
    await fastify.listen(3001);
    fastify.log.info(`server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
