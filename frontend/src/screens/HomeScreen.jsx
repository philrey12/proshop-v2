import React from 'react'
import { Row, Col } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import Product from '../components/Product'
import Loader from '../components/Loader'
import Message from '../components/Message'
import Paginate from '../components/Paginate'
import { useGetProductsQuery } from '../slices/productsApiSlice'

const HomeScreen = () => {
    const { keyword, pageNumber } = useParams()
    const { data, isLoading, error } = useGetProductsQuery({ keyword, pageNumber })

    return (
        <>
            {isLoading ? (
                <Loader />
                ) : error ? (
                    <Message variant='danger'>
                        { error?.data?.message || error.error }
                    </Message>
                ) : (
                    <>
                        {keyword ? (
                            <p>Search results for "{keyword}"</p>
                        ) : (
                            <h2>Latest Products</h2>
                        )}

                        <Row>
                            {data.products.map((product) => (
                                <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                                    <Product product={product} />
                                </Col>
                            ))}
                        </Row>

                        <Row>
                            <Col className='my-2'>
                                <Paginate pages={data.pages} page={data.page} keyword={keyword ? keyword : ''} />
                            </Col>
                        </Row>
                    </>
            )}
        </>
    )
}

export default HomeScreen