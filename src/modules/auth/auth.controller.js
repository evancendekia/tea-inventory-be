const service = require('./auth.service')

const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const result = await service.login(email, password)
    res.json(result)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

module.exports = { login }