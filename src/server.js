import env from './config/env.js';
import app from './index.js'
import {connectwithdb,closedb} from "./config/db.js";
import { handleCrash } from './config/gracefulShutdown.js';
import http from 'http'
const PORT = env.PORT ||  8000;


const server = http.createServer(app);

const startServer = () => {
  server.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
  )

  };


const shutdown = async (signal) => {
  console.log(`\n${signal} received. Closing server...`);

  server.close(async () => {
    console.log('HTTP server closed');
    await closedb();
    process.exit(0);
  });

  // Force exit if stuck
  setTimeout(() => {
    console.error('Forcing shutdown');
    process.exit(1);
  }, 10000);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.on('SIGQUIT', shutdown);
const bootstrap = async () => {
  try {
    handleCrash();
    await connectwithdb();
    startServer();
  } catch (error) {
    console.error('Application failed to start', error);
    process.exit(1);
  }
};

bootstrap();
 