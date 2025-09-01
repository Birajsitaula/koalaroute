import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "./User.js";
import mongoose from "mongoose";

let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  isConnected = true;
}

export async function handler(event) {
  await connectDB();

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const body = JSON.parse(event.body);
  const { email, password, type } = body; // type: "login" or "signup"

  try {
    if (type === "signup") {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return {
          statusCode: 400,
          body: JSON.stringify({ msg: "User already exists" }),
        };
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ email, password: hashedPassword });
      await newUser.save();

      return {
        statusCode: 200,
        body: JSON.stringify({ msg: "User registered successfully" }),
      };
    }

    if (type === "login") {
      const user = await User.findOne({ email });
      if (!user) {
        return {
          statusCode: 400,
          body: JSON.stringify({ msg: "User not found" }),
        };
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return {
          statusCode: 400,
          body: JSON.stringify({ msg: "Invalid credentials" }),
        };
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      return {
        statusCode: 200,
        body: JSON.stringify({
          token,
          user: { id: user._id, email: user.email },
        }),
      };
    }

    return {
      statusCode: 400,
      body: JSON.stringify({ msg: "Invalid request type" }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
