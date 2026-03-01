const service = require('./branch.service')

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

const update = async (req, res) => {
  const result = await service.update(req.params.id, req.body)
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
  deactivate,
  reactivate
}