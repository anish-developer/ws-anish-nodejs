const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    pollId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Poll",
    },

    optionId: {
      type: mongoose.Schema.Types.ObjectId,
    },

    energy: {
      type: Number,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Vote", voteSchema);
