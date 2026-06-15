/**
 * @fileOverview Browse available job tiers for the labor system.
 */
export default {
  name: "jobs",
  aliases: ["jobcenter", "careers"],
  category: "economy",
  description: "View available jobs and their respective salaries.",
  usage: "jobs",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    
    const output = `┌──⌈ 💼 JOB CENTER ⌋
┃ 
├─ 👨‍🍳 Burger Flipper
┃    Wage: $450
├─ 🎨 Graphic Designer
┃    Wage: $800
├─ 💻 Software Engineer
┃    Wage: $1,200
├─ ⛏️ Crypto Miner
┃    Wage: $2,000
├─ 👑 Bot Developer
┃    Wage: $5,000
┃
┃ Tip: Use !work to start 
┃ your shift.
└────────────────
  © ${botName.toUpperCase()}`;

    ctx.reply(output);
  }
};
