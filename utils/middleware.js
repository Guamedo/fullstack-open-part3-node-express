const logger = require("./logger");

const requestLogger = (req, res, next) => {
  logger.info("Method", req.method);
  next();
};

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (err, req, res, next) => {
  console.error(err.message);

  if (err.name === "CastError") {
    return res.status(500).send({ error: "malformatted id" });
  }
  if (err.name === "ValidationError") {
    return res.status(400).send({ error: err.message });
  }

  next(err);
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
};
