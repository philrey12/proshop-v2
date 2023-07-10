import express from 'express'
import { getProducts, getProductById, addNewProduct } from '../controllers/productController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/').get(getProducts).post(protect, admin, addNewProduct)
router.route('/:id').get(getProductById)

export default router