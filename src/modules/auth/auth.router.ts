import { AuthController } from "./auth.controller.js";
import express, { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";

export class AuthRouter {
  private router: Router;
  constructor(private authController: AuthController) {
    this.router = express.Router();
    this.initRoutes();
  }
  private initRoutes = () => {
    this.router.post("/register", this.authController.register);
    this.router.post("/login", this.authController.login);
    this.router.get("/me", authenticate, this.authController.getProfile);
  };
  getRouter = () => {
    return this.router;
  };
}
