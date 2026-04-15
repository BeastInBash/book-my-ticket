import ApiError from "../../common/utils/api-error.js";
import ApiResponse from "../../common/utils/api-response.js";
import { getMyBookingService } from "./booking.services.js";

const getMyBooking = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const data = await getMyBookingService(userId)
        ApiResponse.ok(res, "Fetched Successfull", data.data)
    } catch (error) {
        console.error(error);
        throw ApiError.notFound("Fetching Failed")
    }
}
export {
    getMyBooking
}
