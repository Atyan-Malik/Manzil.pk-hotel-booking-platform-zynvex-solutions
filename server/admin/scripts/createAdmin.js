import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "../models/Admin.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existingAdmin = await Admin.findOne({
      email: "atyanmalik8@gmail.com",
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const admin = await Admin.create({
      name: "AtyanAdmin",
      email: "atyanmalik8@gmail.com",
      password: "Admin@123",
      role: "superadmin",
      isActive: true,
    });

    console.log("Admin created successfully:");
    console.log(admin.email);

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createAdmin();