import { createThirdwebClient } from "thirdweb";

const secretKey = process.env.THIRDWEB_SECRET_KEY!; // this will be used on the server-side

if (!secretKey) {
  throw new Error("Missing THIRDWEB_SECRET_KEY in environment variables");
}

export const server = createThirdwebClient({ secretKey });
