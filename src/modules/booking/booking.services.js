import { pool } from "../../common/database/config/db.js"
import ApiError from "../../common/utils/api-error.js";
import { getMybooking } from "./booking.queries.js";

const getMyBookingService = async (userId) => {
    try {
        console.log("Userid", userId)
        const result = await pool.query(getMybooking, [userId]);
        return {
            data: result.rows
        }
    } catch (error) {
        console.error(error);
        throw ApiError.badRequest("Something went wrong")
    }
}
export {
    getMyBookingService
}
