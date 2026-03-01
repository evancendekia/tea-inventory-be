const prisma = require('../../utils/prisma')

const create = (name) => {
  return prisma.boothEmployee.create({
    data: { name }
  })
}

const findAll = (includeInactive = false) => {
  return prisma.boothEmployee.findMany({
    where: includeInactive ? {} : { isActive: true }
  })
}

const findById = (id) => {
  return prisma.boothEmployee.findUnique({
    where: { id: Number(id) }
  })
}

const update = (id, name) => {
  return prisma.boothEmployee.update({
    where: { id: Number(id) },
    data: { name }
  })
}

const deactivate = (id) => {
  return prisma.boothEmployee.update({
    where: { id: Number(id) },
    data: { isActive: false }
  })
}

const reactivate = (id) => {
  return prisma.boothEmployee.update({
    where: { id: Number(id) },
    data: { isActive: true }
  })
}

module.exports = {
  create,
  findAll,
  findById,
  update,
  deactivate,
  reactivate
}