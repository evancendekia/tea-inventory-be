const express = require('express')
const router = express.Router()
const controller = require('./category.controller')
const authMiddleware = require('../../middlewares/auth.middleware')
const roleMiddleware = require('../../middlewares/role.middleware')

router.use(authMiddleware)

router.get( '/', roleMiddleware('master_admin', 'owner', 'inventory_officer'), controller.findAll )
router.post( '/', roleMiddleware('master_admin', 'owner'), controller.create )

module.exports = router