const express = require('express')
const { getAllProducts, createProduct, getProduct, updateProduct, deleteProduct, filterProducts, getAllProductsFilter } = require('../controllers/products')
const router = express.Router()


router.route('/filter').get(filterProducts)
router.route('/query').get(getAllProductsFilter)
router.route('/').get(getAllProducts)
router.route('/').post(createProduct)
router.route('/:id').get(getProduct)
router.route('/:id').patch(updateProduct)
router.route('/:id').delete(deleteProduct)




module.exports = router