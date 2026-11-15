import mongoose, { Schema, Document } from "mongoose";

interface IOAuthTicket extends Document {
  tokenHash: string;
  user: mongoose.Types.ObjectId;
  expiresAt: Date;
}

const OAuthTicketSchema = new Schema<IOAuthTicket>(
  {
    tokenHash: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

// Expiration is also checked in the exchange query because MongoDB TTL cleanup is asynchronous.
OAuthTicketSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<IOAuthTicket>("OAuthTicket", OAuthTicketSchema);
