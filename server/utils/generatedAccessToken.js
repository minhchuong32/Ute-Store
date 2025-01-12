import jwt from 'jsonwebtoken'

const generateAccessToken = async(userId) => {
    const token = await jwt.sign({ id : userId }, 
        process.env.SECRET_KEY_ACCESS_TOKEN, 
        { expiresIn: '1d' }
    )
    return token
}

export default generateAccessToken