const prisma = require('../../utils/prisma')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const login = async (email, password) => {
  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user || !user.isActive) {
    throw new Error('Invalid credentials')
  }

  const match = await bcrypt.compare(password, user.password)
  if (!match) {
    throw new Error('Invalid credentials')
  }

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
      name: user.name
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  )

  return { accessToken: token }
}

module.exports = { login }