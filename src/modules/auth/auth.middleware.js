function isAuthenticated(req, res, next) {
    console.log("session", req.session)
    if (req.session?.user?.id) {
        return next();
    }
    if (req.originalUrl.startsWith("/api")) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    return res.redirect("/login");
}
export default isAuthenticated;
