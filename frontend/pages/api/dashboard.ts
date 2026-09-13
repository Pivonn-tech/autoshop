import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { prisma } from "@/lib/prisma";
import {
  appointments as staticAppointments,
  serviceHistory as staticServiceHistory,
  invoices as staticInvoices,
  vehicles as staticVehicles,
  notifications as staticNotifications,
} from "@/lib/businessData";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session?.user?.id) {
      // Not logged in — return demo data so unauthenticated visitors still see something
      return res.status(200).json({
        demo: true,
        appointments: staticAppointments,
        serviceHistory: staticServiceHistory,
        invoices: staticInvoices,
        savedVehicles: staticVehicles,
        notifications: staticNotifications,
      });
    }

    const userId = session.user.id;

    // Fetch real data from Prisma in parallel
    const [dbBookings, dbVehicles, dbOrders] = await Promise.all([
      prisma.serviceBooking.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      prisma.savedVehicle.findMany({
        where: { userId },
        orderBy: { savedAt: "desc" },
      }),
      prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
    ]);

    // Map DB bookings to the shape the dashboard expects
    const appointments = dbBookings.length > 0
      ? dbBookings.map((b: typeof dbBookings[0]) => ({
          id: b.id,
          customerName: session.user?.name || "You",
          phone: "",
          email: session.user?.email || "",
          vehicle: `Booking ${b.id.slice(-6)}`,
          licensePlate: "",
          service: b.serviceId,
          preferredDate: b.date,
          preferredTime: b.time,
          status: b.status as string,
        }))
      : staticAppointments;

    // Map DB vehicles — SavedVehicle only stores productId, so reconstruct display name
    const savedVehicles = dbVehicles.length > 0
      ? dbVehicles.map((v: typeof dbVehicles[0]) => ({
          id: v.id,
          make: "Saved",
          model: `Product ${v.productId}`,
          year: new Date(v.savedAt).getFullYear(),
          licensePlate: v.productId,
          mileage: 0,
          lastServiceDate: new Date(v.savedAt).toISOString().split("T")[0],
          notes: "",
        }))
      : staticVehicles;

    // Map DB orders to invoice shape
    const invoices = dbOrders.length > 0
      ? dbOrders.map((o: typeof dbOrders[0]) => ({
          id: o.id.slice(-8).toUpperCase(),
          customer: session.user?.name || "You",
          service: "Order",
          amount: `KSh ${Number(o.total).toLocaleString()}`,
          status: (o.status === "paid" ? "Paid" : o.status === "overdue" ? "Overdue" : "Pending") as "Paid" | "Pending" | "Overdue",
          dueDate: new Date(o.createdAt).toISOString().split("T")[0],
        }))
      : staticInvoices;

    return res.status(200).json({
      demo: false,
      appointments,
      serviceHistory: staticServiceHistory, // no DB model for this yet
      invoices,
      savedVehicles,
      notifications: staticNotifications,
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    // On any DB error fall back to static data rather than showing an error
    return res.status(200).json({
      demo: true,
      appointments: staticAppointments,
      serviceHistory: staticServiceHistory,
      invoices: staticInvoices,
      savedVehicles: staticVehicles,
      notifications: staticNotifications,
    });
  }
}
