import { ApiError } from "../utils/api-error.js";
import jwt from "jsonwebtoken";
export class AuthMiddleware {
    verifyToken = (secretKey) => {
        return (req, res, next) => {
            const token = req.headers.authorization?.split(" ")[1];
            if (!token) {
                throw new ApiError("Token Not Found", 401);
            }
            jwt.verify(token, secretKey, (err, payload) => {
                if (err) {
                    if (err instanceof jwt.JsonWebTokenError) {
                        throw new ApiError("Token Expired", 401);
                    }
                    else {
                        throw new ApiError("Token Invalid", 401);
                    }
                }
                req.user = payload;
                res.locals.user = payload;
                next();
            });
        };
    };
    verifyRole = (roles) => {
        return (req, res, next) => {
            const userRole = res.locals.user.role;
            if (!userRole || !roles.includes(userRole)) {
                throw new ApiError("Unauthorized", 403);
            }
            next();
        };
    };
}
