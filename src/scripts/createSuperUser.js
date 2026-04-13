require('dotenv').config()

const mongoose = require('mongoose')
const User = require('../modules/users/user.model')

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/nodejs_app'

const args = process.argv.slice(2)

if (args.length < 3) {
  console.log('Usage: node src/scripts/createSuperUser.js <name> <email> <password>')
  console.log('Example: node src/scripts/createSuperUser.js "Admin" "admin@example.com" "123456"')
  process.exit(1)
}

const [name, email, password] = args

const createSuperUser = async () => {
  try {
    await mongoose.connect(MONGO_URI)
    console.log('Connected to MongoDB')

    const existing = await User.findOne({ email })
    if (existing) {
      console.log(`User with email "${email}" already exists.`)
      process.exit(1)
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'admin',
    })

    console.log('Superuser created successfully!')
    console.log(`  Name:  ${user.name}`)
    console.log(`  Email: ${user.email}`)
    console.log(`  Role:  ${user.role}`)
  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await mongoose.disconnect()
    process.exit(0)
  }
}

createSuperUser()
