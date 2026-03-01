const prisma = require('../../utils/prisma')
const { Prisma } = require('@prisma/client')

const submitReport = async (data) => {
  return prisma.$transaction(async (tx) => {

    const branch = await tx.branch.findUnique({
      where: { id: data.branchId }
    })
    if (!branch) throw new Error('Invalid branch')

    const employee = await tx.boothEmployee.findUnique({
      where: { id: data.boothEmployeeId }
    })
    if (!employee) throw new Error('Invalid booth employee')

    let totalRevenue = 0
    let totalExpense = 0

    // 1️ Create report header first (temporary values)
    const report = await tx.shiftReport.create({
      data: {
        date: new Date(data.date),
        shiftNumber: data.shiftNumber,
        branchId: data.branchId,
        boothEmployeeId: data.boothEmployeeId,
        initialCash: data.initialCash,
        totalRevenue: 0,
        totalExpense: 0,
        expectedCash: 0,
        actualCash: data.actualCash,
        variance: 0
      }
    })

    // 2️ Handle menus (Revenue + Powder deduction)
    for (const m of data.menus) {

      const menu = await tx.menu.findUnique({
        where: { id: m.menuId },
        include: {
          prices: {
            where: { endDate: null }
          }
        }
      })

      if (!menu) throw new Error('Invalid menu')

      const price = Number(menu.prices[0].price)
      const sold = m.initialAmount - m.finalAmount
      console.log(typeof m.initialAmount, typeof m.finalAmount)
      const subtotal = sold * price

      totalRevenue += subtotal

      await tx.shiftReportMenu.create({
        data: {
          shiftReportId: report.id,
          menuId: m.menuId,
          initialAmount: m.initialAmount,
          finalAmount: m.finalAmount,
          soldQuantity: sold,
          priceSnapshot: price,
          subtotal
        }
      })

      // Deduct powder inventory
      const inventoryId = menu.inventoryItemId

      const inventory = await tx.inventoryItem.findUnique({
        where: { id: inventoryId }
      })

      if (inventory.stock < sold) {
        throw new Error('Insufficient stock for powder')
      }

      await tx.inventoryItem.update({
        where: { id: inventoryId },
        data: {
          stock: inventory.stock - sold
        }
      })

      await tx.inventoryMovement.create({
        data: {
          inventoryItemId: inventoryId,
          type: 'SHIFT_SALE',
          quantity: sold,
          referenceId: report.id,
          note: 'Menu sale'
        }
      })
    }

    // 3️ Handle inventory reconciliation
    for (const inv of data.inventories) {

      const delta = inv.finalAmount - inv.initialAmount

      await tx.shiftReportInventory.create({
        data: {
          shiftReportId: report.id,
          inventoryItemId: inv.inventoryItemId,
          initialAmount: inv.initialAmount,
          finalAmount: inv.finalAmount
        }
      })

      const inventory = await tx.inventoryItem.findUnique({
        where: { id: inv.inventoryItemId }
      })

      if (delta < 0) {
        const deductAmount = Math.abs(delta)

        if (inventory.stock < deductAmount) {
          throw new Error('Insufficient stock')
        }

        await tx.inventoryItem.update({
          where: { id: inv.inventoryItemId },
          data: {
            stock: inventory.stock - deductAmount
          }
        })

        await tx.inventoryMovement.create({
          data: {
            inventoryItemId: inv.inventoryItemId,
            type: 'SHIFT_USAGE',
            quantity: deductAmount,
            referenceId: report.id
          }
        })
      }

      if (delta > 0) {
        await tx.inventoryItem.update({
          where: { id: inv.inventoryItemId },
          data: {
            stock: inventory.stock + delta
          }
        })

        await tx.inventoryMovement.create({
          data: {
            inventoryItemId: inv.inventoryItemId,
            type: 'SHIFT_PURCHASE',
            quantity: delta,
            referenceId: report.id
          }
        })
      }
    }

    // 4️ Handle expenses
    for (const exp of data.expenses) {
      totalExpense += Number(exp.amount)

      await tx.shiftReportExpense.create({
        data: {
          shiftReportId: report.id,
          description: exp.description,
          amount: exp.amount
        }
      })
    }

    const expectedCash =
      Number(data.initialCash) + totalRevenue - totalExpense

    const variance =
      Number(data.actualCash) - expectedCash

    console.log({
        totalRevenue,
        totalExpense,
        expectedCash,
        variance
    })
    // 5️ Update report totals
    await tx.shiftReport.update({
        where: { id: report.id },
        data: {
            totalRevenue: new Prisma.Decimal(totalRevenue),
            totalExpense: new Prisma.Decimal(totalExpense),
            expectedCash: new Prisma.Decimal(expectedCash),
            variance: new Prisma.Decimal(variance)
        }
    })

    const finalReport = await tx.shiftReport.findUnique({
        where: { id: report.id },
        include: {
            branch: true,
            boothEmployee: true
        }
    })

    return finalReport
  })
}

const findAll = (query) => {
  const where = {}

  if (query.branchId) {
    where.branchId = Number(query.branchId)
  }

  if (query.date) {
    const start = new Date(query.date)
    const end = new Date(query.date)
    end.setHours(23, 59, 59, 999)

    where.date = {
      gte: start,
      lte: end
    }
  }

  if (query.shiftNumber) {
    where.shiftNumber = Number(query.shiftNumber)
  }

  return prisma.shiftReport.findMany({
    where,
    include: {
      branch: true,
      boothEmployee: true
    },
    orderBy: {
      date: 'desc' // ✅ ORDER BY REPORT DATE
    }
  })
}

const findById = (id) => {
  return prisma.shiftReport.findUnique({
    where: { id: Number(id) },
    include: {
      branch: true,
      boothEmployee: true,
      menuItems: true,
      inventoryItems: true,
      expenses: true
    }
  })
}

module.exports = {
  submitReport,
  findAll,
  findById
}