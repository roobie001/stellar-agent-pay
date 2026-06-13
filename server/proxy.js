const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));

const REMOTE_RPC = "https://rpc.testnet.casperlabs.io/rpc";

app.post("/rpc", async (req, res) => {
  try {
    const response = await axios.post(REMOTE_RPC, req.body, {
      headers: { "Content-Type": "application/json" },
      timeout: 20000,
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Casper RPC proxy listening on http://localhost:${PORT}/rpc`);
});
