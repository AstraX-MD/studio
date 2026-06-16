/**
 * AstraX - Alive Command
 */
export default {
  name: "alive",
  category: "utility",
  description: "Check if the bot is active.",
  execute: async (sock, m, args, { db }) => {
    const botname = await db.get('botname') || 'AstraX';
    const status = `┌──⌈ ${botname.toUpperCase()} STATUS ⌋
┃ Mode: Online
┃ System: Stable
┃ Version: 1.2.5
┃ Status: Active
└────────────────`;
    await sock.sendMessage(m.key.remoteJid, { text: status }, { quoted: m });
  }
};