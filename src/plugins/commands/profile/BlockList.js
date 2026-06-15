/**
 * @fileOverview View all blocked contacts.
 */
export default {
  name: "blocklist",
  aliases: ["listblocked", "bl"],
  category: "profile",
  description: "Display a list of all currently blocked contacts.",
  usage: "blocklist",
  permissions: 9,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    
    try {
      const list = await ctx.sock.fetchBlocklist();
      let output = `┌──⌈ 🚫 BLOCKLIST ⌋\n┃ Total: ${list.length}\n┃\n`;
      
      if (list.length === 0) output += "┃ No blocked users.\n";
      else {
        list.forEach((id, i) => {
          output += `┃ ${i + 1}. @${id.split('@')[0]}\n`;
        });
      }
      
      output += "└────────────────";
      await ctx.sock.sendMessage(ctx.jid, { text: output, mentions: list });
    } catch (e) {
      ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Failed to fetch list.\n└────────────────");
    }
  }
};
