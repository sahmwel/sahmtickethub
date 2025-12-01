export interface EmailAccount {
  user: string;
  pass: string;
  fromName: string;
  replyTo?: string | null;
  host?: string;    // optional, defaults to Private Email host
  port?: number;    // optional, defaults to 465
  secure?: boolean; // optional, defaults to true
}

export const emailAccounts = {
  noreply: {
    user: "no-reply@sahmtickethub.online",
    pass: process.env.NOREPLY_EMAIL_PASSWORD || "",
    fromName: "Sahm Ticket Hub",
    replyTo: null,           // DO NOT REPLY
    host: "mail.privateemail.com",
    port: 465,
    secure: true,
  },

  info: {
    user: "info@sahmtickethub.online",
    pass: process.env.INFO_EMAIL_PASSWORD || "",
    fromName: "Sahm Ticket Hub Support",
    replyTo: "info@sahmtickethub.online",
    host: "mail.privateemail.com",
    port: 465,
    secure: true,
  },

  hello: {
    user: "hello@sahmtickethub.online",
    pass: process.env.HELLO_EMAIL_PASSWORD || "",
    fromName: "Sahm Ticket Hub Newsletter",
    replyTo: null,
    host: "mail.privateemail.com",
    port: 465,
    secure: true,
  },
} as const;

export type EmailAccountKey = keyof typeof emailAccounts;
