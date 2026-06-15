/**
 * @fileOverview Suite of 20+ Automated Owner Greetings.
 */
export default {
  name: "greetowner",
  aliases: ["gm", "gn", "ga", "ge", "helloowner"],
  category: "automation",
  description: "Generate professional greetings for the system administrator.",
  usage: "gm / ga / gn",
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const cmd = ctx.text.toLowerCase().split(' ')[0].replace('!', '');
    
    const greetings = {
      gm: [
        "Good morning, Root. Systems are nominal.",
        "Rise and shine! AstraX is ready for duty.",
        "Morning Boss. 142 new events logged overnight.",
        "System online. Good morning, Administrator.",
        "New day, new operations. Ready when you are."
      ],
      ga: [
        "Good afternoon. Afternoon maintenance complete.",
        "Peak hours approaching. Systems stable, Boss.",
        "Good afternoon, Chief. CPU load is optimal.",
        "Monitoring ongoing. Have a productive afternoon.",
        "Afternoon report: 0 threats detected."
      ],
      ge: [
        "Good evening. Switching to night-mode filters.",
        "Evening, Root. Traffic is steady.",
        "Warden Guard is at 100% for the night shift.",
        "Good evening, Boss. Today was a success.",
        "Scanning the horizon. Evening logs look clean."
      ],
      gn: [
        "Good night. I will guard the node while you rest.",
        "Switching to deep-monitoring. Sleep well.",
        "Good night, Boss. AstraX is on watch.",
        "Rest easy. Firewall is impenetrable.",
        "Node standing by. Good night, Administrator."
      ]
    };

    const type = cmd === 'gm' ? 'gm' : cmd === 'ga' ? 'ga' : cmd === 'gn' ? 'gn' : 'ge';
    const pool = greetings[type] || greetings.ge;
    const pick = pool[Math.floor(Math.random() * pool.length)];

    const output = `┌──⌈ 🌅 GREETING ⌋
┃ 
┃ ${pick}
┃ Status: SECURE
┃ 
└─ 🌌 ${botName.toUpperCase()}`;

    ctx.reply(output);
  }
};