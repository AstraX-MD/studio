/**
 * @fileOverview Simple unit converter.
 */
export default {
  name: "unit",
  category: "tools",
  description: "Convert units (length/weight).",
  usage: "unit <val> <from> <to>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    const val = parseFloat(args[0]);
    const from = args[1]?.toLowerCase();
    const to = args[2]?.toLowerCase();

    if (!val || !from || !to) return ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Use: ${prefix}unit 100 km mi\n└────────────────`);

    // Simple converter logic
    const conversions = {
      'km-mi': 0.621371,
      'mi-km': 1.60934,
      'kg-lb': 2.20462,
      'lb-kg': 0.453592
    };

    const key = `${from}-${to}`;
    const rate = conversions[key];

    if (!rate) return ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Unsupported conversion.\n┃ Try: km, mi, kg, lb\n└────────────────`);

    const result = (val * rate).toFixed(2);
    const output = `┌──⌈ 📏 UNIT CONV ⌋
┃ Input: ${val} ${from}
┃ Output: ${result} ${to}
┃ Rate: ${rate}
└────────────────`;
    ctx.reply(output);
  }
};