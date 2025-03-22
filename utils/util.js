import qrCode from "qrcode";
import nodemailer from "nodemailer";

// ✅ Generate a random 6-digit code
function generateRandomCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ✅ Generate a QR Code from a string
async function generateQRCode(data) {
  return new Promise((resolve, reject) => {
    qrCode.toDataURL(data, (err, url) => {
      if (err) reject(err);
      else resolve(url);
    });
  });
}

// ✅ Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "dhirajksahu01@gmail.com",
    pass: "brqa xvnw zxaa nmbp", // Use Gmail App Password
  },
});

// ✅ Function to send the QR Code via Email
async function sendQRCodeToEmail(email, qrCodeData) {
  const mailOptions = {
    from: "Revive Fest <your_email@gmail.com>",
    to: email,
    subject: "Your Revive Festive QR Code 🎉",
    attachments: [
      {
        filename: "ReviveQR.jpg",
        content: Buffer.from(qrCodeData.split("base64,")[1], "base64"),
        encoding: "base64",
      },
    ],
    html: `
    <div style="font-family: Arial, sans-serif; color: #222; background-color: #fff; padding: 20px; line-height: 1.6;">
  <h2 style="color: #d32f2f; border-bottom: 2px solid #d32f2f; padding-bottom: 5px;">
    TERMS AND CONDITIONS FOR CONCERT REGISTRATION
  </h2>
  
  <p>By registering for this concert, you acknowledge and agree to the following strict terms and conditions. Failure to comply will result in immediate action, including denial of entry, removal from the event, or legal consequences.</p>

  <h3 style="color: #000;">1. <u>TICKET & ENTRY POLICY</u></h3>
  <ul>
    <li>Entry is strictly <strong>by valid ticket/registration confirmation</strong> only. No exceptions.</li>
    <li><strong>No re-entry is allowed</strong> once you leave the venue.</li>
    <li>Attendees <strong>must carry a valid government-issued ID/valid college ID</strong> for verification.</li>
    <li><strong>Tickets are non-refundable and cannot be resold</strong>. Anyone found reselling or using fake tickets will face legal action.</li>
    <li><strong>Latecomers may not be allowed entry</strong>. Arrive on time.</li>
  </ul>

  <h3 style="color: #000;">2. <u>STRICT CODE OF CONDUCT</u></h3>
  <ul>
    <li><strong>Zero tolerance for misconduct</strong>. Any act of violence, harassment, intoxication, or disruption will lead to immediate expulsion and a permanent ban from future events.</li>
    <li><strong>Follow all instructions</strong> from event staff and security at all times.</li>
    <li><strong>No smoking, drugs, or alcohol</strong> inside the venue. Violators will be handed over to law enforcement.</li>
    <li><strong>Vandalism or damage to property</strong> will result in legal action and financial penalties.</li>
  </ul>

  <h3 style="color: #000;">3. <u>SECURITY & PROHIBITED ITEMS</u></h3>
  <ul>
    <li><strong>Mandatory security checks</strong> at entry. Bag checks, frisking, and screenings are required for all attendees.</li>
    <li><strong>Prohibited items include</strong> (but are not limited to):</li>
    <ul style="list-style-type: circle; padding-left: 20px;">
      <li>Alcohol, drugs, and illegal substances</li>
      <li>Weapons or sharp objects of any kind</li>
      <li>Outside food or beverages</li>
      <li>Large bags, backpacks, and professional cameras (unless authorized)</li>
      <li>Any item deemed dangerous by event security</li>
    </ul>
    <li>The organizers reserve the right to <strong>confiscate prohibited items</strong> or deny entry to anyone carrying them.</li>
  </ul>

  <h3 style="color: #000;">4. <u>LIABILITY & RESPONSIBILITY</u></h3>
  <ul>
    <li><strong>Attendees are responsible for their personal belongings</strong>. The organizers are not liable for lost, stolen, or damaged items.</li>
    <li><strong>Attending is at your own risk</strong>. Organizers are not responsible for any injury, illness, or damage sustained during the event.</li>
    <li>Any attendee violating safety norms will be <strong>immediately removed</strong> and may face legal consequences.</li>
  </ul>

  <h3 style="color: #000;">5. <u>EVENT CHANGES & CANCELLATION</u></h3>
  <ul>
    <li>The event schedule is subject to change without prior notice.</li>
    <li>The organizers <strong>reserve the right to deny entry or remove any attendee</strong> at their discretion without refund.</li>
  </ul>

  <h3 style="color: #000;">6. <u>AGE RESTRICTIONS</u></h3>
  <ul>
    <li>Minors must be accompanied by an adult at all times.</li>
    <li>Any specified age restrictions must be strictly followed.</li>
  </ul>

  <h3 style="color: #000;">7. <u>LEGAL ACTION & ENFORCEMENT</u></h3>
  <ul>
    <li>Violation of any terms may result in <strong>immediate expulsion, blacklisting, and legal action</strong>.</li>
    <li><strong>By registering, you legally acknowledge and accept</strong> all terms and conditions stated above.</li>
  </ul>
</div>

    `,
  };

  return transporter.sendMail(mailOptions);
}

export { generateRandomCode, generateQRCode, sendQRCodeToEmail };
