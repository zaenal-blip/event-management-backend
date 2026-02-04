import jwt from "jsonwebtoken";
import { ApiError } from "../utils/api-error.js";
export const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new ApiError("Unauthorized", 401);
        }
        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            id: decoded.id,
            role: decoded.role,
        };
        next();
    }
    catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError("Invalid token", 401);
    }
};
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            throw new ApiError("Unauthorized", 401);
        }
        if (!roles.includes(req.user.role)) {
            throw new ApiError("Forbidden", 403);
        }
        next();
    };
};
