const Thought =
  require("../models/Thought");

const Room =
  require("../models/Room");

const {
  v4: uuidv4
} = require("uuid");

const submitThought =
  async (req, res) => {

    try {

      const text =
        req.body.text;

      // Find oldest waiting user
      const waitingThought =
        await Thought.findOne({
          status: "waiting"
        });

      // No waiting users
      if (!waitingThought) {

        const newThought =
          await Thought.create({
            text
          });

        return res.json({
          matched: false,
          thoughtId:
            newThought._id
        });
      }

      // Don't match with self
      if (
        waitingThought.text === text
      ) {

        const newThought =
          await Thought.create({
            text
          });

        return res.json({
          matched: false
        });
      }

      const roomId =
        uuidv4();

      waitingThought.status =
        "matched";

      waitingThought.roomId =
        roomId;

      await waitingThought.save();

      const newThought =
        await Thought.create({
          text,
          status: "matched",
          roomId
        });

      await Room.create({
        roomId,

        users: [
          waitingThought._id,
          newThought._id
        ]
      });

      return res.json({
        matched: true,

        roomId,

        partnerThought:
          waitingThought.text
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message:
          error.message
      });

    }
  };

module.exports = {
  submitThought
};