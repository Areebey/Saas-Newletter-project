// import mongoose from "mongoose";

// const { Schema } = mongoose;

// const membershipSchema = new Schema(
//   {
//     userId: {
//       type: String,
//     },
//     stripeCustomerId: {
//       type: String,
//     },
//     plan: {
//       type: String,
//     },
//   },
//   { timestamps: true }
// );

// const Membership = mongoose.models.Memberships || mongoose.model("Memberships", membershipSchema);
// export default Membership;

import mongoose, { Schema, Document } from "mongoose";

// Define an interface for TypeScript support
export interface IMembership extends Document {
  userId: string;
  stripeCustomerId?: string;
  plan?: string;
}

const MembershipSchema = new Schema<IMembership>(
  {
    userId: {
      type: String,
      required: true, // Ensure every membership is linked to a user
      unique: true, // Prevent duplicate memberships for the same user
    },
    stripeCustomerId: {
      type: String,
    },
    plan: {
      type: String,
      // enum: ["free", "basic", "premium"], // Example plan options (optional)
      // default: "free",
    },
  },
  { timestamps: true }
);

// Prevent re-declaration of the model
const Membership =
  mongoose.models.Membership || mongoose.model<IMembership>("Membership", MembershipSchema);

export default Membership;
