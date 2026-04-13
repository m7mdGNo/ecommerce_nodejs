require('dotenv').config()

const app = require('./app')
const connectDB = require('./config/db')
const logger = require('./config/logger')
require('./workers/email.worker')

const PORT = process.env.PORT || 3000

// Connect to MongoDB then start server
connectDB().then(() => {
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`)
  })
})