import { closedb } from './db.js';

export const handleCrash = () => {
  console.log('Setting up crash handlers');
  process.on('uncaughtException', async (err) => {
    console.error('Uncaught Exception:', err);
    await closedb();
    process.exit(1);
  });

  process.on('unhandledRejection', async (reason) => {
    console.error('Unhandled Rejection:', reason);
    await closedb();
    process.exit(1);
  });
};
