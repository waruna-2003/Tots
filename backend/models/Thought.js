const mongoose = require("mongoose");

const thoughtSchema =
  new mongoose.Schema({

    text: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: [
        "waiting",
        "matched"
      ],
      default: "waiting"
    },

    roomId: {
      type: String,
      default: null
    },

    createdAt: {
      type: Date,
      default: Date.now
    }
  });

module.exports =
  mongoose.model(
    "Thought",
    thoughtSchema
  );