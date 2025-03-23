const environment = {
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRE: process.env.JWT_EXPIRE || '24h',
    MONGODB_URI: process.env.MONGODB_URI,
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || 'development'
};

module.exports = environment;
