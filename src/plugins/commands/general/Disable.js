/**
 * @fileOverview Enable or Disable specific commands globally.
 */
export default {
  name: "disable",
  aliases: ["enable", "togglecommand"],
  category: "general",
  description: "Toggle the operational status of a command.",
  usage: "disable <command_name>",
  permissions: 8, // SUDO+
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const commandName = args[0]?.toLowerCase();

    if (!commandName) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Command name required.\n└────────────────");

    const command = ctx.bot.commands.get(commandName);
    if (!command) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Command not found.\n└────────────────");
    
    if (command.category === 'owner' || command.name === 'disable') {
      return ctx.reply("┌──⌈ 🚫 RESTRICTED ⌋\n┃ This command cannot be toggled.\n└────────────────");
    }

    const disabledList = await ctx.bot.db.get('settings', 'disabledCommands') || [];
    let status;

    if (disabledList.includes(command.name)) {
      // Re-enable
      const newList = disabledList.filter(cmd => cmd !== command.name);
      await ctx.bot.db.set('settings', 'disabledCommands', newList);
      status = '✅ ENABLED';
    } else {
      // Disable
      disabledList.push(command.name);
      await ctx.bot.db.set('settings', 'disabledCommands', disabledList);
      status = '❌ DISABLED';
    }

    const output = `┌──⌈ ⚙️ COMMAND TOGGLE ⌋
┃
┃ Command: ${command.name.toUpperCase()}
┃ Status: ${status}
┃ Admin: @${ctx.sender.split('@')[0]}
┃
└────────────────
  © ${botName.toUpperCase()}`;

    await ctx.sock.sendMessage(ctx.jid, { text: output, mentions: [ctx.sender] });
  }
};
