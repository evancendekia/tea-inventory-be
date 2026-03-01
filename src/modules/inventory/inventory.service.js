const prisma = require('../../utils/prisma')

const create = async (data) => {
  return prisma.inventoryItem.create({
    data: {
      name: data.name,
      purchasePrice: data.purchasePrice,
      stock: data.stock || 0
    }
  })
}

const findAll = (includeInactive = false) => {
  return prisma.inventoryItem.findMany({
    where: includeInactive ? {} : { isActive: true }
  })
}

const findById = (id) => {
  return prisma.inventoryItem.findUnique({
    where: { id: Number(id) },
    include: {
      movements: {
        orderBy: { createdAt: 'desc' }
      }
    }
  })
}

const addStock = async (id, quantity, note) => {
  return prisma.$transaction(async (tx) => {
    const item = await tx.inventoryItem.findUnique({
      where: { id: Number(id) }
    })

    const updated = await tx.inventoryItem.update({
      where: { id: Number(id) },
      data: {
        stock: item.stock + quantity
      }
    })

    await tx.inventoryMovement.create({
      data: {
        inventoryItemId: Number(id),
        type: 'ADD',
        quantity,
        note
      }
    })

    return updated
  })
}

const deductStock = async (id, quantity, note) => {
  return prisma.$transaction(async (tx) => {
    const item = await tx.inventoryItem.findUnique({
      where: { id: Number(id) }
    })

    if (item.stock < quantity) {
      throw new Error('Insufficient stock')
    }

    const updated = await tx.inventoryItem.update({
      where: { id: Number(id) },
      data: {
        stock: item.stock - quantity
      }
    })

    await tx.inventoryMovement.create({
      data: {
        inventoryItemId: Number(id),
        type: 'DEDUCT',
        quantity,
        note
      }
    })

    return updated
  })
}

const adjustStock = async (id, newStock, note) => {
  return prisma.$transaction(async (tx) => {
    const item = await tx.inventoryItem.findUnique({
      where: { id: Number(id) }
    })

    const difference = newStock - item.stock

    const updated = await tx.inventoryItem.update({
      where: { id: Number(id) },
      data: {
        stock: newStock
      }
    })

    await tx.inventoryMovement.create({
      data: {
        inventoryItemId: Number(id),
        type: 'ADJUST',
        quantity: difference,
        note
      }
    })

    return updated
  })
}

const deactivate = (id) => {
  return prisma.inventoryItem.update({
    where: { id: Number(id) },
    data: { isActive: false }
  })
}

const reactivate = (id) => {
  return prisma.inventoryItem.update({
    where: { id: Number(id) },
    data: { isActive: true }
  })
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