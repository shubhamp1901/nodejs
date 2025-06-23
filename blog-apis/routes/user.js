const express = require('express')
const { allUsers, getUser, updateUser, deleteUser } = require('../controllers/user')
const verifyToken = require('../middlewares/verifyToken');
const roleAccess = require('../middlewares/roleAccess');
const router = express.Router()


router.get("/", verifyToken, (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admins only" });
  }
  next();
}, allUsers);
router.get('/:id', verifyToken, roleAccess, getUser)
router.patch('/:id', verifyToken, roleAccess, updateUser)
router.delete('/:id', verifyToken, roleAccess, deleteUser)

module.exports = router



