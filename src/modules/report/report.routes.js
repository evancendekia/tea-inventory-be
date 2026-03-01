const express = require('express')
const router = express.Router()
const controller = require('./report.controller')
const authMiddleware = require('../../middlewares/auth.middleware')
const roleMiddleware = require('../../middlewares/role.middleware')

router.use(authMiddleware)

router.post(
  '/',
  roleMiddleware('master_admin', 'owner', 'inventory_officer'),
  controller.submit
)

router.get(
  '/',
  roleMiddleware('master_admin', 'owner'),
  controller.findAll
)

router.get(
  '/:id',
  roleMiddleware('master_admin', 'owner'),
  controller.findById
)

module.exports = router