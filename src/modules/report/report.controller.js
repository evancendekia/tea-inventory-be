const service = require('./report.service')

const submit = async (req, res) => {
  const result = await service.submitReport(req.body)
  res.json(result)
}

const findAll = async (req, res) => {
  const result = await service.findAll(req.query)
  res.json(result)
}

const findById = async (req, res) => {
  const result = await service.findById(req.params.id)
  res.json(result)
}

module.exports = {
  submit,
  findAll,
  findById
}