#! /usr/bin/env node

const { Client } = require("pg");
require('dotenv').config();

const CREATE_SQL = `
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR (255) NOT NULL UNIQUE,
    password VARCHAR (255) NOT NULL,
    first_name VARCHAR (255),
    last_name VARCHAR (255),
    member_status BOOLEAN DEFAULT FALSE,
    admin BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    title VARCHAR (255) NOT NULL,
    text TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
`;

async function main() {
    const environment = process.env.ENVIRONMENT || 'local';
    const connectionString = environment === 'prod'
        ? process.env.PROD_DATABASE_URL
        : process.env.LOCAL_DATABASE_URL;

    console.log("Seeding database...");
    const client = new Client({ connectionString });

    try 
    {
        await client.connect();

        // Create tables
        await client.query(CREATE_SQL);

        console.log("Database seeded successfully.");
    } 
    catch (err) 
    {
        console.error("Error seeding database:", err);
    } 
    finally 
    {
        await client.end();
        console.log("Connection closed.");
    }
}

main();