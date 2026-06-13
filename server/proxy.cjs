require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));

const REMOTE_RPC = "https://casper-testnet.public.blastapi.io/rpc";

app.post("/rpc", async (req, res) => {
  try {
    const response = await axios.post(REMOTE_RPC, req.body, {
      headers: { "Content-Type": "application/json" },
      timeout: 10000,
    });
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error("Proxy RPC error", err?.toString());
    if (err.response) {
      res.status(err.response.status).json(err.response.data);
    } else {
      res.status(500).json({ error: "proxy_error", message: String(err) });
    }
  }
});

app.post("/ai", async (req, res) => {
  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      req.body,
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      },
    );
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error("Proxy AI error", err?.toString());
    if (err.response) {
      res.status(err.response.status).json(err.response.data);
    } else {
      res.status(500).json({ error: "proxy_error", message: String(err) });
    }
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Casper RPC proxy listening on http://localhost:${PORT}/rpc`);
});
