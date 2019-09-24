import jwt from 'jsonwebtoken'

const generateToken = userId => {
    const token = jwt.sign({ userId }, 'myjwtsecret', { expiresIn: '7 days' })
    return token
}

export { generateToken as default }