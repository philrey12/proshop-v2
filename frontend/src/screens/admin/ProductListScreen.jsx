import React from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Row, Col } from 'react-bootstrap'
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa'
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import { toast } from 'react-toastify'
import { useGetProductsQuery, useAddNewProductMutation } from '../../slices/productsApiSlice'

const ProductListScreen = () => {
    const { data: products, isLoading, refetch, error } = useGetProductsQuery()
    const [addNewProduct, { isLoading: loadingAddNewProduct }] = useAddNewProductMutation()
    const deleteProductHandler = (id) => {
        console.log('delete', id)
    }
    const addNewProductHandler = async () => {
        if (window.confirm('Add new product?')) {
            try {
                await addNewProduct()
                refetch()
            } catch (err) {
                toast.error(err?.data?.message || err.error)
            }
        }
    }

    return (
        <>
            <Row className='align-items-center mb-2'>
                <Col>
                    <h3>Products</h3>
                </Col>
                <Col className='text-end'>
                    <Button className='btn-sm m-3' onClick={addNewProductHandler}>
                        <FaPlus /> Add Product
                    </Button>
                </Col>
            </Row>

            {loadingAddNewProduct && <Loader />}

            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>{error}</Message>
            ) : (
                <>
                    <Table striped hover responsive className='table-sm'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Category</th>
                                <th>Brand</th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>
                            {products.map((product) => (
                                <tr key={product._id}>
                                    <td>{product._id}</td>
                                    <td>{product.name}</td>
                                    <td>${product.price}</td>
                                    <td>{product.category}</td>
                                    <td>{product.brand}</td>
                                    <td>
                                        <LinkContainer to={`/admin/product/${product._id}/edit`}>
                                            <Button variant='light' className=' btn-sm mx-2' title='Edit'>
                                                <FaEdit />
                                            </Button>
                                        </LinkContainer>
                                        <Button 
                                            variant='light' 
                                            className='btn-sm' 
                                            title='Delete' 
                                            style={{color: 'red'}}
                                            onClick={() => deleteProductHandler(product._id)}
                                        ><FaTrash /></Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </>
            )}
        </>
    )
}

export default ProductListScreen