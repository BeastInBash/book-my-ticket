import { Router } from "express";
import isAuthenticated from "../auth/auth.middleware.js";
import { getMyBooking } from "./booking.controller.js";

const bookingRoutes = Router()
bookingRoutes.get('/my-booking', isAuthenticated, getMyBooking)
export default bookingRoutes 
