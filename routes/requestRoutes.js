const router = require('express').Router()
const csvController = require('../controller/requestController')
const multer = require('multer')
const upload = multer()
router.post('/upload', upload.single('file') ,csvController.handleUpload)
router.get('/status/:id', csvController.fetchRequestStatus)
router.get('/download/:id', csvController.downloadCsv)
module.exports = router
