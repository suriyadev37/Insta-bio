
const axios = require("axios");

module.exports = async (req, res) => {
  // Allow the frontend (same domain) to call this safely
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, message } = req.body || {};

  if (!name || !message) {
    return res.status(400).json({ error: "Missing data" });
  }

  const BOT_TOKEN = process.env.BOT_TOKEN;
  const CHAT_ID = process.env.CHAT_ID;

  if (!BOT_TOKEN || !CHAT_ID) {
    console.error("Missing BOT_TOKEN or CHAT_ID environment variables");
    return res.status(500).json({ error: "Server not configured" });
  }

  try {
    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      chat_id: CHAT_ID,
      text: `💖 ${name}\n\n${message}\n\n⏰ ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Telegram Error:", error.response?.data || error.message);
    return res.status(500).json({ error: "Failed to send message" });
  }
};
