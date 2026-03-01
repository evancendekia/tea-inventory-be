const prisma = require('../../utils/prisma')

const create = (name) => {
  return prisma.category.create({
    data: { name }
  })
}

const findAll = () => {
  return prisma.category.findMany({
    include: {
      menus: true
    }
  })
}

module.exports = { create, findAll }