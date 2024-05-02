import "dotenv/config"
import mysql from "mysql2";


const config = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};


const db = mysql.createPool(config).promise();

export default db;