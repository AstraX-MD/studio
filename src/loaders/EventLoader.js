
/**
 * @fileOverview Discovers and registers event listeners.
 */
import fs from 'fs';
import path from 'path';

class EventLoader {
  static async load(bot) {
    const eventsDir = path.resolve('src/plugins/events');
    if (!fs.existsSync(eventsDir)) return;

    const files = fs.readdirSync(eventsDir).filter(f => f.endsWith('.js'));
    
    for (const file of files) {
      try {
        const { default: event } = await import(`file://${path.join(eventsDir, file)}`);
        if (!event.name) continue;
        
        bot.events.set(event.name, event);
      } catch (e) {
        bot.logger.error(`Failed to load event ${file}: ${e.message}`);
      }
    }
    
    bot.logger.info(`Loaded ${bot.events.size} event listeners.`);
  }
}

export default EventLoader;
