/**
 * @fileOverview Perform a deep security scan of group settings.
 */
export default {
  name: "securityaudit",
  aliases: ["audit", "scan"],
  category: "security",
  description: "Audit the group's current security and administrative configuration.",
  usage: "securityaudit",
  permissions: 5,
  groupOnly: true,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const metadata = await ctx.sock.groupMetadata(ctx.jid);
    
    const antiLink = await ctx.bot.db.get('security', `antilink:${ctx.jid}`) || { mode: 'off' };
    const antiBot = await ctx.bot.db.get('security', `antibot:${ctx.jid}`) || { mode: 'off' };

    const output = `┌──⌈ 🛡️ SECURITY SCAN ⌋
┃
┃ Target: ${metadata.subject}
┃ Members: ${metadata.participants.length}
┃
├─⊷ Anti-Link: ${antiLink.mode === 'on' ? '✅ ARMED' : '❌ OFF'}
├─⊷ Anti-Bot: ${antiBot.mode === 'on' ? '✅ ARMED' : '❌ OFF'}
├─⊷ Admin Count: ${metadata.participants.filter(p => p.admin).length}
├─⊷ Lock Status: ${metadata.announce ? '🔒 CLOSED' : '🔓 OPEN'}
┃
┃ Status: ${antiLink.mode === 'on' ? 'SECURE' : 'VULNERABLE'}
└────────────────
  © ${botName.toUpperCase()}`;

    ctx.reply(output);
  }
};
