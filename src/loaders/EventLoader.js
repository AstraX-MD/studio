/**
 * @fileOverview Discovers and registers event listeners with hot-reloading.
 */
import fs from 'fs';
import path from 'path';

class EventLoader {
  static async load(bot) {
    const eventsDir = path.resolve('src/plugins/events');
    if (!fs.existsSync(eventsDir)) return;

    const files = fs.readdirSync(eventsDir).filter(f => f.endsWith('.js'));
    
    for (const file of files) {
      await this.reload(bot, file);
    }
    
    console.log(`==> ENGINE: ${bot.events.size} event listeners operational.`);
  }

  static async reload(bot, fileName) {
    try {
      const filePath = path.resolve('src/plugins/events', fileName);
      const { default: event } = await import(`file://${filePath}?update=${Date.now()}`);
      
      if (!event || !event.name) return false;
      
      bot.events.set(event.name, event);
      return true;
    } catch (e) {
      console.log(`==> ERROR: Failed to load event ${fileName}`);
      return false;
    }
  }

  static unload(bot, eventName) {
    return bot.events.delete(eventName);
  }
}

export default EventLoader;
