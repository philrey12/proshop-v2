import asyncHandler from '../middleware/asyncHandler.js'
import Product from '../models/productModel.js'

// @desc Get all products
// @route GET /api/products
// @access Public
const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({})
    res.json(products)
})

// @desc Get product by Id
// @route GET /api/products/:id
// @access Public
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)

    if (product) {
        return res.json(product)
    } else {
        res.status(404)
        throw new Error('Product not found')
    }
})

// @desc Add product
// @route POST /api/products
// @access Private/Admin
const addNewProduct = asyncHandler(async (req, res) => {
    const product = new Product({
        name: 'Product Name',
        description: 'Product Description',
        price: 0,
        user: req.user._id,
        image: '/images/sample.jpg',
        brand: 'Product Brand',
        category: 'Sample',
        countInStock: 0,
        numReviews: 0
    })
    const addedProduct = await product.save()

    res.status(201).json(addedProduct)
})

// @desc Update product
// @route POST /api/products/:id
// @access Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
    const {
        name,
        description,
        price,
        image,
        brand,
        category,
        countInStock
    } = req.body
    const product = await Product.findById(req.params.id)

    if (product) {
        product.name = name
        product.description = description
        product.price = price
        product.image = image
        product.brand = brand
        product.category = category
        product.countInStock = countInStock

        const updatedProduct = await product.save()

        res.json(updatedProduct)
    } else {
        res.status(404)
        throw new Error('Product not found')
    }
})

// @desc Delete product
// @route DELETE /api/products/:id
// @access Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)

    if (product) {
        await Product.deleteOne({ _id: product._id })
        res.status(200).json({ message: 'Product deleted' })
    } else {
        res.status(404)
        throw new Error('Product not found')
    }
})

// @desc Add review
// @route POST /api/products/:id/reviews
// @access Private
const addProductReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body
    const product = await Product.findById(req.params.id)

    if (product) {
        const alreadyReviewed = product.reviews.find((review) => review.user.toString() === req.user._id.toString())
        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id
        }

        if (alreadyReviewed) {
            res.status(400)
            throw new Error('Product already reviewed')
        }

        product.reviews.push(review)
        product.numReviews = product.reviews.length
        product.rating = product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length

        await product.save()

        res.status(201).json({ message: 'Review added' })
    } else {
        res.status(404)
        throw new Error('Product not found')
    }
})

export { getProducts, getProductById, addNewProduct, updateProduct, deleteProduct, addProductReview }