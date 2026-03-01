const express = require('express')
const router = express.Router()
const controller = require('./menu.controller')
const authMiddleware = require('../../middlewares/auth.middleware')
const roleMiddleware = require('../../middlewares/role.middleware')

router.use(authMiddleware)

router.get( '/', roleMiddleware('master_admin', 'owner', 'inventory_officer'), controller.findAll )
router.get( '/:id', roleMiddleware('master_admin', 'owner', 'inventory_officer'), controller.findById )
router.post( '/', roleMiddleware('master_admin', 'owner'), controller.create )
router.put( '/:id', roleMiddleware('master_admin', 'owner'), controller.update )
router.patch( '/:id/price', roleMiddleware('master_admin', 'owner'), controller.updatePrice )
router.patch( '/:id/deactivate', roleMiddleware('master_admin', 'owner'), controller.deactivate )
router.patch( '/:id/reactivate', roleMiddleware('master_admin', 'owner'), controller.reactivate )



module.exports = router