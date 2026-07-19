const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");
require("dotenv").config();

async function migrate() {
    let connection;

    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log("Connected to MySQL");

        // Create migrations table if it doesn't exist
        await connection.query(`
            CREATE TABLE IF NOT EXISTS migrations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                migration_name VARCHAR(255) UNIQUE NOT NULL,
                executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        const migrationsPath = path.join(__dirname, "../src/Database");

        const files = fs
            .readdirSync(migrationsPath)
            .filter(file => file.endsWith(".sql"))
            .sort();

        for (const file of files) {

            // Check if migration already ran
            const [rows] = await connection.query(
                "SELECT * FROM migrations WHERE migration_name = ?",
                [file]
            );

            if (rows.length > 0) {
                console.log(`Skipping ${file}`);
                continue;
            }

            console.log(`Running ${file}...`);

            const sql = fs.readFileSync(
                path.join(migrationsPath, file),
                "utf8"
            );

            await connection.query(sql);

            await connection.query(
                "INSERT INTO migrations (migration_name) VALUES (?)",
                [file]
            );

            console.log(`${file} completed`);
        }

        console.log("\nDatabase migration completed successfully.");
    } catch (error) {
        console.error("\nMigration failed:");
        console.error(error.message);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

migrate();