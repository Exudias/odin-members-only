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

async function getUserById(id)
{
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]); 
    return rows[0];
}

module.exports = {
    getAllUsers,
    getAllMessages,
    getUserById,
}