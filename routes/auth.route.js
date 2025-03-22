import express from "express";
import { Login, Signup } from "../controller/auth.controller.js";
import User from "../model/user.model.js";
const router = express.Router();

router.post("/signup", Signup);
router.post("/login", Login);
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
