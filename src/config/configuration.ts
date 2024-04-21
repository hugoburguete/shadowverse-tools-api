export default () => ({
  database: {
    type: process.env.DATABASE_TYPE,
    host: process.env.DATABASE_HOST,
    db: process.env.DATABASE_DB,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
  },
  auth: {
    tokens: {
      access: {
        secret: process.env.ACCESS_JWT_SECRET,
        expiry: process.env.ACCESS_EXPIRY,
      },
      refresh: {
        secret: process.env.REFRESH_JWT_SECRET,
        expiry: process.env.REFRESH_EXPIRY,
      },
    },
  },
});
