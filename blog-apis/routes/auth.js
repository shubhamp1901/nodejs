const express = require('express')
const { RegisterUser, LoginUser, logoutUser, resetPassword, requestPasswordReset } = require('../controllers/auth')
const router = express.Router()

router.post('/register', RegisterUser)
router.post('/login', LoginUser)
router.post('/logout', logoutUser)
router.post('/reset-password', resetPassword)
router.post('/request-reset-password', requestPasswordReset)

module.exports = router