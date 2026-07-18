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

        const migrationsPath = path.join(__dirname, "../src/Database");

        const files = fs
            .readdirSync(migrationsPath)
            .filter(file => file.endsWith(".sql"))
            .sort();

        for (const file of files) {
            console.log(`Running ${file}...`);

            const sql = fs.readFileSync(
                path.join(migrationsPath, file),
                "utf8"
            );

            await connection.query(sql);

            console.log(` ${file} completed`);
        }

        console.log("\n Database migration completed successfully.");
    } catch (error) {
        console.error(" Migration failed:");
        console.error(error.message);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

migrate();