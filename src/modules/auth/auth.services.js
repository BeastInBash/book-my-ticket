import { pool } from "../../common/database/config/db.js"
import { createUserQuery, findUserByEmailQuery, findUserById } from "./auth.queries.js"
import ApiError from '../../common/utils/api-error.js'
import bcrypt from "bcryptjs"
import { generateToken } from "../../common/utils/tokens.js"

const registerService = async ({ name, email, password, address, phone, city, state }) => {
    console.log(name, email, password, address, phone)
    const existingUser = await pool.query(findUserByEmailQuery, [email]);
    if (existingUser.rows.length > 0) throw ApiError.conflict("Email Already Exist");
    const hashedPassword = await bcrypt.hash(password, 10)
    const result = await pool.query(createUserQuery, [
        name,
        email,
        hashedPassword,
        phone || null,
        address || null,
        city,
        state
    ]);

    return result.rows[0];

}
const loginService = async ({ email, password }) => {
    const exist = await pool.query(findUserByEmailQuery, [email])
    if (exist.rows.length === 0) throw ApiError.notFound("User doesnot exist")
    const userId = exist.rows[0].id;
    const user = await pool.query(findUserById, [userId])
    const isMatch = bcrypt.compare(password, user.rows[0].password)
    if (!isMatch) throw ApiError.unAuthorized("Invalid Email or Password")
    const accessToken = generateToken({ id: user.rows[0].id })
    return {
        user: user.rows[0],
        accessToken,
    }
}
export {
    registerService,
    loginService
}
