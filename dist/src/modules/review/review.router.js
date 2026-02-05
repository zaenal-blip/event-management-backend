import express from "express";
export class ReviewRouter {
    reviewController;
    authMiddleware;
    router;
    constructor(reviewController, authMiddleware) {
        this.reviewController = reviewController;
        this.authMiddleware = authMiddleware;
        this.router = express.Router();
        this.initRoutes();
    }
    initRoutes = () => {
        // Middleware shorthand
        const authenticate = this.authMiddleware.verifyToken(process.env.JWT_SECRET || "secret");
        // Public routes
        this.router.get("/events/:eventId/reviews", this.reviewController.getEventReviews);
        this.router.get("/organizers/:organizerId/profile", this.reviewController.getOrganizerProfile);
        // Protected routes
        this.router.post("/events/:eventId/reviews", authenticate, this.reviewController.createReview);
    };
    getRouter = () => {
        return this.router;
    };
}
