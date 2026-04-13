const { Queue } = require('bullmq')
const IORedis = require('ioredis')
const env = require('../config/env')

const connection = new IORedis(env.redisUri, {
  maxRetriesPerRequest: null,
})

const emailQueue = new Queue('email-queue', { connection })

module.exports = emailQueue
