const service = require('./inventory.service')

const create = async (req, res) => {
  const result = await service.create(req.body)
  res.json(result)
}

const findAll = async (req, res) => {
  const includeInactive = req.query.includeInactive === 'true'
  const result = await service.findAll(includeInactive)
  res.json(result)
}

const findById = async (req, res) => {
  const result = await service.findById(req.params.id)
  res.json(result)
}

const addStock = async (req, res) => {
  const result = await service.addStock(
    req.params.id,
    req.body.quantity,
    req.body.note
  )
  res.json(result)
}

const deductStock = async (req, res) => {
  const result = await service.deductStock(
    req.params.id,
    req.body.quantity,
    req.body.note
  )
  res.json(result)
}

const adjustStock = async (req, res) => {
  const result = await service.adjustStock(
    req.params.id,
    req.body.newStock,
    req.body.note
  )
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
  addStock,
  deductStock,
  adjustStock,
  deactivate,
  reactivate
}