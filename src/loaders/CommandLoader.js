/**
 * @fileOverview Discovers and registers commands with an Intelligent Alias Priority Engine.
 * v1.2.5: Prevents command mixing by prioritizing categories.
 */
import fs from 'fs';
import path from 'path';

class CommandLoader {
  static async load(bot) {
    const pluginsDir = path.resolve('src/plugins/commands');
    if (!fs.existsSync(pluginsDir)) return;

    // Priority hierarchy for alias resolution
    const categoryPriority = {
      'owner': 100,
      'sudo': 90,
      'admin': 80,
      'security': 70,
      'general': 60,
      'utility': 50
    };

    const categories = fs.readdirSync(pluginsDir);
    let loaded = 0;
    let conflicts = 0;
    
    // Internal map to track alias origins and priorities
    const aliasRegistry = new Map();

    for (const category of categories) {
      const categoryPath = path.join(pluginsDir, category);
      if (!fs.statSync(categoryPath).isDirectory()) continue;

      const files = fs.readdirSync(categoryPath).filter(f => f.endsWith('.js'));
      
      for (const file of files) {
        try {
          const filePath = path.resolve('src/plugins/commands', category, file);
          const { default: command } = await import(`file://${filePath}?update=${Date.now()}`);
          
          if (!command || !command.name) continue;
          
          command.category = category;
          command.fileName = file;

          // Register Main Name
          bot.commands.set(command.name, command);
          loaded++;

          // Register Aliases with Priority Resolution
          if (command.aliases && Array.isArray(command.aliases)) {
            for (const alias of command.aliases) {
              const existing = aliasRegistry.get(alias);
              const currentPriority = categoryPriority[category] || 0;
              const existingPriority = existing ? (categoryPriority[existing.category] || 0) : -1;

              if (!existing || currentPriority > existingPriority) {
                bot.commands.set(alias, command);
                aliasRegistry.set(alias, { name: command.name, category });
              } else {
                conflicts++;
              }
            }
          }
        } catch (e) {
          console.log(`\x1b[31m==> ERROR: Failed to load ${file}: ${e.message}\x1b[0m`);
        }
      }
    }
    
    const uniqueCount = new Set(bot.commands.values()).size;
    console.log(`\x1b[32m==> ENGINE: ${uniqueCount} Modules Active. ${bot.commands.size} Triggers.\x1b[0m`);
    if (conflicts > 0) console.log(`\x1b[33m==> ENGINE: Resolved ${conflicts} alias conflicts via Priority logic.\x1b[0m`);
  }

  static async reload(bot, category, fileName) {
    try {
      const filePath = path.resolve('src/plugins/commands', category, fileName);
      const { default: command } = await import(`file://${filePath}?update=${Date.now()}`);
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
