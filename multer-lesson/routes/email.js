const express = require('express')
const { sendWelcomeEmail, resetEmail } = require('../controllers/email')
const router = express.Router()

router.post('/send', sendWelcomeEmail)
router.post('/reset', resetEmail)

module.exports = router