const { Prisma } = require('@prisma/client')

const errorHandler = (err, req, res, next) => {
  console.error(err)

  // Prisma unique constraint error
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
        // Specific duplicate for shift report
        if (err.meta?.target?.includes('ShiftReport_date_shiftNumber_branchId_key')) {
            return res.status(400).json({
            success: false,
            message: 'Shift report already submitted for this branch and shift'
            })
        }

        return res.status(400).json({
            success: false,
            message: 'Duplicate data detected'
        })
    }
  }

  // Custom thrown error
  return res.status(400).json({
    success: false,
    message: err.message || 'Something went wrong'
  })
}

module.exports = errorHandler