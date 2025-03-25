
import Entry from "../model/entry.model.js";
import Participant from "../model/participant.model.js";
import {
  generateRandomCode,
  generateQRCode,
  sendQRCodeToEmail,
} from "../utils/util.js";

const verifyQr = async (req, res) => {
  try {
    const { data: body, admin } = req.body;

    if (!(admin && body)) {
      return res.status(402).json({ message: "Data not complete" });
    }

    const [id, code] = body.split("-");
    const participant = await Participant.findById(id);

    if (!participant) {
      return res.status(404).json({ message: "No Such User" });
    }

    if (participant.qrCode !== code) {
      return res.status(404).json({ message: "Code does not match" });
    }

    const timeDiffInMinutes = (Date.now() - participant.verified) / (1000 * 60);
    if (timeDiffInMinutes < 12 * 60) {
      return res.status(401).json({ message: "QR Code already scanned" });
    }

    participant.verified = Date.now();
    await participant.save();

    const newEntry = new Entry({ participant: participant._id, admin });
    await newEntry.save();

    res
      .status(200)
      .json({ message: "Verification Successful", user: participant });
  } catch (error) {
    console.error("Error in verifying QR", error?.message);
    res.status(500).json({ message: "Server error" });
  }
};

const qrToAll = async (req, res) => {
  try {
    const participants = await Participant.find({});

    for (const participant of participants) {
      const code = generateRandomCode();
      participant.qrCode = code;
      await participant.save();

      const qrData = await generateQRCode(`${participant._id}-${code}`);
      await sendQRCodeToEmail(participant.email, qrData);
    }

    res.status(200).json({ message: "QR codes sent successfully!" });
  } catch (error) {
    console.error("Error sending bulk QR", error?.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const sendPersonal = async (req, res) => {
  try {
    const { id } = req.body;
    const code = generateRandomCode();

    const participant = await Participant.findByIdAndUpdate(
      id,
      { qrCode: code },
      { new: true }
    );

    const qrData = await generateQRCode(`${id}-${code}`);
    await sendQRCodeToEmail(participant.email, qrData);

    res.status(200).json({ message: "QR code sent successfully!" });
  } catch (error) {
    console.error("Error sending personal QR", error?.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { verifyQr, qrToAll, sendPersonal };
