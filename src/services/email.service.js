const nodemailer = require('nodemailer')
const env = require('../config/env')
const logger = require('../config/logger')

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.email.host,
      port: env.email.port,
      secure: Number(env.email.port) === 465, // true for port 465, false for 587
      requireTLS: env.email.secure, // Ensure STARTTLS is used if secure is true
      auth: {
        user: env.email.user,
        pass: env.email.pass,
      },
    })
  }

  async sendWelcomeEmail(to, name) {
    try {
      const mailOptions = {
        from: env.email.defaultFrom,
        to,
        subject: 'Welcome to Our Application!',
        text: `Hello ${name},\n\nWelcome to our platform. We are glad to have you!\n\nBest Regards,\nThe Team`,
        html: `<h3>Hello ${name},</h3><p>Welcome to our platform. We are glad to have you!</p><br/><p>Best Regards,<br/>The Team</p>`,
      }

      const info = await this.transporter.sendMail(mailOptions)
      logger.info(`Message sent: ${info.messageId}`)
      return info
    } catch (error) {
      logger.error(`Error sending email: ${error.message}`)
      throw error
    }
  }
}

module.exports = new EmailService()
