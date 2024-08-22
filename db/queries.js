const pool = require("./pool");

async function getAllUsers()
{   
    const { rows } = await pool.query("SELECT * FROM users");
    return rows;
}

async function getAllMessages()
{
    const { rows } = await pool.query("SELECT * FROM messages ORDER BY timestamp DESC");
    return rows;
}

async function getUserById(id)
{
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]); 
    return rows[0];
}

async function makeUserMember(id)
{
    await pool.query("UPDATE users SET member_status = TRUE WHERE id = $1", [id]);
}

async function createMessage(title, text, id)
{
    await pool.query(
        "INSERT INTO messages (title, text, user_id) VALUES ($1, $2, $3)", 
        [
            title,
            text,
            id,
        ]
    );
}

async function createUser(username, password, first_name, last_name)
{
    await pool.query(
        "INSERT INTO users (username, password, first_name, last_name) VALUES ($1, $2, $3, $4)", 
        [
            username,
            password,
            first_name,
            last_name,
        ]
    );
}

module.exports = {
    getAllUsers,
    getAllMessages,
    getUserById,
    makeUserMember,
    createMessage,
    createUser,
}