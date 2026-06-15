
/**
 * @fileOverview System entry point. Handles process events and starts the bot.
 */
import bot from './Bot.js';

class Bootstrap {
  static async start() {
    console.log(`
    ====================================
      ASTRAX ENTERPRISE FRAMEWORK
      Version: 2.4.0-STABLE
    ====================================
    `);

    try {
      await bot.init();
    } catch (error) {
      console.error('CRITICAL STARTUP ERROR:', error);
      process.exit(1);
    }

    process.on('unhandledRejection', (err) => {
      console.error('UNHANDLED REJECTION:', err);
    });

    process.on('uncaughtException', (err) => {
      console.error('UNCAUGHT EXCEPTION:', err);
    });
  }
}

Bootstrap.start();
