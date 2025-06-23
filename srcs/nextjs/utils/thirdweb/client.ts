import { createThirdwebClient } from "thirdweb";

const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!; // this will be used on the client

if (!clientId) {
  throw new Error("Missing NEXT_PUBLIC_THIRDWEB_CLIENT_ID in environment variables");
}

export const client = createThirdwebClient({ clientId });
