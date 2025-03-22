import express from "express";
import Participant from "../model/participant.model.js";
import {
  generateQRCode,
  sendQRCodeToEmail,
  generateRandomCode,
} from "../utils/util.js"; // Extract reusable logic
import { deleteParticipant, getAllParticipants } from "../controller/Participant.controller.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, phone, email, fromTerna, idNumber } = req.body;

    if (!(name && phone && email && idNumber)) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const participant = new Participant({
      name,
      phoneNumber : phone,
      email,
      fromTerna,
      idNumber,
    });

    const saved = await participant.save();

    const code = generateRandomCode();
    saved.qrCode = code;
    await saved.save();

    const qrCodeData = await generateQRCode(`${saved._id}-${code}`);
    await sendQRCodeToEmail(saved.email, qrCodeData);

    res.status(201).json({ message: "Participant registered and email sent!" });
  } catch (error) {
    console.error("Registration Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/", getAllParticipants);

router.delete("/:id" , deleteParticipant)

export default router;
