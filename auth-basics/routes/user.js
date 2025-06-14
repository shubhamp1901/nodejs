const express = require('express')
const verifyToken = require('../middleware/auth')
const authorizeRoles = require('../middleware/role')
const router = express.Router()

// only admin can access
router.get("/admin", verifyToken, authorizeRoles("admin"), (req, res) => {
    res.json({message: "Welcome admin"})
})

// only admin and manager can access
router.get("/manager", verifyToken, authorizeRoles("admin", "manager"), (req, res) => {
    res.json({message: "Welcome manager"})
})

// everyone can access
router.get("/user", verifyToken, authorizeRoles("admin", "manager", "user"), (req, res) => {
    res.json({message: "Welcome user"})
})

module.exports = router