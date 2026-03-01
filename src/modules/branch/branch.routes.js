const express = require('express')
const router = express.Router()
const controller = require('./branch.controller')
const authMiddleware = require('../../middlewares/auth.middleware')
const roleMiddleware = require('../../middlewares/role.middleware')

router.use(authMiddleware)

router.post(
  '/',
  roleMiddleware('master_admin', 'owner'),
  controller.create
)

router.get(
  '/',
  roleMiddleware('master_admin', 'owner', 'inventory_officer'),
  controller.findAll
)

router.get(
  '/:id',
  roleMiddleware('master_admin', 'owner', 'inventory_officer'),
  controller.findById
)

router.put(
  '/:id',
  roleMiddleware('master_admin', 'owner'),
  controller.update
)

router.patch(
  '/:id/deactivate',
  roleMiddleware('master_admin', 'owner'),
  controller.deactivate
)

router.patch(
  '/:id/reactivate',
  roleMiddleware('master_admin', 'owner'),
  controller.reactivate
)

module.exports = router