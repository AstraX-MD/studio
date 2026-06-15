/**
 * @fileOverview Earn money through simulated labor.
 */
export default {
  name: "work",
  category: "economy",
  description: "Perform a job to earn quick cash.",
  usage: "work",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const userId = ctx.sender.split('@')[0];
    const economy = await ctx.bot.db.get('economy', userId) || { wallet: 0, bank: 0, lastWork: 0 };

    const now = Date.now();
    const cooldown = 10 * 60 * 1000; // 10 Minutes

    if (now - economy.lastWork < cooldown) {
      const remaining = Math.ceil((cooldown - (now - economy.lastWork)) / 60000);
      return ctx.reply(`┌──⌈ ⚠️ EXHAUSTED ⌋\n┃ \n┃ You are tired. \n┃ Rest for ${remaining} more mins.\n└────────────────`);
    }

    const jobs = [
      { name: "Software Engineer", pay: 1200 },
      { name: "Burger Flipper", pay: 450 },
      { name: "Crypto Miner", pay: 2000 },
      { name: "Graphic Designer", pay: 800 },
      { name: "Bot Developer", pay: 5000 }
    ];

    const job = jobs[Math.floor(Math.random() * jobs.length)];
    economy.wallet += job.pay;
    economy.lastWork = now;
    await ctx.bot.db.set('economy', userId, economy);

    const output = `┌──⌈ 💼 LABOR REPORT ⌋
┃ 
┃ Job: ${job.name}
┃ Salary: $${job.pay.toLocaleString()}
┃ Status: PAID
┃ 
└─ 🌌 ${botName.toUpperCase()}`;
    ctx.reply(output);
  }
};
