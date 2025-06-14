const express = require('express')
const { getAllContacts, createContact, getContact, updateContact, deleteContact } = require('../controllers/contacts')
const validateToken = require('../middleware/validateToken')
const router = express.Router()

router.use(validateToken)
router.get('/', getAllContacts)
router.post('/', createContact)
router.get('/:id', getContact)
router.patch('/:id', updateContact)
router.delete('/:id', deleteContact)

module.exports = router