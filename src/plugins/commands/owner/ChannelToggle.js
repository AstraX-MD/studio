/**
 * @fileOverview Toggle the Channel Forwarding context.
 */
export default {
  name: "channelforward",
  aliases: ["cf", "forwardmode"],
  category: "owner",
  description: "Enable or disable the 'Forwarded from Channel' style for bot replies.",
  usage: "channelforward <on/off>",
  permissions: 9,
  execute: async (ctx, args) => {
    const botName = await ctx.db.get('botname') || "AstraX";
    const mode = args[0]?.toLowerCase();

    if (mode === 'on' || mode === 'off') {
      const state = mode === 'on';
      await ctx.db.set('channelEnabled', state);
      
      const output = `┌──⌈ 📢 CHANNEL MODE ⌋
┃
┃ Status: ${state ? '✅ ENABLED' : '❌ DISABLED'}
┃ Source: ASTRAX UPDATES
┃ Effect: GLOBAL FORWARD
┃
├─⊷ On: All msgs appear forwarded
├─⊷ Off: Normal messaging mode
┃
└────────────────
  © ${botName.toUpperCase()}`;
      
      return ctx.reply(output);
    }

    const current = await ctx.db.get('channelEnabled');
    ctx.reply(`┌──⌈ ⚙️ CONFIG ⌋\n┃\n┃ Channel Context: ${current !== false ? 'ON' : 'OFF'}\n┃ Usage: !channelforward off\n└────────────────`);
  }
};
