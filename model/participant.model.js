import mongoose from "mongoose";

const participantSchema = new mongoose.Schema(
    {
      name: { type: String, required: [true, "Name is required"] },
      email: { type: String, required: [true, "Email is required"], unique: true},
      phoneNumber: { type: String },
      fromTerna: { type: String},
      idCardUrl: { type: String }, // Store the Cloudinary file URL
      verified: { type: Date },
      qrCode: { type: String },
    },
    { timestamps: true }
  );
  

const virtual = participantSchema.virtual("id");
virtual.get(function () {
  return this._id;
});

participantSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const Participant = mongoose.model("Participant", participantSchema);
export default Participant;
