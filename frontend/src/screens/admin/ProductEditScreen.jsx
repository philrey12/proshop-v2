import React from 'react'
import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { FaArrowLeft } from 'react-icons/fa'
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import FormContainer from '../../components/FormContainer'
import { toast } from 'react-toastify'
import Meta from '../../components/Meta'
import { 
    useGetProductDetailsQuery, 
    useUpdateProductMutation, 
    useUploadProductImageMutation 
} from '../../slices/productsApiSlice'

const ProductEditScreen = () => {
    const { id: productId } = useParams()
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState(0)
    const [image, setImage] = useState('')
    const [brand, setBrand] = useState('')
    const [category, setCategory] = useState('')
    const [countInStock, setCountInStock] = useState(0)
    const { data: product, isLoading, refetch, error } = useGetProductDetailsQuery(productId)
    const [updateProduct, { isLoading: loadingUpdate }] = useUpdateProductMutation()
    const [uploadProductImage] = useUploadProductImageMutation()
    const navigate = useNavigate()
    const submitHandler = async (e) => {
        e.preventDefault()

        try {
            await updateProduct({
                productId,
                name,
                description,
                price,
                image,
                brand,
                category,
                countInStock
            })

            toast.success('Product updated')
            refetch()
            navigate('/admin/productlist')
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    }
    const uploadFileHandler = async (e) => {
        const formData = new FormData()

        formData.append('image', e.target.files[0])

        try {
            const res = await uploadProductImage(formData).unwrap()

            toast.success(res.message);
            setImage(res.image)
        } catch (err) {
            toast.error(err?.data?.message || err.error)
        }
    }

    useEffect(() => {
        if (product) {
            setName(product.name)
            setDescription(product.description)
            setPrice(product.price)
            setImage(product.image)
            setBrand(product.brand)
            setCategory(product.category)
            setCountInStock(product.countInStock)
        }
    }, [product])

    return (
        <>
            <Meta title={`Edit - ${name}`} />

            <Link className='btn btn-light my-3' to='/admin/productlist'>
                <FaArrowLeft /> Back
            </Link>

            <FormContainer>
                <h3>Edit Product</h3>

                {loadingUpdate && <Loader />}

                {isLoading ? (
                    <Loader />
                ) : error ? (
                    <Message variant='danger'>{error}</Message>
                ) : (
                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId='name' className='mb-3'>
                            <Form.Label>Name</Form.Label>
                            <Form.Control 
                                type='text' 
                                placeholder='Enter name' 
                                value={name} 
                                onChange={(e) => setName(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId='description' className='mb-3'>
                            <Form.Label>Description</Form.Label>
                            <Form.Control 
                                as='textarea' 
                                rows={3} 
                                placeholder='Enter description' 
                                value={description} 
                                onChange={(e) => setDescription(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId='price' className='mb-3'>
                            <Form.Label>Price</Form.Label>
                            <Form.Control 
                                type='number' 
                                placeholder='Enter price' 
                                value={price} 
                                onChange={(e) => setPrice(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId='image' className='mb-3'>
                            <Form.Label>Image</Form.Label>
                            <Form.Control 
                                type='text' 
                                placeholder='Enter image URL' 
                                value={image} 
                                onChange={(e) => setImage(e.target.value)}
                            ></Form.Control>
                            <Form.Control 
                                type='file' 
                                label='Choose File' 
                                onChange={uploadFileHandler}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId='brand' className='mb-3'>
                            <Form.Label>Brand</Form.Label>
                            <Form.Control 
                                type='text' 
                                placeholder='Enter brand' 
                                value={brand} 
                                onChange={(e) => setBrand(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId='category' className='mb-3'>
                            <Form.Label>Category</Form.Label>
                            <Form.Control 
                                type='text' 
                                placeholder='Enter category' 
                                value={category} 
                                onChange={(e) => setCategory(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId='countInStock' className='mb-2'>
                            <Form.Label>Quantity</Form.Label>
                            <Form.Control 
                                type='number' 
                                placeholder='Enter quantity' 
                                value={countInStock} 
                                onChange={(e) => setCountInStock(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Button type='submit' variant='primary' className='my-2'>
                            Update
                        </Button>
                    </Form>
                )}
            </FormContainer>
        </>
    )
}

export default ProductEditScreen