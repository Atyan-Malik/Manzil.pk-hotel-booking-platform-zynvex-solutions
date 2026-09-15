import dotenv from "dotenv";
import connectDB from "../../config/db.js";
import Admin from "../models/Admin.js";

dotenv.config({ path: "../.env" });

const createAdmin = async () => {
  try {
    await connectDB();

    const email = process.argv[2] || "admin@manzil.pk";
    const password = process.argv[3] || "changeme123";
    const name = process.argv[4] || "Manzil Admin";

    const normalizedEmail = email.trim().toLowerCase();

    const existingAdmin = await Admin.findOne({
      email: normalizedEmail,
    });

    if (existingAdmin) {
      console.log(`Admin already exists: ${normalizedEmail}`);
      process.exit(0);
    }

    const admin = await Admin.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: "superadmin",
      isActive: true,
    });

    console.log("\n✅ Superadmin created successfully");
    console.log("--------------------------------");
    console.log(`Name:     ${admin.name}`);
    console.log(`Email:    ${admin.email}`);
    console.log(`Role:     ${admin.role}`);
    console.log(`Password: ${password}`);
    console.log("--------------------------------");
    console.log("⚠️ Change this password after first login.\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Failed to create admin:");
    console.error(error);
    process.exit(1);
  }
};

createAdmin();