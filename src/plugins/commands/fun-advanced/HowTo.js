/**
 * @fileOverview Ridiculous tutorial generator.
 */
export default {
  name: "howto",
  category: "fun-advanced",
  description: "Get funny instructions for impossible tasks.",
  usage: "howto <task>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const task = args.join(' ');
    if (!task) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ What do you want to learn?\n└────────────────");

    const steps = [
      "1. Drink 5 gallons of coffee.",
      "2. Ask a random cat for permission.",
      "3. Perform a ritual dance in the rain.",
      "4. Type 'Sigma' 42 times in the chat.",
      "5. Profit ???"
    ];

    const output = `┌──⌈ 🎓 HOW TO: ${task.toUpperCase()} ⌋
┃ 
${steps.join('\n┃ ')}
┃ 
├─⊷ Difficulty: EXTREME
├─⊷ Success Rate: 0.01%
┃ 
└────────────────
  © ${botName.toUpperCase()}`;

    ctx.reply(output);
  }
};
