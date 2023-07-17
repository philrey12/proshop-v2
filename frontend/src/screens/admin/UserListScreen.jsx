import React from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button } from 'react-bootstrap'
import { FaTimes, FaEdit, FaTrash, FaCheck } from 'react-icons/fa'
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import { toast } from 'react-toastify'
import Meta from '../../components/Meta'
import { useGetUsersQuery, useDeleteUserMutation } from '../../slices/usersApiSlice'

const UserListScreen = () => {
    const { data: users, isLoading, refetch, error } = useGetUsersQuery()
    const [deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation()
    const deleteUserHandler = async (id, name) => {
        if (window.confirm(`Delete ${name}?`)) {
            try {
                await deleteUser(id)
                toast.success('User deleted')
                refetch()
            } catch (err) {
                toast.error(err?.data?.message || err.error)
            }
        }
    }

    return (
        <>
            <Meta title='Manage Users' />

            <h3>Users</h3>

            {loadingDelete && <Loader />}

            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>{error}</Message>
            ) : (
                <Table striped hover responsive className='table-sm'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Admin</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td>{user._id}</td>
                                <td>{user.name}</td>
                                <td><a href={`mailto:${user.email}`}>{user.email}</a></td>
                                <td>
                                    {user.isAdmin ? (
                                        <FaCheck style={{ color: 'green' }} />
                                    ) : (
                                        <FaTimes style={{ color: 'red' }} />
                                    )}
                                </td>
                                <td>
                                    <LinkContainer to={`/admin/user/${user._id}/edit`}>
                                        <Button variant='light' className=' btn-sm mx-2' title='Edit'>
                                            <FaEdit />
                                        </Button>
                                    </LinkContainer>
                                    <Button 
                                        variant='light' 
                                        className='btn-sm' 
                                        title='Delete' 
                                        style={{color: 'red'}}
                                        onClick={() => deleteUserHandler(user._id, user.name)}
                                    ><FaTrash /></Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </>
    )
}

export default UserListScreen