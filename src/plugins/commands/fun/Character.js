/**
 * @fileOverview Generate a random character profile for a user.
 */
export default {
  name: "character",
  aliases: ["traits"],
  category: "fun",
  description: "Generate random character traits for a user.",
  usage: "character <tag/reply>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    let target = ctx.msg.message?.extendedTextMessage?.contextInfo?.participant || 
                 ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || 
                 ctx.sender;

    const traits = ['Loyal', 'Deceptive', 'Heroic', 'Clumsy', 'Genius', 'Lazy', 'Fearless', 'Greedy'];
    const alignment = ['Lawful Good', 'Neutral Evil', 'Chaotic Neutral', 'True Neutral', 'Chaotic Good'];
    const weapon = ['Katana', 'Keyboard', 'Sarcasm', 'Magic Wand', 'Shield', 'Laser Pointer'];

    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

    const output = `┌──⌈ 🎭 CHARACTER ⌋
┃ Target: @${target.split('@')[0]}
┃ 
├─ Trait: ${pick(traits)}
├─ Align: ${pick(alignment)}
├─ Weapon: ${pick(weapon)}
┃ 
└─ 🌌 ${botName.toUpperCase()}`;

    await ctx.sock.sendMessage(ctx.jid, { text: output, mentions: [target] });
  }
};
