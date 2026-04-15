import Joi from "joi";
import MainDto from "../../../common/validation.dto.js";
class RegisterDto extends MainDto {
    static schema = Joi.object({
        name: Joi.string().trim().min(2).max(50).required(),
        email: Joi.string().email().trim().lowercase().required(),
        isEmailVerified: Joi.boolean().default(false),
        password: Joi.string()
            .min(8)
            .max(32)
            .pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])/)
            .required()
            .messages({
                "string.pattern.base":
                    "Password must contain at least one letter, one number, and one special character"
            }),
        address: Joi.string().trim().min(5).max(255).optional(),
        phone: Joi.string().trim().min(10).max(10),
        city: Joi.string().trim().min(2).max(50).required(),
        state: Joi.string().trim().min(2).max(50).required()
    })
}
export default RegisterDto
