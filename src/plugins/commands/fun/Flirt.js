/**
 * @fileOverview Smooth flirting lines.
 */
export default {
  name: "flirt",
  category: "fun",
  description: "Get a smooth flirting line.",
  usage: "flirt",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const lines = [
      "Are you a Wi-Fi signal? Because I'm feeling a connection.",
      "Do you have a map? I keep getting lost in your eyes.",
      "If you were a triangle, you'd be acute one.",
      "Is your name Google? Because you have everything I’m searching for."
    ];

    const output = `┌──⌈ ❤️ FLIRT ⌋
┃ 
┃ "${lines[Math.floor(Math.random() * lines.length)]}"
┃
└─ 🌌 ${botName.toUpperCase()}`;
    ctx.reply(output);
  }
};
