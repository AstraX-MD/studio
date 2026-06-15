/**
 * @fileOverview Russian Roulette Game.
 */
export default {
  name: "russianroulette",
  aliases: ["rr", "shoot"],
  category: "games",
  description: "Pull the trigger and see if you survive.",
  usage: "rr",
  cooldown: 10,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const chamber = Math.floor(Math.random() * 6) + 1;
    const bullet = 1;

    const { key } = await ctx.reply(`┌──⌈ 🔫 ROULETTE ⌋\n┃ Status: Spinning...\n└────────────────`);
    await new Promise(r => setTimeout(r, 2000));

    if (chamber === bullet) {
      const output = `┌──⌈ 💥 BANG! ⌋
┃ 
┃ Result: YOU DIED
┃ Status: TERMINATED
┃ 
└─ 🌌 ${botName.toUpperCase()}`;
      await ctx.sock.sendMessage(ctx.jid, { text: output, edit: key });
    } else {
      const output = `┌──⌈ 🛡️ CLICK ⌋
┃ 
┃ Result: EMPTY CHAMBER
┃ Status: SURVIVED
┃ 
└─ 🌌 ${botName.toUpperCase()}`;
      await ctx.sock.sendMessage(ctx.jid, { text: output, edit: key });
    }
  }
};
