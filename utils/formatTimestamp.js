function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();

    // Function to pad single digit numbers with a leading zero
    const pad = (n) => n.toString().padStart(2, '0');

    // Check if the date is today
    const isToday =
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

    if (isToday) {
        // Format as "Today at XX:XX"
        return `Today at ${pad(date.getHours())}:${pad(date.getMinutes())}`;
    } else {
        // Format as "DD/MM/YYYY"
        return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
    }
}

module.exports = formatTimestamp;