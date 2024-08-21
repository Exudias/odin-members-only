const db = require("../db/queries");

async function authorFromUserId(id)
{
    const user = await db.getUserById(id);

    if (!user.first_name && !user.last_name)
    {
        return user.username;
    }

    return user.first_name + " " + user.last_name;
}

module.exports = authorFromUserId;