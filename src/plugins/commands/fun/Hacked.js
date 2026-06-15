/**
 * @fileOverview Simulator hacking prank.
 */
export default {
  name: "hacked",
  category: "fun",
  description: "Simulate a terminal hack on a user (Prank).",
  usage: "hacked <tag>",
  cooldown: 20,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    let target = ctx.msg.message?.extendedTextMessage?.contextInfo?.participant || 
                 ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

    if (!target) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Target missing.\n└────────────────");

    const { key } = await ctx.reply(`┌──⌈ 📟 EXPLOIT ⌋\n┃ Initializing Shell...\n└────────────────`);

    const steps = [
      `┃ Searching: @${target.split('@')[0]}`,
      `┃ Bypass: WhatsApp Firewall 1.4`,
      `┃ Fetching: Media Database`,
      `┃ Injecting: Trojan.AstraX`,
      `┃ Status: SUCCESSFUL`,
      `└─ 🌌 ${botName.toUpperCase()}`
    ];

    let current = `┌──⌈ 📟 EXPLOIT ⌋\n`;
    for (const step of steps) {
      current += step + '\n';
      await ctx.sock.sendMessage(ctx.jid, { text: current, edit: key });
      await new Promise(r => setTimeout(r, 1000));
    }
  }
};
