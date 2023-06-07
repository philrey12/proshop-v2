import bcrypt from 'bcryptjs'

const users = [
    {
        name: 'Admin',
        email: 'admin@test.com',
        password: bcrypt.hashSync('admin123', 10),
        isAdmin: true
    },
    {
        name: 'John Smith',
        email: 'johnsmith@test.com',
        password: bcrypt.hashSync('user123', 10),
        isAdmin: false
    },
    {
        name: 'Jane Smith',
        email: 'janesmith@test.com',
        password: bcrypt.hashSync('user123', 10),
        isAdmin: false
    }
]

export default users