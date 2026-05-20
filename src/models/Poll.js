const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  imageUrl: {
    type: String,
    required: true,
  },
});

const pollSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    options: [optionSchema],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Poll", pollSchema);
