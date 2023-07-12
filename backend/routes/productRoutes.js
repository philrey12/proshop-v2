import express from 'express'
import { getProducts, getProductById, addNewProduct, updateProduct } from '../controllers/productController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/').get(getProducts).post(protect, admin, addNewProduct)
router.route('/:id').get(getProductById).put(protect, admin, updateProduct)

export default router