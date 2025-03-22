import express from "express";
import Entry from "../model/entry.model.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const Entries = await Entry.find({}).populate(["admin", "participant"]);
    if (!Entries.length > 0) {
      return res.status(404).json({ message: "No entries found" });
    }
    res.status(200).json({ Entries });
  } catch (error) {
    console.log(" Error Fetching all entries :", error?.message);
    res.status(500).json({ message: "Internal Server error" });
  }
});

export default router;
