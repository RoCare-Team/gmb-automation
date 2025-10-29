import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: "Not logged in" });
  }
  res.json(session); // includes accessToken, refreshToken, email, etc.
}
