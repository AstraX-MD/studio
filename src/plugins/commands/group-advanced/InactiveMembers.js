/**
 * @fileOverview Inactive Member Audit.
 */
export default {
  name: "inactivemembers",
  aliases: ["ghosts", "auditgroup"],
  category: "group-advanced",
  description: "Identify group members with 0 XP or activity.",
  usage: "inactivemembers",
  permissions: 5, // ADMIN+
  groupOnly: true,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    
    const allStats = await ctx.bot.db.all('rpg_stats');
    const metadata = await ctx.sock.groupMetadata(ctx.jid);
    
    const inactives = metadata.participants.filter(p => !allStats[p.id.split('@')[0]]).slice(0, 20);

    if (inactives.length === 0) return ctx.reply("┌──⌈ 🛡️ AUDIT ⌋\n┃ Every member is active!\n└────────────────");

    let output = `┌──⌈ 👻 GHOST LIST ⌋
┃ Found ${inactives.length} Ghost Users
┃ (Recent 20 showing)
┃\n`;

    inactives.forEach((u, i) => {
      output += `├─ ${i + 1}. @${u.id.split('@')[0]}\n`;
    });

    output += `┃\n┃ Tip: Use !kick to clean up.
└─ 🌌 ${botName.toUpperCase()}`;

    await ctx.sock.sendMessage(ctx.jid, { text: output, mentions: inactives.map(u => u.id) });
  }
};
