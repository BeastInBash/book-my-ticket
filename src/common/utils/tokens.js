import 'dotenv/config'
import jwt from 'jsonwebtoken'
export const generateToken = (payload) => {
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET,{
        expiresIn : process.env.JWT_ACCESS_EXPIRES_IN || "7d"
    })
    return accessToken;
}
