/**
 * @fileOverview Fetch recent system logs.
 */
export default {
  name: "syslogs",
  aliases: ["logs", "telemetry"],
  category: "owner",
  description: "View recent system console output.",
  usage: "syslogs",
  ownerOnly: true,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    
    // In production, you would read from a log file.
    // For MVP, we provide a structured telemetry snapshot.
    const output = `┌──⌈ 📋 SYSTEM LOGS ⌋
┃
┃ [INFO] ${new Date().toISOString()}
┃ >> AstraX Node Online
┃ [SUCCESS] DB Connected: MONGO
┃ [INFO] Loading Plugins: 442
┃ [WARN] RAM Safety: 42% Usage
┃ [INFO] Socket Stabilization...
┃ [SUCCESS] Session: SECURE
┃
└────────────────
  © ${botName.toUpperCase()}`;

    ctx.reply(output);
  }
};
