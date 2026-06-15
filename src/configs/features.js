/**
 * @fileOverview Toggleable automation modules and their default behaviors.
 */
export default {
  security: {
    antiLink: {
      enabled: true,
      action: 'kick', // options: kick, warn, delete
      ignoreAdmins: true
    },
    antiSpam: {
      enabled: true,
      threshold: 5, // messages
      interval: 10000, // per 10 seconds
      action: 'mute'
    },
    antiDelete: {
      enabled: false,
      logToAdmin: true
    },
    antiBot: {
      enabled: true,
      action: 'kick'
    }
  },
  automation: {
    welcome: {
      enabled: true,
      message: 'Hello @user, welcome to @group!',
    },
    goodbye: {
      enabled: true,
      message: 'Goodbye @user, we will miss you.'
    },
    autoReact: {
      enabled: false,
      emojis: ['🔥', '❤️', '✅']
    }
  }
};
