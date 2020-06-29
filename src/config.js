module.exports = {
  PORT: process.env.PORT || 8080,
  NODE_ENV: process.env.NODE_ENV || 'development',
  API_TOKEN: process.env.API_TOKEN || 'my-secret',
  JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret',
};