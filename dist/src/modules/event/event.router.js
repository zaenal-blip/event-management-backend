import express from "express";
import { authenticate, authorize } from "../../middleware/auth.middleware.js";
export class EventRouter {
    eventController;
    router;
    constructor(eventController) {
        this.eventController = eventController;
        this.router = express.Router();
        this.initRoutes();
    }
    initRoutes = () => {
        // Public routes
        this.router.get("/", this.eventController.getEvents);
        this.router.get("/:id", this.eventController.getEventById);
        // Protected routes (organizer only)
        this.router.post("/", authenticate, authorize("ORGANIZER"), this.eventController.createEvent);
        this.router.post("/:eventId/vouchers", authenticate, authorize("ORGANIZER"), this.eventController.createVoucher);
        this.router.put("/:id/publish", authenticate, authorize("ORGANIZER"), this.eventController.publishEvent);
    };
    getRouter = () => {
        return this.router;
    };
}
