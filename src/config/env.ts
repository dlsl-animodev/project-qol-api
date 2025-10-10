import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 3001,
  regKey: process.env.REG_KEY,
  apiUrl: "https://portal.dlsl.edu.ph/registration/event/helper.php",
  nodeEnv: process.env.NODE_ENV || "development",
};

// Disable TLS certificate validation
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
