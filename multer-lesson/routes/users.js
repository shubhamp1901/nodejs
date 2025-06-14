const express = require('express')
const { getAllUsers, createUser } = require('../controllers/users')
const upload = require('../middlewares/image-upload')
const uploadMultiple = require('../middlewares/upload-mulitple')

const router = express.Router()

router.get('/', getAllUsers)
router.post('/', upload.array('images'), uploadMultiple, createUser);

module.exports = router