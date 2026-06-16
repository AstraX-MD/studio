/**
 * @fileOverview Registers commands with Priority Conflict Resolution.
 */
import fs from 'fs';
import path from 'path';
import { logger } from '../core/logger.js';

class CommandLoader {
  static async load(bot) {
    const pluginsDir = path.resolve('src/plugins/commands');
    if (!fs.existsSync(pluginsDir)) return;

    const categoryPriority = {
      'owner': 100,
      'sudo': 90,
      'admin': 80,
      'security': 70,
      'general': 60
    };

    const categories = fs.readdirSync(pluginsDir);
    const aliasRegistry = new Map();

    for (const category of categories) {
      const categoryPath = path.join(pluginsDir, category);
      if (!fs.statSync(categoryPath).isDirectory()) continue;

      const files = fs.readdirSync(categoryPath).filter(f => f.endsWith('.js'));
      
      for (const file of files) {
        try {
          const filePath = path.resolve('src/plugins/commands', category, file);
          const { default: command } = await import(`file://${filePath}?v=${Date.now()}`);
          
          if (!command || !command.name) continue;
          
          command.category = category;
          command.fileName = file;

          bot.commands.set(command.name, command);
          
          if (command.aliases && Array.isArray(command.aliases)) {
            for (const alias of command.aliases) {
              const existing = aliasRegistry.get(alias);
              const currentPrio = categoryPriority[category] || 0;
              const existingPrio = existing ? (categoryPriority[existing.category] || 0) : -1;

              if (!existing || currentPrio > existingPrio) {
                bot.commands.set(alias, command);
                aliasRegistry.set(alias, { name: command.name, category });
              }
            }
          }
          
          logger.pluginLoaded(command.name, 'COMMAND', bot.commands.size);
          
        } catch (e) {
          logger.error('LOADER', `Failed ${file}: ${e.message}`);
        }
      }
    }
  }

  static async reload(bot, category, fileName) {
    try {
      const filePath = path.resolve('src/plugins/commands', category, fileName);
      const { default: command } = await import(`file://${filePath}?v=${Date.now()}`);
      if (!command || !command.name) return false;
      bot.commands.set(command.name, command);
      if (command.aliases) command.aliases.forEach(a => bot.commands.set(a, command));
      return true;
    } catch (e) { return false; }
  }

  static unload(bot, commandName) {
    const cmd = bot.commands.get(commandName);
    if (!cmd) return false;
    if (cmd.aliases) cmd.aliases.forEach(a => bot.commands.delete(a));
    bot.commands.delete(commandName);
    return true;
  }
}

export default CommandLoader;
