import redis from 'redis';

const { promisify } = require('util');

const client = redis.createClient();

client.on('connect', () => {
  console.log('sucessfully connect to redis');
  next()
});

client.on('error', (err) => {
  console.log('error while connecting to redis');
  console.log(err.message);
});

client.on('end', () => {
  console.log('redis client connection disconnected');
});

process.on('SIGINT', () => {
  client.quit();
});

const GET_ASYNC = promisify(client.get).bind(client);
const SET_ASYNC = promisify(client.set).bind(client);
const DEL_ASYNC = promisify(client.del).bind(client);

const cache = {
  GET_ASYNC,
  SET_ASYNC,
  DEL_ASYNC,
  client,
};

module.exports = cache;