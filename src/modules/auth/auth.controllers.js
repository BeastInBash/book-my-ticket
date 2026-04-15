import { loginService, registerService } from "./auth.services.js"
import ApiResponse from '../../common/utils/api-response.js'

export const register = async (req, res) => {
    const user = await registerService(req.body)
    ApiResponse.created(res, "Registration Successful", user)
}
export const login = async (req, res) => {
    try {
        const user = await loginService(req.body);
        req.session.user = {
            id: user.user.id,
            name: user.user.name,
            email: user.user.email
        };

        req.session.save((err) => {
            if (err) {
                console.error("Session save error:", err);
                return res.status(500).json({ error: "Session not saved" });
            }

            return ApiResponse.ok(res, "Login Successful", req.session.user);
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Login failed" });
    }
}
