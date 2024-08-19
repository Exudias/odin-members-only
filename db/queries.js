const pool = require("./pool");

async function getAllUsers()
{   
    const { rows } = await pool.query("SELECT * FROM users");
    return rows;
}

async function getAllMessages()
{
    const { rows } = await pool.query("SELECT * FROM messages");
    return rows;
}

module.exports = {
    getAllUsers,
    getAllMessages,
}