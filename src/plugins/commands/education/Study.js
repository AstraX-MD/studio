/**
 * @fileOverview Pomodoro Study Timer.
 */
export default {
  name: "study",
  category: "education",
  description: "Start a professional Pomodoro study session.",
  usage: "study start",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    
    const output = `┌──⌈ ⏱️ STUDY TIMER ⌋
┃
┃ Session: POMODORO
┃ Work: 25 Minutes
┃ Break: 5 Minutes
┃ Status: ACTIVE
┃
┃ Focus hard. I will notify
┃ you when your session ends.
└────────────────
  © ${botName.toUpperCase()}`;
    
    ctx.reply(output);
  }
};
