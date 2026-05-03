import cron from "node-cron";
import Product from "../models/Product.model.js";

/**
 * Cleanup Job: Hard delete soft-deleted products after 30 days
 * Runs daily at 2 AM
 */
export const scheduleCleanupDeletedProducts = () => {
  // Schedule job to run daily at 2:00 AM
  cron.schedule("0 2 * * *", async () => {
    try {
      console.log("[Job] Starting cleanup of deleted products...");

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // Find soft-deleted products older than 30 days
      const deletedProducts = await Product.find({
        is_deleted: true,
        updatedAt: { $lt: thirtyDaysAgo },
      });

      console.log(
        `[Job] Found ${deletedProducts.length} deleted products to clean up`,
      );

      if (deletedProducts.length > 0) {
        // Hard delete
        const result = await Product.deleteMany({
          is_deleted: true,
          updatedAt: { $lt: thirtyDaysAgo },
        });

        console.log(
          `[Job] Successfully deleted ${result.deletedCount} products from database`,
        );
      }

      console.log("[Job] Cleanup job completed successfully");
    } catch (error) {
      console.error("[Job] Error in cleanup job:", error.message);
    }
  });

  console.log(
    "[Job] Product cleanup scheduler initialized (runs daily at 2 AM UTC)",
  );
};

/**
 * Optional: Manual cleanup trigger (for testing or admin purposes)
 * DELETE endpoint can be added to call this
 */
export const manualCleanupDeletedProducts = async (daysOld = 30) => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await Product.deleteMany({
      is_deleted: true,
      updatedAt: { $lt: cutoffDate },
    });

    return {
      success: true,
      message: `Hard deleted ${result.deletedCount} products older than ${daysOld} days`,
      deletedCount: result.deletedCount,
    };
  } catch (error) {
    throw new Error(`Manual cleanup failed: ${error.message}`);
  }
};
