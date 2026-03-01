const express = require('express')
const router = express.Router()
const controller = require('./inventory.controller')
const authMiddleware = require('../../middlewares/auth.middleware')
const roleMiddleware = require('../../middlewares/role.middleware')

router.use(authMiddleware)

router.post( '/', roleMiddleware('master_admin', 'owner'), controller.create )
router.get( '/', roleMiddleware('master_admin', 'owner', 'inventory_officer'), controller.findAll )
router.get( '/:id', roleMiddleware('master_admin', 'owner', 'inventory_officer'), controller.findById )
router.patch( '/:id/add', roleMiddleware('master_admin', 'owner'), controller.addStock )
router.patch( '/:id/deduct', roleMiddleware('master_admin', 'owner'), controller.deductStock )
router.patch( '/:id/adjust', roleMiddleware('master_admin', 'owner'), controller.adjustStock )
router.patch( '/:id/deactivate', roleMiddleware('master_admin', 'owner'), controller.deactivate )
router.patch( '/:id/reactivate', roleMiddleware('master_admin', 'owner'), controller.reactivate )

module.exports = router