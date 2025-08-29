const mysql = require("mysql2/promise");

class Database {
  constructor() {
    this.pool = null;
  }

  async initialize() {
    try {
      const tempConn = await mysql.createConnection({
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "password",
      });
      
      await tempConn.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || "flutter_api_db"}`);
      await tempConn.end();

      this.pool = mysql.createPool({
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "password",
        database: process.env.DB_NAME || "flutter_api_db",
        waitForConnections: true,
        connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
        queueLimit: 0,
      });

      await this.createTables();
      console.log("Connected to MySQL and initialized tables.");
    } catch (error) {
      console.error("Database init error:", error);
      throw error;
    }
  }

  async createTables() {
    await this.pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await this.pool.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        quantity INT NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
  }

  getPool() {
    return this.pool;
  }

  async close() {
    if (this.pool && this.pool.end) {
      await this.pool.end();
    }
  }
}

module.exports = Database;