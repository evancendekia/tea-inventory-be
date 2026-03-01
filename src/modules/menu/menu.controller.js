const service = require('./menu.service')

const create = async (req, res) => {
  const menu = await service.create(req.body)
  res.json(menu)
}

const findAll = async (req, res) => {
  const includeInactive = req.query.includeInactive === 'true'
  const menus = await service.findAll(includeInactive)
  res.json(menus)
}

const findById = async (req, res) => {
  const menu = await service.findById(req.params.id)
  res.json(menu)
}

const update = async (req, res) => {
  const menu = await service.update(req.params.id, req.body)
  res.json(menu)
}

const updatePrice = async (req, res) => {
  const result = await service.updatePrice(req.params.id, req.body.price)
  res.json(result)
}

const deactivate = async (req, res) => {
  const result = await service.deactivate(req.params.id)
  res.json(result)
}

const reactivate = async (req, res) => {
  const result = await service.reactivate(req.params.id)
  res.json(result)
}

module.exports = {
  create,
  findAll,
  findById,
  update,
  updatePrice,
  deactivate,
  reactivate
}