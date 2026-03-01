require('dotenv').config()
const express = require('express')
const cors = require('cors')
const errorHandler = require('./src/middlewares/error.middleware')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', require('./src/modules/auth/auth.routes'))
app.use('/api/booth-employees', require('./src/modules/boothEmployee/boothEmployee.routes'))
app.use('/api/categories', require('./src/modules/category/category.routes'))
app.use('/api/menus', require('./src/modules/menu/menu.routes'))
app.use('/api/inventory', require('./src/modules/inventory/inventory.routes'))
app.use('/api/branches', require('./src/modules/branch/branch.routes'))
app.use('/api/reports', require('./src/modules/Report/report.routes'))


app.use(errorHandler)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})