import { Router } from "express";
import RegisterDto from "./dto/registerDto.js";
import { login, register } from "./auth.controllers.js";
import validate from '../../common/middleware/validate.middleware.js'
import LoginDto from "./dto/loginDto.js";
const router = Router();

router.post('/register', validate(RegisterDto), register)
router.post('/login', validate(LoginDto), login)
export default router;
