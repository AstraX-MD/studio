/**
 * @fileOverview Discovers and registers commands with clean audit logging.
 */
import fs from 'fs';
import path from 'path';

class CommandLoader {
  static async load(bot) {
    const pluginsDir = path.resolve('src/plugins/commands');
    if (!fs.existsSync(pluginsDir)) return;

    const categories = fs.readdirSync(pluginsDir);
    let loaded = 0;
    let failed = 0;
    
    for (const category of categories) {
      const categoryPath = path.join(pluginsDir, category);
      if (!fs.statSync(categoryPath).isDirectory()) continue;

      const files = fs.readdirSync(categoryPath).filter(f => f.endsWith('.js'));
      
      for (const file of files) {
        try {
          const success = await this.reload(bot, category, file);
          if (success) loaded++;
          else failed++;
        } catch (e) {
          failed++;
        }
      }
    }
    
    console.log(`==> ENGINE: ${loaded} modules active. ${failed} modules skipped.`);
  }

  static async reload(bot, category, fileName) {
    try {
      const filePath = path.resolve('src/plugins/commands', category, fileName);
      const { default: command } = await import(`file://${filePath}?update=${Date.now()}`);
      
      if (!command || !command.name) return false;
      
      command.category = category;
      command.fileName = fileName;
      
      // Cleanup old aliases
      const existing = bot.commands.get(command.name);
      if (existing && existing.aliases) {
        existing.aliases.forEach(alias => bot.commands.delete(alias));
      }

      bot.commands.set(command.name, command);
      if (command.aliases && Array.isArray(command.aliases)) {
        command.aliases.forEach(alias => bot.commands.set(alias, command));
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  static unload(bot, commandName) {
    const command = bot.commands.get(commandName);
    if (!command) return false;

    if (command.aliases) {
      command.aliases.forEach(alias => bot.commands.delete(alias));
    }
    bot.commands.delete(commandName);
    return true;
  }
}

export default CommandLoader;
