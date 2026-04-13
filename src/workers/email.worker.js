const { Worker } = require('bullmq')
const IORedis = require('ioredis')
const env = require('../config/env')
const logger = require('../config/logger')
const emailService = require('../services/email.service')

const connection = new IORedis(env.redisUri, {
  maxRetriesPerRequest: null,
})

const emailWorker = new Worker(
  'email-queue',
  async (job) => {
    logger.info(`Processing job ${job.id} of type ${job.name}`)

    if (job.name === 'welcome-email') {
      const { to, name } = job.data
      await emailService.sendWelcomeEmail(to, name)
    }
  },
  { connection }
)

emailWorker.on('completed', (job) => {
  logger.info(`Job ${job.id} completed successfully`)
})

emailWorker.on('failed', (job, err) => {
  logger.error(`Job ${job.id} failed with error ${err.message}`)
})

module.exports = emailWorker
