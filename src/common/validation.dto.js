import Joi from "joi";

class MainDto {
    static schema = Joi.object({})
    // Take dto classes 
    static validate(data) {
        const { error, value } = this.schema.validate(data, {
            abortEarly: false,
            stripUnknown: true
        });
        if (error) {
            const errors = error.details.map(detail => detail.message)
            return { errors, value: null }
        }
        return { errors: null, value }
    }
}
export default MainDto;
