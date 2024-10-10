import { createClient } from "@libsql/client";

export const DBClient = () => {
  const url = process.env.NEXT_PUBLIC_TURSO_DATABASE_URL;
  const authToken = process.env.NEXT_PUBLIC_TURSO_AUTH_TOKEN;

  if (!url) throw new Error("TURSO_DATABASE_URL is not set");
  if (!authToken) throw new Error("TURSO_AUTH_TOKEN is not set");

  return createClient({
    url: `https://${url}`,
    authToken: authToken,
  });
};
