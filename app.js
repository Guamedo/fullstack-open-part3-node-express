const express = require("express");
const mongoose = require("mongoose");
const config = require("./utils/config");
const logger = require("./utils/logger");
const notesRouter = require("./controllers/notes");
const middleware = require("./utils/middleware");

const app = express();

logger.info("connecting to", config.MONGODB_URI);

mongoose.set("strictQuery", false);
mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDb");
  })
  .catch((err) => {
    logger.info("error connecting to MongoDB", err.message);
  });

app.use(express.static("dist"));
app.use(express.json());
app.use(middleware.requestLogger);

app.use("/api/notes", notesRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
