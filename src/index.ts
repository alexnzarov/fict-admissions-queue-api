import dotenv from 'dotenv';
dotenv.config();

import { createConnection } from "./db";
import logger from "./core/logger";
import app from "./app";

createConnection()
  .then(async (connection) => {
    logger.info('Connection to the database was established', { database: connection.driver.database });

    const port = process.env.PORT ?? 3000;
    app.listen(port, () => {
      logger.info('Server is running', { port });
    });
  });