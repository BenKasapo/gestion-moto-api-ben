const cron = require('node-cron');
const { deletePendingPayments } = require('../database/requests'); // Import deletePendingPayments function from database/request

// Schedule task to run every 2 minutes
cron.schedule('*/10 * * * *', async () => {
  try {
    console.log("Running payment cleanup task...");

    // Find and delete pending payments
    const result = await deletePendingPayments();

    console.log(`Deleted ${result.count} pending payments`);
  } catch (error) {
    console.error("Error during payment cleanup:", error.message);
  }
});
