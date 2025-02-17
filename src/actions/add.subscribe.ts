// "use server";

// import { clerkClient } from "@clerk/clerk-sdk-node"; // ✅ Correct Import
// import Subscriber from "@/models/subscriber.model";
// import { connectDb } from "@/shared/libs/db";
// import { validateEmail } from "@/shared/utils/ZeroBounceApi";

// export const subscribe = async ({
//   email,
//   username,
// }: {
//   email: string;
//   username: string;
// }) => {
//   try {
//     await connectDb();

//     // Fetch all users
//     const allUsers = await clerkClient.users.getUserList(); // ✅ Correct usage

//     if (!allUsers || allUsers.length === 0) {
//       throw new Error("No users found in Clerk.");
//     }

//     // Find our newsletter owner
//     const newsletterOwner = allUsers.find((i) => i.username === username);

//     if (!newsletterOwner) {
//       throw new Error("Username is not valid!");
//     }

//     // Check if subscriber already exists
//     const isSubscriberExist = await Subscriber.findOne({
//       email,
//       newsLetterOwnerId: newsletterOwner.id,
//     });

//     if (isSubscriberExist) {
//       return { error: "Email already exists!" };
//     }

//     // Validate email
//     const validationResponse = await validateEmail({ email });
//     if (validationResponse.status === "invalid") {
//       return { error: "Email not valid!" };
//     }

//     // Create new subscriber
//     const subscriber = await Subscriber.create({
//       email,
//       newsLetterOwnerId: newsletterOwner.id,
//       source: "Code Point website",
//       status: "Subscribed",
//     });

//     return subscriber;
//   } catch (error: any) {
//     console.error("Subscription Error:", error.message || error);
//     return { error: "An error occurred while subscribing." };
//   }
// };


"use server";

import Subscriber from "@/models/subscriber.model";
import { connectDb } from "@/shared/libs/db";
import { validateEmail } from "@/shared/utils/ZeroBounceApi";
import { clerkClient } from "@clerk/nextjs/server";
import { User } from "@clerk/backend"; // Import User type

export const subscribe = async ({
  email,
  username,
}: {
  email: string;
  username: string;
}) => {
  try {
    await connectDb();

    // ✅ Await clerkClient() to get the actual client instance
    const clerk = await clerkClient();
    
    // ✅ Explicitly type 'allUsers' as an array of User objects
    const allUsers: User[] = (await clerk.users.getUserList()).data;

    // ✅ Ensure TypeScript knows the type of 'i'
    const newsletterOwner = allUsers.find((i: User) => i.username === username);

    if (!newsletterOwner) {
      throw Error("Username is not valid!");
    }

    // Check if subscriber already exists
    const isSubscriberExist = await Subscriber.findOne({
      email,
      newsLetterOwnerId: newsletterOwner.id,
    });

    if (isSubscriberExist) {
      return { error: "Email already exists!" };
    }

    // Validate email
    // const validationResponse = await validateEmail({ email });
    // if (validationResponse.status === "invalid") {
    //   return { error: "Email not valid!" };
    // }

    // Create new subscriber
    const subscriber = await Subscriber.create({
      email,
      newsLetterOwnerId: newsletterOwner.id,
      source: "Code Point website",
      status: "Subscribed",
    });

    return subscriber;
  } catch (error) {
    console.error(error);
    return { error: "An error occurred while subscribing." };
  }
};
