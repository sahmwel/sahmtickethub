import nodemailer, { Transporter } from "nodemailer";
import { emailAccounts, EmailAccountKey } from "./emailConfig";

/**
 * Creates a Nodemailer transporter for a specific email account.
 * @param accountKey - Key of the account in `emailAccounts` ("noreply" | "info" | "hello")
 */
export const createTransporter = (accountKey: EmailAccountKey): Transporter => {
  const account = emailAccounts[accountKey];

  if (!account?.user || !account?.pass) {
    throw new Error(`Email account "${accountKey}" is missing username or password.`);
  }

  const transporter = nodemailer.createTransport({
    host: account.host || process.env.EMAIL_SERVER || "mail.privateemail.com",
    port: account.port || Number(process.env.EMAIL_PORT) || 465,
    secure: account.secure ?? true, // true for port 465, false for 587
    auth: {
      user: account.user,
      pass: account.pass,
    },
    logger: true,   // logs SMTP communication to console
    debug: false,   // set true to see full debug output
  });

  return transporter;
};

/**
 * Verify transporter connection
 * Logs result to console
 */
export const verifyTransporter = async (accountKey: EmailAccountKey) => {
  try {
    const transporter = createTransporter(accountKey);
    await transporter.verify();
    console.log(`✅ Transporter for "${accountKey}" verified successfully`);
  } catch (err) {
    console.error(`❌ Transporter for "${accountKey}" verification failed:`, err);
  }
};
