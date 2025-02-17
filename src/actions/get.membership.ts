// "use server";

// import Membership from "@/models/membership.model";
// import { connectDb } from "@/shared/libs/db";
// import { currentUser } from "@clerk/nextjs/server";

// export const getMemberShip = async () => {
//   try {
//     await connectDb().then(async (res) => {
//       const user = await currentUser();
//       if (user) {
//         const membership = await Membership.findOne({
//           userId: user?.id,
//         });
//         return membership;
//       }
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };


// "use server";

// import Membership from "@/models/membership.model";
// import { connectDb } from "@/shared/libs/db";
// import { currentUser } from "@clerk/nextjs/server";

// export const getMemberShip = async () => {
//   try {
//     await connectDb();

//     const user = await currentUser();
//     if (!user) return null;

//     const membership = await Membership.findOne({ userId: user.id }).lean(); // Converts to plain object

//     return membership || null;
//   } catch (error) {
//     console.error("Error fetching membership:", error);
//     return null;
//   }
// };


"use server";

import Membership from "@/models/membership.model";
import { connectDb } from "@/shared/libs/db";
import { currentUser } from "@clerk/nextjs/server";

export const getMemberShip = async () => {
  try {
    await connectDb();

    const user = await currentUser();
    if (!user) return null;

    const membership = await Membership.findOne({ userId: user.id }).lean(); // Ensure it's a plain object

    return membership ? JSON.parse(JSON.stringify(membership)) : null; // Convert to plain JSON
  } catch (error) {
    console.error("Error fetching membership:", error);
    return null;
  }
};
