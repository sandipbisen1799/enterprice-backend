import env from './config/env.js';
import app from './index.js'
import {connectwithdb} from "./config/db.js";

import http from 'http'
const PORT = env.PORT ||  8000;


const server = http.createServer(app);

const startServer = (port = PORT) => {
  server.listen(port, () =>
    console.log(`Server running on port ${port}`)
  ).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is busy, trying ${Number(port) + 1}...`);
      startServer(Number(port) + 1);
    } else {
      console.error('Server error:', err);
    }
  });
};


const shutdown = async (signal) => {
  console.log(`\n${signal} received. Closing server...`);

  server.close(async () => {
    console.log('HTTP server closed');
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
    await connectwithdb();
    startServer();
  } catch (error) {
    console.error('Application failed to start', error);
    process.exit(1);
  }
};

bootstrap();
 