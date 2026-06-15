/**
 * @fileOverview Mention all group members with hierarchical sorting.
 */
export default {
  name: "tagall",
  aliases: ["everyone", "all"],
  category: "admin",
  description: "Mention all members in the group with professional sorting.",
  usage: "tagall [message]",
  permissions: 5,
  groupOnly: true,
  execute: async (ctx, args) => {
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    const metadata = await ctx.sock.groupMetadata(ctx.jid);
    const participants = metadata.participants;
    const admins = participants.filter(p => p.admin);
    const members = participants.filter(p => !p.admin);
    const message = args.join(' ') || "No message provided.";

    let output = `┌──⌈ 📢 TAG ALL ⌋
┃
├─ 🏷️ Group: ${metadata.subject}
├─ 👥 Total: ${participants.length}
┃
├─ 👑 ADMINS (${admins.length})\n`;

    admins.forEach((adm, i) => {
      output += `├─ ${String(i + 1).padStart(2, '0')}. @${adm.id.split('@')[0]} ${adm.admin === 'superadmin' ? '⭐' : '🔰'}\n`;
    });

    output += `┃\n├─ 👤 MEMBERS (${members.length})\n`;

    members.forEach((mem, i) => {
      output += `├─ ${String(admins.length + i + 1).padStart(2, '0')}. @${mem.id.split('@')[0]}\n`;
    });

    output += `┃\n└─ 🌌 AstraX Enterprise | ${prefix}help`;

    await ctx.sock.sendMessage(ctx.jid, { 
      text: output, 
      mentions: participants.map(p => p.id) 
    }, { quoted: ctx.msg });
  }
};