const express = require('express')
const { registerClient, loginClient, currentClient } = require('../controllers/clients')
const validateToken = require('../middleware/validateToken')
const router = express.Router()

router.post('/register', registerClient)
router.post('/login', loginClient)
router.get('/current', validateToken, currentClient)


module.exports = router