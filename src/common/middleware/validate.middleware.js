import ApiError from "../utils/api-error.js"
const validate = (Dtoclass) => {
    return (req, res, next) => {
        console.log("Req.bo", req.body)
        const { errors, value } = Dtoclass.validate(req.body)
        if (errors) {
            throw ApiError.badRequest(errors.join("; "))
        }
        console.log("value from validate", value)
        req.body = value;
        next();
    }
}
export default validate;
