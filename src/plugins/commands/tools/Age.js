/**
 * @fileOverview Calculate age from a birthdate.
 */
export default {
  name: "age",
  category: "tools",
  description: "Calculate age based on a birthdate (YYYY-MM-DD).",
  usage: "age <yyyy-mm-dd>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    const dobInput = args[0];
    if (!dobInput) return ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Use: ${prefix}age 1995-06-15\n└────────────────`);

    const dob = new Date(dobInput);
    if (isNaN(dob.getTime())) return ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Invalid date format. Use YYYY-MM-DD.\n└────────────────`);

    const diff = Date.now() - dob.getTime();
    const ageDate = new Date(diff);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);

    const output = `┌──⌈ 🎂 AGE CALC ⌋
┃ Birthdate: ${dob.toDateString()}
┃ Current Age: ${age} Years
┃ Status: Calculated
└────────────────`;
    ctx.reply(output);
  }
};