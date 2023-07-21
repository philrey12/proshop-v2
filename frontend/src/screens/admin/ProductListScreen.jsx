import React from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Row, Col } from 'react-bootstrap'
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa'
import { useParams } from 'react-router-dom'
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import Paginate from '../../components/Paginate'
import { toast } from 'react-toastify'
import Meta from '../../components/Meta'
import { 
    useGetProductsQuery, 
    useAddNewProductMutation, 
    useDeleteProductMutation 
} from '../../slices/productsApiSlice'

const ProductListScreen = () => {
    const { pageNumber } = useParams()
    const { data, isLoading, refetch, error } = useGetProductsQuery({ pageNumber })
    const [addNewProduct, { isLoading: loadingAddNewProduct }] = useAddNewProductMutation()
    const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation()
    const deleteProductHandler = async (id, name) => {
        if (window.confirm(`Delete ${name}?`)) {
            try {
                await deleteProduct(id)
                toast.success('Product deleted')
                refetch()
            } catch (err) {
                toast.error(err?.data?.message || err.error)
            }
        }
    }
    const addNewProductHandler = async () => {
        if (window.confirm('A new product placeholder will be created. Continue?')) {
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
            <Meta title='Manage Products' />

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
            {loadingDelete && <Loader />}

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
                                <th>Stock</th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>
                            {data.products.map((product) => (
                                <tr key={product._id}>
                                    <td>{product.name === '[Name]' || product.price === 0 || product.brand === '[Brand]' || product.category === '[Category]' ? '🔴 ' + product._id : product._id}</td>
                                    <td>{product.name}</td>
                                    <td>${product.price}</td>
                                    <td>{product.category}</td>
                                    <td>{product.brand}</td>
                                    <td>{product.countInStock}</td>
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
                                            onClick={() => deleteProductHandler(product._id, product.name)}
                                        ><FaTrash /></Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    
                    <Row>
                        <Col className='my-2'>
                            <Paginate pages={data.pages} page={data.page} isAdmin={true} />
                        </Col>
                    </Row>
                </>
            )}
        </>
    )
}

export default ProductListScreen