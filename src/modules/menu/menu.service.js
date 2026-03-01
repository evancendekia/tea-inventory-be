const prisma = require('../../utils/prisma')

const create = async (data) => {
  return prisma.$transaction(async (tx) => {

    const inventory = await tx.inventoryItem.findUnique({
      where: { id: data.inventoryItemId }
    })

    if (!inventory || !inventory.isActive) {
      throw new Error('Invalid inventory item')
    }

    const menu = await tx.menu.create({
      data: {
        name: data.name,
        categoryId: data.categoryId,
        inventoryItemId: data.inventoryItemId
      }
    })

    await tx.menuPrice.create({
      data: {
        menuId: menu.id,
        price: data.price
      }
    })

    return menu
  })
}

const findAll = async (includeInactive = false) => {
  return prisma.menu.findMany({
    where: includeInactive ? {} : { isActive: true },
    include: {
      category: true,
      inventoryItem: true,
      prices: {
        where: { endDate: null }
      }
    }
  })
}

const findById = async (id) => {
  return prisma.menu.findUnique({
    where: { id: Number(id) },
    include: {
      category: true,
      inventoryItem: true,
      prices: {
        where: { endDate: null }
      }
    }
  })
}

const update = async (id, data) => {
  return prisma.menu.update({
    where: { id: Number(id) },
    data: {
      name: data.name,
      categoryId: data.categoryId,
      inventoryItemId: data.inventoryItemId
    }
  })
}

const updatePrice = async (menuId, newPrice) => {
  return prisma.$transaction(async (tx) => {

    await tx.menuPrice.updateMany({
      where: {
        menuId: Number(menuId),
        endDate: null
      },
      data: {
        endDate: new Date()
      }
    })

    return tx.menuPrice.create({
      data: {
        menuId: Number(menuId),
        price: newPrice
      }
    })
  })
}

const deactivate = (id) => {
  return prisma.menu.update({
    where: { id: Number(id) },
    data: { isActive: false }
  })
}

const reactivate = (id) => {
  return prisma.menu.update({
    where: { id: Number(id) },
    data: { isActive: true }
  })
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