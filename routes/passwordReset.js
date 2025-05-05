const express = require("express");
const router = express.Router();

const { getUserByEmail } = require("../models/passwordReset");
const sendPasswordResetEmail = require("../utils/passwordReset");

router.get("/", async (req, res) => {
  const { email } = req.body;

  try {
    const result = await getUserByEmail(email);

    if (result.status != 404) {
      activationLink = "https://doneitapp.netlify.app/";
      const name = result.data.name;

      await sendPasswordResetEmail(email, name, activationLink);
      res.status(200).json({
        message: "User Data sent Successfully",
        user: result,
      });
    } else {
      res.status(400).json({
        message: "User Data not found",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
