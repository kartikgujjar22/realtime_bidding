const pino = require("pino");
const logger = pino();

logger.info("this is an info message");
logger.error("this is an error message");
