export default () => ({
  jwt_secret: process.env.JWT_SECRET,
  // port: parseInt(process.env.PORT, 10) || 3000,
  // database: {
  //   type: process.env.DATABASE_TYPE,
  //   host: process.env.DATABASE_HOST,
  //   port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  //   username: process.env.DATABASE_USER,
  //   password: process.env.DATABASE_PASSWORD,
  //   database: process.env.DATABASE_NAME,
  //   schema: process.env.DATABASE_SCHEMA,
  // },
});
