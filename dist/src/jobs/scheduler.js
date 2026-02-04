import * as cron from "node-cron";
import { TransactionJobs } from "./transaction-jobs.js";
/**
 * Scheduler for running periodic jobs
 */
export class Scheduler {
    transactionJobs;
    constructor(prisma) {
        this.transactionJobs = new TransactionJobs(prisma);
        this.scheduleJobs();
    }
    scheduleJobs = () => {
        // Expire transactions every 5 minutes
        cron.schedule("*/5 * * * *", async () => {
            try {
                await this.transactionJobs.expireTransactions();
            }
            catch (error) {
                console.error("Error in expire transactions job:", error);
            }
        });
        // Cancel transactions every hour
        cron.schedule("0 * * * *", async () => {
            try {
                await this.transactionJobs.cancelTransactions();
            }
            catch (error) {
                console.error("Error in cancel transactions job:", error);
            }
        });
        console.log("[Scheduler] Jobs scheduled successfully");
    };
}
