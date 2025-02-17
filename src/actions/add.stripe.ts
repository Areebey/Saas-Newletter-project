// "use server";

// import Membership from "@/models/membership.model";
// import { connectDb } from "@/shared/libs/db";
// import { currentUser } from "@clerk/nextjs/server";
// import Stripe from "stripe";

// export const addStripe = async () => {
//   try {
//     await connectDb();

//     const user = await currentUser();

//     const membership = await Membership.findOne({ userId: user?.id! });

//     if (membership) {
//       return;
//     } else {
//       const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//         apiVersion: "2025-01-27.acacia",
//       });

//       await stripe.customers
//         .create({
//           email: user?.emailAddresses[0].emailAddress,
//           name: user?.firstName! + user?.lastName,
//         })
//         .then(async (customer) => {
//           await Membership.create({
//             userId: user?.id,
//             stripeCustomerId: customer.id,
//             plan: "LAUNCH",
//           });
//         });
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };


"use server";

import Membership from "@/models/membership.model";
import { connectDb } from "@/shared/libs/db";
import { currentUser } from "@clerk/nextjs/server";
import Stripe from "stripe";

export const addStripe = async () => {
  try {
    await connectDb();

    const user = await currentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Check if the user is already a member
    const membership = await Membership.findOne({ userId: user.id });
    if (membership) {
      return { message: "User already has a membership" };
    }

    // Ensure the Stripe secret key exists
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set in environment variables");
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-01-27.acacia",
    });

    // Create a new customer in Stripe
    const customer = await stripe.customers.create({
      email: user.emailAddresses[0]?.emailAddress || "",
      name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
    });

    // Store membership details in the database
    await Membership.create({
      userId: user.id,
      stripeCustomerId: customer.id,
      plan: "LAUNCH",
    });

    return { message: "Membership created successfully", stripeCustomerId: customer.id };
  } catch (error) {
    console.error("Error in addStripe:", error);
    return { error: "An error occurred while creating Stripe membership" };
  }
};
