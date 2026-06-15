/**
 * @fileOverview Owner contact information.
 */

export default {
  name: "owner",
  category: "utility",
  description: "Show contact information for the bot developer.",
  usage: "!owner",
  cooldown: 5,
  permissions: 1, // USER
  execute: async (ctx) => {
    const owners = ctx.bot.config.owners;
    const vcard = 'BEGIN:VCARD\n' 
                + 'VERSION:3.0\n' 
                + `FN:AstraX Owner\n` 
                + `TEL;type=CELL;type=VOICE;waid=${owners[0]}:+${owners[0]}\n` 
                + 'END:VCARD';

    await ctx.sock.sendMessage(ctx.jid, {
      contacts: {
        displayName: 'AstraRoot',
        contacts: [{ vcard }]
      }
    }, { quoted: ctx.msg });
    
    await ctx.reply(`Contacting the *AstraX Root Administrator*...`);
  }
};
