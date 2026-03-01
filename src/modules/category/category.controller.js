const service = require('./category.service')

const create = async (req, res) => {
  const category = await service.create(req.body.name)
  res.json(category)
}

const findAll = async (req, res) => {
  const categories = await service.findAll()
  res.json(categories)
}

module.exports = { create, findAll }