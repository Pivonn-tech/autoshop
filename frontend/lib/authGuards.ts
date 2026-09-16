import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

/**
 * Returns the session if the request is from an authenticated admin.
 * Calls res.status(401|403).json(...) and returns null if not.
 */
export async function requireAdmin(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.id) {
    res.status(401).json({ error: "Authentication required" });
    return null;
  }

  if (!session.user.isAdmin) {
    res.status(403).json({ error: "Admin access required" });
    return null;
  }

  return session;
}

/**
 * Returns the session if the request is from any authenticated user.
 * Calls res.status(401).json(...) and returns null if not.
 */
export async function requireAuth(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.id) {
    res.status(401).json({ error: "Authentication required" });
    return null;
  }

  return session;
}
