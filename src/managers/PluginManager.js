/**
 * @fileOverview Manages the lifecycle of plugins (install, remove, toggle).
 */
import CommandLoader from '../loaders/CommandLoader.js';
import EventLoader from '../loaders/EventLoader.js';
import fs from 'fs';
import path from 'path';

export default class PluginManager {
  constructor(bot) {
    this.bot = bot;
  }

  /**
   * Installs a plugin by writing the file to disk and loading it.
   */
  async install(type, category, fileName, content) {
    const dir = type === 'command' 
      ? path.resolve('src/plugins/commands', category)
      : path.resolve('src/plugins/events');

    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    
    const filePath = path.join(dir, fileName);
    fs.writeFileSync(filePath, content);

    if (type === 'command') {
      return await CommandLoader.reload(this.bot, category, fileName);
    } else {
      return await EventLoader.reload(this.bot, fileName);
    }
  }

  /**
   * Removes a plugin from disk and memory.
   */
  async remove(type, category, fileName, name) {
    const dir = type === 'command' 
      ? path.resolve('src/plugins/commands', category)
      : path.resolve('src/plugins/events');

    const filePath = path.join(dir, fileName);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    if (type === 'command') {
      return CommandLoader.unload(this.bot, name);
    } else {
      return EventLoader.unload(this.bot, name);
    }
  }

  /**
   * Toggles the enabled state of a plugin via database.
   */
  async toggle(type, name, status) {
    const key = type === 'command' ? 'disabledCommands' : 'disabledEvents';
    const list = (await this.bot.db.get('settings', key)) || [];
    
    if (status === false) { // Disable
      if (!list.includes(name)) list.push(name);
    } else { // Enable
      const index = list.indexOf(name);
      if (index > -1) list.splice(index, 1);
    }

    await this.bot.db.set('settings', key, list);
    return true;
  }
}
