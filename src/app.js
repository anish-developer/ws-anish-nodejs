const express = require("express");

const cors = require("cors");

const authRoutes = require("./routes/auth.routes");

const pollRoutes = require("./routes/poll.routes");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/polls", pollRoutes);

module.exports = app;
