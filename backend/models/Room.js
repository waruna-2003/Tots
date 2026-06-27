const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true
  },

  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thought"
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports =
  mongoose.model(
    "Room",
    roomSchema
  );