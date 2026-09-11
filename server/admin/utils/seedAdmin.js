import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Admin from "../models/Admin.js";

dotenv.config();

const run = async () => {
  await connectDB();
  const email = process.argv[2] || "admin@manzil.pk";
  const password = process.argv[3] || "changeme123";
  const name = process.argv[4] || "Manzil Admin";

  const existing = await Admin.findOne({ email });
  if (existing) {
    console.log(`Admin already exists: ${email}`);
    process.exit(0);
  }

  await Admin.create({ name, email, password, role: "superadmin" });
  console.log(`Superadmin created: ${email} / ${password}`);
  console.log("Change this password after first login.");
  process.exit(0);
};

run();
