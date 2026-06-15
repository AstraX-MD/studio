/**
 * @fileOverview Convert text into stylish fonts.
 */
export default {
  name: "fancy",
  aliases: ["style", "font"],
  category: "tools",
  description: "Transform standard text into stylish, fancy fonts.",
  usage: "fancy <text>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const text = args.join(' ');
    if (!text) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Provide text to style.\n└────────────────");

    // Sample mapping for Script font
    const map = {
        'a': '𝓪', 'b': 'Y', 'c': '𝓬', 'd': '𝓭', 'e': '𝓮', 'f': '𝓯', 'g': '𝓰', 'h': '𝓱', 'i': '𝓲', 'j': '𝓳', 'k': '𝓴', 'l': '𝓵', 'm': '𝓶',
        'n': '𝓷', 'o': '𝓸', 'p': '𝓹', 'q': '𝓺', 'r': '𝓻', 's': '𝓼', 't': '𝓽', 'u': '𝓾', 'v': '𝓿', 'w': '𝔀', 'x': '𝔁', 'y': '𝔂', 'z': '𝔃'
    };

    const styled = text.toLowerCase().split('').map(c => map[c] || c).join('');

    const output = `┌──⌈ ✍️ FANCY TEXT ⌋
┃
┃ Original: ${text}
┃ Styled: ${styled}
┃
└────────────────
  © ${botName.toUpperCase()}`;

    ctx.reply(output);
  }
};
