const express = require('express')
const router = express.Router()
const csvRoutes = require('./routes/requestRoutes')
router.use('/csv', csvRoutes)
module.exports = router