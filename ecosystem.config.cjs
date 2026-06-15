module.exports = {
  apps: [{
    name: 'astrax-enterprise',
    script: 'src/core/Bootstrap.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      DATABASE_TYPE: 'json'
    },
    env_production: {
      NODE_ENV: 'production',
      DATABASE_TYPE: 'firebase'
    }
  }]
};
