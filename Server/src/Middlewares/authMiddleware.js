const { verifyAccessToken } = require("../Utils/jwt");

const authMiddleware = (req, res, next) => {
    try {
        const { accessToken } = req.cookies;

        if (!accessToken) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const decoded = verifyAccessToken(accessToken);

        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
        };

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired access token",
        });
    }
};

module.exports = authMiddleware;