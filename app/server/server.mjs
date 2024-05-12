import mongoose, { connect } from "mongoose";
import { config } from "dotenv";
config();
import app from "../app.mjs";
import logger from "../utils/logger.mjs";

// Connect to the database
const DB = process.env.DATABASE;
mongoose.connect(DB).then(() => {
  if (mongoose.connection) {
    logger.info("DB connection successful");
  } else {
    logger.error("DB connection failed");
  }
});

app.listen(process.env.PORT, () => {
  logger.info(`App is running on port ${process.env.PORT}`);
});
