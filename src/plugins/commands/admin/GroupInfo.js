/**
 * @fileOverview Show group settings and statistics.
 */
export default {
  name: "groupinfo",
  category: "admin",
  description: "Display detailed group metadata.",
  usage: "groupinfo",
  permissions: 1,
  groupOnly: true,
  execute: async (ctx) => {
    const metadata = await ctx.sock.groupMetadata(ctx.jid);
    const admins = metadata.participants.filter(p => p.admin).length;
    
    const output = `┌──⌈ ℹ️ GROUP INFO ⌋
┃
├─ Name: ${metadata.subject}
├─ ID: ${metadata.id}
├─ Members: ${metadata.participants.length}
├─ Admins: ${admins}
├─ Created: ${new Date(metadata.creation * 1000).toLocaleDateString()}
├─ Owner: @${metadata.owner?.split('@')[0] || 'Unknown'}
┃
└─ 🌌 AstraX Enterprise`;
    await ctx.sock.sendMessage(ctx.jid, { text: output, mentions: [metadata.owner] });
  }
};