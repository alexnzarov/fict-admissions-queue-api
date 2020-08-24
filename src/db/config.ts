import { ConnectionOptions } from 'typeorm';
import fs from 'fs';

const options: ConnectionOptions = {
  type: 'postgres',
  host: process.env.DB_HOST ?? '127.0.0.1',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  username: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_NAME ?? 'postgres',
  schema: process.env.DB_SCHEMA ?? 'public',
  logging: process.env.LOG_LEVEL === 'debug',
  ssl: {
    ca: fs.readFileSync(`${__dirname}/../../ca.crt`),
  },
  synchronize: true,
  entities: [
    `${__dirname}/entities/*.js`,
  ],
};

export default options;
