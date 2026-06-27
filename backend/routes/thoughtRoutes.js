const express = require("express");

const router = express.Router();

const {
  submitThought
} = require("../controllers/thoughtController");

router.post("/", submitThought);

module.exports = router;