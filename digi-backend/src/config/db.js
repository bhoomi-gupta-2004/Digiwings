const postgres = require("postgres");

let sql; // shared db instance

const connectDB = async () => {
  try {
    const connectionString = process.env.DATABASE_URL;

    sql = postgres(connectionString, {
      ssl: {
        rejectUnauthorized: false // important for Supabase on cloud
      }
    });

    await sql`SELECT NOW()`;
    console.log("Database connected");

    return sql;
  } catch (err) {
    console.error("Database connection error:", err);
    process.exit(1); // optional: stop server if DB fails
  }
};

const getDB = () => sql;

module.exports = { connectDB, getDB };
