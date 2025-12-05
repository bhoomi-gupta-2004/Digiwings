const postgres = require("postgres");

let sql;

const connectDB = async () => {
  try {
    const connectionString = process.env.DATABASE_URL;

    sql = postgres(connectionString, {
      ssl: { rejectUnauthorized: false },
      host: connectionString.split("@")[1].split(":")[0], // force host from connection string
      family: 4 // IPv4
    });

    await sql`SELECT NOW()`;
    console.log("Database connected");

    return sql;
  } catch (err) {
    console.error("Database connection error:", err);
    process.exit(1);
  }
};

const getDB = () => sql;

module.exports = { connectDB, getDB };
