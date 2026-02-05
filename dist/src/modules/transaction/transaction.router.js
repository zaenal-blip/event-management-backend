import express from "express";
export class TransactionRouter {
    transactionController;
    authMiddleware;
    router;
    constructor(transactionController, authMiddleware) {
        this.transactionController = transactionController;
        this.authMiddleware = authMiddleware;
        this.router = express.Router();
        this.initRoutes();
    }
    initRoutes = () => {
        // Middleware shorthand
        const authenticate = this.authMiddleware.verifyToken(process.env.JWT_SECRET || "secret");
        const authorize = this.authMiddleware.verifyRole;
        // Customer routes
        this.router.post("/events/:eventId/transactions", authenticate, this.transactionController.createTransaction);
        this.router.get("/me/transactions", authenticate, this.transactionController.getMyTransactions);
        this.router.get("/transactions/:id", authenticate, this.transactionController.getTransactionById);
        this.router.put("/transactions/:id/payment-proof", authenticate, this.transactionController.uploadPaymentProof);
        this.router.put("/transactions/:id/cancel", authenticate, this.transactionController.cancelTransaction);
        // Organizer routes
        this.router.put("/transactions/:id/confirm", authenticate, authorize(["ORGANIZER"]), this.transactionController.confirmTransaction);
        this.router.put("/transactions/:id/reject", authenticate, authorize(["ORGANIZER"]), this.transactionController.rejectTransaction);
    };
    getRouter = () => {
        return this.router;
    };
}
