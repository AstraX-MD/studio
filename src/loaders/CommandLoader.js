
/**
 * @fileOverview Discovers and registers commands from the plugins directory.
 */
import fs from 'fs';
import path from 'path';

class CommandLoader {
  static async load(bot) {
    const pluginsDir = path.resolve('src/plugins/commands');
    if (!fs.existsSync(pluginsDir)) return;

    const categories = fs.readdirSync(pluginsDir);
    
    for (const category of categories) {
      const categoryPath = path.join(pluginsDir, category);
      if (!fs.statSync(categoryPath).isDirectory()) continue;

      const files = fs.readdirSync(categoryPath).filter(f => f.endsWith('.js'));
      
      for (const file of files) {
        try {
          const { default: command } = await import(`file://${path.join(categoryPath, file)}`);
          if (!command.name) continue;
          
          command.category = category;
          bot.commands.set(command.name, command);
          
          if (command.aliases && Array.isArray(command.aliases)) {
            command.aliases.forEach(alias => bot.commands.set(alias, command));
          }
        } catch (e) {
          bot.logger.error(`Failed to load command ${file}: ${e.message}`);
        }
      }
    }
    
    bot.logger.info(`Loaded ${bot.commands.size} commands.`);
  }
}

export default CommandLoader;
