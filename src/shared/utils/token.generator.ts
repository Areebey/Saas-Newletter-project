"use server";

import { currentUser } from "@clerk/nextjs/server";
// import jwt from "jsonwebtoken";
require('dotenv').config();
const jwt = require('jsonwebtoken');


export const generateApiKey = async () => {
  const user = await currentUser();
  const token = jwt.sign({ user }, process.env.JWT_SECRET_KEY!);
  return token;
};

export const regenerateApiKey = async () => {
  const user = await currentUser();
  const token = jwt.sign({ user }, process.env.JWT_SECRET_KEY!);
  return token;
};


// const payload = { userId: 123, role: "admin" };  // Customize this payload
// const secretKey = "your_secret_key";  // Replace with your own secret key
// const token = jwt.sign(payload, secretKey, { expiresIn: "1month" });

// console.log("Generated JWT Token:", token);
