/**
 * @fileOverview Group Engagement Auditor.
 */
export default {
  name: "activemembers",
  aliases: ["active", "topchatters"],
  category: "group-advanced",
  description: "Identify the most active members in the group based on message counts.",
  usage: "activemembers",
  permissions: 1,
  groupOnly: true,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    
    // Note: In production, this pulls from the RPG XP or a dedicated message counter DB
    const allStats = await ctx.bot.db.all('rpg_stats');
    const metadata = await ctx.sock.groupMetadata(ctx.jid);
    const participants = metadata.participants.map(p => p.id);

    const sorted = participants
      .map(id => ({ id, xp: allStats[id.split('@')[0]]?.xp || 0 }))
      .sort((a, b) => b.xp - a.xp)
      .slice(0, 10);

    let output = `┌──⌈ 📈 ENGAGEMENT ⌋
┃ Group: ${metadata.subject}
┃ Top 10 Chatters
┃\n`;

    sorted.forEach((u, i) => {
      output += `├─ ${i + 1}. @${u.id.split('@')[0]}\n┃    ✨ Activity: ${u.xp.toLocaleString()} pts\n`;
    });

    output += `┃\n└─ 🌌 ${botName.toUpperCase()}`;

    await ctx.sock.sendMessage(ctx.jid, { text: output, mentions: sorted.map(u => u.id) });
  }
};
