import express from "express";
export class UserRouter {
    userController;
    authMiddleware;
    router;
    constructor(userController, authMiddleware) {
        this.userController = userController;
        this.authMiddleware = authMiddleware;
        this.router = express.Router();
        this.initRoutes();
    }
    initRoutes = () => {
        this.router.get("/", this.userController.getUsers);
        this.router.get("/:id", this.userController.getUser);
        this.router.post("/", this.userController.createUser);
        this.router.patch("/:id", this.userController.updateUser);
        this.router.patch("/:id/password", this.userController.updatePassword);
        this.router.patch("/:id/profile", this.userController.updateProfile);
        this.router.delete("/:id", this.userController.deleteUser);
    };
    getRouter = () => {
        return this.router;
    };
}
