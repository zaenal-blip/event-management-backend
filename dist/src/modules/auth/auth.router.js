import express from "express";
import { RegisterDto } from "./dto/register.dto.js";
import { LoginDto } from "./dto/login.dto.js";
import { ForgotPasswordDto } from "./dto/forgot-password.dto.js";
import { ResetPasswordDto } from "./dto/reset-password.dto.js";
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
        this.router.post("/forgot-password", this.validationMiddleware.validateBody(ForgotPasswordDto), this.authController.forgotPassword);
        this.router.post("/reset-password", this.validationMiddleware.validateBody(ResetPasswordDto), this.authController.resetPassword);
    };
    getRouter = () => {
        return this.router;
    };
}
