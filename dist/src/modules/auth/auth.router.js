import express from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
export class AuthRouter {
    authController;
    router;
    constructor(authController) {
        this.authController = authController;
        this.router = express.Router();
        this.initRoutes();
    }
    initRoutes = () => {
        this.router.post("/register", this.authController.register);
        this.router.post("/login", this.authController.login);
        this.router.get("/me", authenticate, this.authController.getProfile);
    };
    getRouter = () => {
        return this.router;
    };
}
