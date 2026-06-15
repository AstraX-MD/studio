/**
 * @fileOverview Daily RPG challenges for XP.
 */
export default {
  name: "dailyquest",
  aliases: ["quest", "task"],
  category: "rpg-levelling",
  description: "Receive a random daily quest for bonus XP.",
  usage: "dailyquest",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const quests = [
      "Send 50 messages in this group.",
      "Win 3 games of Tic-Tac-Toe.",
      "Successfully rob 2 people.",
      "Earn $10,000 via !work.",
      "Identify 5 songs using !shazam."
    ];

    const quest = quests[Math.floor(Math.random() * quests.length)];

    const output = `┌──⌈ 📜 DAILY QUEST ⌋
┃ 
┃ Task: ${quest}
┃ Reward: +2,500 XP
┃ Status: ASSIGNED
┃ 
┃ Finish the task to 
┃ claim your reward!
└────────────────
  © ${botName.toUpperCase()}`;

    ctx.reply(output);
  }
};
