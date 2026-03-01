const service = require('./boothEmployee.service')

const create = async (req, res) => {
  const employee = await service.create(req.body.name)
  res.json(employee)
}

const findAll = async (req, res) => {
  const includeInactive = req.query.includeInactive === 'true'
  const list = await service.findAll(includeInactive)
  res.json(list)
}

const findById = async (req, res) => {
  const employee = await service.findById(req.params.id)
  res.json(employee)
}

const update = async (req, res) => {
  const employee = await service.update(req.params.id, req.body.name)
  res.json(employee)
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