/**
 * AstraX - router.js
 * High-speed message and event dispatcher
 */
import { logger } from './logger.js';
import Context from './Context.js';

let commands = new Map();
let aliases = new Map();
let observers = new Map();

export function setCommands(cmdMap, aliasMap) {
  commands = cmdMap;
  aliases = aliasMap;
}

export function setObservers(obsMap) {
  observers = obsMap;
}

export async function routeMessage(sock, m, bot) {
  if (!m.message || m.key.remoteJid === 'status@broadcast') return;

  const ctx = new Context(bot, m);
  const prefix = await bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
  
  let isCommand = false;
  let commandName = '';
  let args = [];

  if (ctx.text.startsWith(prefix)) {
    isCommand = true;
    const fullContent = ctx.text.slice(prefix.length).trim();
    args = fullContent.split(/ +/);
    commandName = args.shift().toLowerCase();
  }

  logger.incoming(
    ctx.isGroup ? `GROUP[${ctx.jid.split('@')[0]}]` : 'PRIVATE',
    ctx.sender.split('@')[0],
    isCommand ? commandName : null
  );

  // LOOP GUARD
  if (ctx.text.includes('┌──⌈') || ctx.text.includes('└─')) return;

  if (isCommand && commandName) {
    const actualName = aliases.get(commandName) || commandName;
    const command = commands.get(actualName);
    if (command) {
      try {
        await bot.handlers.command.execute(command, ctx, args);
      } catch (e) {
        logger.error('ROUTER', `Execution failed: ${e.message}`);
      }
    }
  }

  // Observers logic
  for (const observer of observers.values()) {
    if (observer.enabled !== false) {
      observer.execute(sock, ctx, m).catch(() => {});
    }
  }
}

export async function routeEvent(sock, event, data, bot) {
  // Handle events like group updates, deletes, edits
  if (event === 'messages.delete') {
     const plugin = bot.events.get('messages.delete');
     if (plugin) plugin.execute(bot, data);
  } else if (event === 'messages.edit') {
     const plugin = bot.events.get('messages.update');
     if (plugin) plugin.execute(bot, [data]);
  } else {
     const plugin = bot.events.get(event);
     if (plugin) plugin.execute(bot, data);
  }
}
