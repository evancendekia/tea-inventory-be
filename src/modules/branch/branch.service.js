const prisma = require('../../utils/prisma')

const create = (data) => {
  return prisma.branch.create({
    data: {
      name: data.name,
      address: data.address || null
    }
  })
}

const findAll = (includeInactive = false) => {
  return prisma.branch.findMany({
    where: includeInactive ? {} : { isActive: true },
    orderBy: { createdAt: 'desc' }
  })
}

const findById = (id) => {
  return prisma.branch.findUnique({
    where: { id: Number(id) }
  })
}

const update = (id, data) => {
  return prisma.branch.update({
    where: { id: Number(id) },
    data: {
      name: data.name,
      address: data.address
    }
  })
}

const deactivate = (id) => {
  return prisma.branch.update({
    where: { id: Number(id) },
    data: { isActive: false }
  })
}

const reactivate = (id) => {
  return prisma.branch.update({
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