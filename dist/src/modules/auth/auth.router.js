import express from "express";
import { RegisterDto } from "./dto/register.dto.js";
import { LoginDto } from "./dto/login.dto.js";
export class AuthRouter {
    authController;
    validationMiddleware;
    router;
    constructor(authController, validationMiddleware) {
        this.authController = authController;
        this.validationMiddleware = validationMiddleware;
        this.router = express.Router();
        this.initRoutes();
    }
    initRoutes = () => {
        this.router.post("/register", this.validationMiddleware.validateBody(RegisterDto), this.authController.register);
        this.router.post("/login", this.validationMiddleware.validateBody(LoginDto), this.authController.login);
    };
    getRouter = () => {
        return this.router;
    };
}
