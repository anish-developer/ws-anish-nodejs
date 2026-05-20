const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const {
  getPolls,
  getPollById,
  votePoll,
} = require("../controllers/poll.controller");

router.get("/", authMiddleware, getPolls);

router.get("/:id", authMiddleware, getPollById);

router.post("/:id/vote", authMiddleware, votePoll);

module.exports = router;
