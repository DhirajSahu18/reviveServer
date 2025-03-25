import express from "express";
import Participant from "../model/participant.model.js";
import {
  generateQRCode,
  sendQRCodeToEmail,
  generateRandomCode,
} from "../utils/util.js"; // Extract reusable logic
import {
  deleteParticipant,
  getAllParticipants,
} from "../controller/Participant.controller.js";
import multer from "multer";
import cloudinary from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const router = express.Router();
// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: 'djmyuk3pc',
  api_key: '265523133151115',
  api_secret: 'zYGvqtveokYHOvtTpu8GfzxfT5s',
});

// Set up multer storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: "aadhar_uploads", // Change folder name as needed
    allowedFormats: ["jpg", "jpeg", "png", "pdf"],
    resource_type: "auto",
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1 * 1024 * 1024 }, // 1MB limit
});

router.post("/", upload.single("idFile"), async (req, res) => {
  try {
    const { name, phone, email, fromTerna } = req.body;

    if (!(name && phone && email)) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "ID Card upload is required" });
    }

    const participant = new Participant({
      name,
      phoneNumber: phone,
      email,
      fromTerna,
      idCardUrl: req.file.path, // Store Cloudinary URL
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

router.delete("/:id", deleteParticipant);

export default router;
