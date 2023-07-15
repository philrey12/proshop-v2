import React from 'react'
import { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { FaSearch } from 'react-icons/fa'
import { useParams, useNavigate } from 'react-router-dom'

const SearchBox = () => {
    const navigate  = useNavigate()
    const { keyword: urlKeyword } = useParams()
    const [keyword, setKeyword] = useState(urlKeyword || '')
    const submitHandler = (e) => {
        e.preventDefault()

        if (keyword.trim()) {
            navigate(`/search/${keyword}`)
        } else {
            navigate('/')
        }
    }

    return (
        <Form onSubmit={submitHandler} className='d-flex'>
            <Form.Control 
                type='text' 
                name='q' 
                placeholder='Search...' 
                value={keyword} 
                onChange={(e) => setKeyword(e.target.value)} 
                className='mr-sm-2 ml-sm-5'
            ></Form.Control>
            <Button variant='outline-light' type='submit' title='Search' className='p-2 mx-2' style={{ width: 50 }}>
                <FaSearch />
            </Button>
        </Form>
    )
}

export default SearchBox