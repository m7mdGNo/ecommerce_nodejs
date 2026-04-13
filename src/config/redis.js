const IORedis = require('ioredis')
const env = require('./env')
const logger = require('./logger')

const redisClient = new IORedis(env.redisUri, {
  maxRetriesPerRequest: null,
})

redisClient.on('error', (err) => {
  logger.error('Redis connection error', err)
})

redisClient.on('connect', () => {
  logger.info('Connected to Redis successfully')
})

module.exports = redisClient
