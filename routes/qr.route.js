import express from "express";
import Participant from "../model/participant.model.js";
import Entry from "../model/entry.model.js";
import { qrToAll, sendPersonal } from "../controller/qr.controller.js";

const router = express.Router();

router.post("/verify", async (req, res) => {
  try {
    const body = req.body.data;
    const admin = req.body.admin;
    if (!(admin && body)) {
      return res.status(402).json({ message: "Data not complete" });
    }
    const [id, code] = body.split("-");
    const participant = await Participant.findById(id);
    if (!participant) {
      return res.status(404).json({ message: "No Such User" });
    }

    if (!(participant?.qrCode === code)) {
      return res.status(404).json({ message: "Code Does not match" });
    }

    const timeDiff = Date.now() - participant.verified;
    const timeDiffinMin = timeDiff / (1000 * 60);
    console.log(timeDiffinMin);

    if (timeDiffinMin < 12 * 60) {
      return res.status(401).json({ message: "Qr Code already been Scanned" });
    }

    participant.verified = Date.now();
    await participant.save();

    const newEntry = new Entry({ participant: participant.id, admin: admin });
    await newEntry.save();
    res
      .status(200)
      .json({ message: "Verification Successful", user: participant });
  } catch (error) {
    console.log("Error in verifying QR", error?.message);
    res.status(500).json({ message: "User not found" });
  }
});

router.post('/generateQr' , qrToAll)
router.post('/sendPersonal' , sendPersonal)

export default router;
