import Joi from "joi";
import MainDto from "../../../common/validation.dto.js";

class LoginDto extends MainDto {
    static schema = Joi.object({
        email: Joi.string().email().trim().lowercase().required(),
        password: Joi.string()
            .min(8)
            .max(32)
            .pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])/)
            .required()
            .messages({
                "string.pattern.base":
                    "Password must contain at least one letter, one number, and one special character"
            }),
    })
}
export default LoginDto
