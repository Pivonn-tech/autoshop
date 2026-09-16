import nodemailer from "nodemailer";
import logger from "./logger.js";

// Lazily create the transport so missing env vars only error when email is
// actually attempted (not at startup)
function getTransport() {
  if (!process.env.SMTP_HOST) {
    // No SMTP configured — log and silently skip
    return null;
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

const FROM = process.env.SMTP_FROM || "AutoFix Kenya <noreply@autofixkenya.co.ke>";

/**
 * Send an appointment confirmation to the customer.
 */
export async function sendAppointmentConfirmation(appointment) {
  const transport = getTransport();
  if (!transport) {
    logger.warn({ appointmentId: appointment.id }, "SMTP not configured — skipping appointment email");
    return;
  }

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Appointment Confirmed</title></head>
<body style="font-family:Arial,sans-serif;background:#f9f9f9;margin:0;padding:0">
  <div style="max-width:600px;margin:40px auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.08)">
    <div style="background:#0F2A4A;padding:32px 40px">
      <h1 style="color:#E8700A;margin:0;font-size:1.6rem">AutoFix Kenya</h1>
      <p style="color:rgba(255,255,255,.7);margin:4px 0 0;font-size:.9rem">Your appointment is confirmed ✅</p>
    </div>
    <div style="padding:32px 40px">
      <p style="color:#374151;font-size:1rem">Hi <strong>${appointment.customerName}</strong>,</p>
      <p style="color:#374151">Your service appointment has been received. Here are your booking details:</p>
      <table style="width:100%;border-collapse:collapse;margin:20px 0">
        <tr style="border-bottom:1px solid #E5E7EB">
          <td style="padding:10px 0;color:#6B7280;font-size:.875rem;width:40%">Appointment ID</td>
          <td style="padding:10px 0;color:#111827;font-weight:600">${appointment.id}</td>
        </tr>
        <tr style="border-bottom:1px solid #E5E7EB">
          <td style="padding:10px 0;color:#6B7280;font-size:.875rem">Service</td>
          <td style="padding:10px 0;color:#111827;font-weight:600">${appointment.serviceId}</td>
        </tr>
        <tr style="border-bottom:1px solid #E5E7EB">
          <td style="padding:10px 0;color:#6B7280;font-size:.875rem">Vehicle</td>
          <td style="padding:10px 0;color:#111827;font-weight:600">${appointment.vehicle}</td>
        </tr>
        <tr style="border-bottom:1px solid #E5E7EB">
          <td style="padding:10px 0;color:#6B7280;font-size:.875rem">Date</td>
          <td style="padding:10px 0;color:#111827;font-weight:600">${new Date(appointment.preferredDate).toLocaleDateString("en-KE", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;color:#6B7280;font-size:.875rem">Time</td>
          <td style="padding:10px 0;color:#111827;font-weight:600">${appointment.preferredTime}</td>
        </tr>
      </table>
      <p style="color:#374151;font-size:.875rem">Need to reschedule? Call us at <a href="tel:+254743645366" style="color:#E8700A">0743 645 366</a></p>
      <p style="color:#6B7280;font-size:.8rem;margin-top:32px;border-top:1px solid #E5E7EB;padding-top:16px">
        AutoFix Kenya Ltd — Nairobi's Premier Automotive Centre
      </p>
    </div>
  </div>
</body>
</html>`;

  try {
    await transport.sendMail({
      from: FROM,
      to: appointment.email,
      subject: `Appointment Confirmed – ${appointment.serviceId} on ${new Date(appointment.preferredDate).toLocaleDateString("en-KE")}`,
      html,
    });
    logger.info({ appointmentId: appointment.id, to: appointment.email }, "Appointment confirmation email sent");
  } catch (err) {
    logger.error({ err, appointmentId: appointment.id }, "Failed to send appointment confirmation email");
  }
}

/**
 * Send an order receipt to the customer.
 */
export async function sendOrderReceipt(order, items, customerEmail, customerName) {
  const transport = getTransport();
  if (!transport) {
    logger.warn({ orderId: order.id }, "SMTP not configured — skipping order receipt email");
    return;
  }

  const itemRows = items
    .map(
      (item) =>
        `<tr style="border-bottom:1px solid #E5E7EB">
          <td style="padding:10px 0;color:#111827">${item.name}</td>
          <td style="padding:10px 0;color:#6B7280;text-align:center">${item.quantity}</td>
          <td style="padding:10px 0;color:#111827;text-align:right">KSh ${(item.price * item.quantity).toLocaleString("en-KE")}</td>
        </tr>`
    )
    .join("");

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Order Receipt</title></head>
<body style="font-family:Arial,sans-serif;background:#f9f9f9;margin:0;padding:0">
  <div style="max-width:600px;margin:40px auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.08)">
    <div style="background:#0F2A4A;padding:32px 40px">
      <h1 style="color:#E8700A;margin:0;font-size:1.6rem">AutoFix Kenya</h1>
      <p style="color:rgba(255,255,255,.7);margin:4px 0 0;font-size:.9rem">Order Received 🎉</p>
    </div>
    <div style="padding:32px 40px">
      <p style="color:#374151;font-size:1rem">Hi <strong>${customerName}</strong>,</p>
      <p style="color:#374151">Thanks for your order! Here's your receipt:</p>
      <p style="color:#6B7280;font-size:.875rem">Order ID: <strong style="color:#111827">${order.id}</strong></p>
      <table style="width:100%;border-collapse:collapse;margin:20px 0">
        <thead>
          <tr style="border-bottom:2px solid #E5E7EB">
            <th style="padding:8px 0;text-align:left;color:#6B7280;font-size:.8rem;text-transform:uppercase">Item</th>
            <th style="padding:8px 0;text-align:center;color:#6B7280;font-size:.8rem;text-transform:uppercase">Qty</th>
            <th style="padding:8px 0;text-align:right;color:#6B7280;font-size:.8rem;text-transform:uppercase">Total</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding:16px 0 0;font-weight:700;color:#111827">Total</td>
            <td style="padding:16px 0 0;text-align:right;font-weight:700;color:#E8700A;font-size:1.1rem">KSh ${Number(order.total).toLocaleString("en-KE")}</td>
          </tr>
        </tfoot>
      </table>
      <p style="color:#374151;font-size:.875rem">Questions? Call <a href="tel:+254743645366" style="color:#E8700A">0743 645 366</a> or email <a href="mailto:service@autofixkenya.co.ke" style="color:#E8700A">service@autofixkenya.co.ke</a></p>
      <p style="color:#6B7280;font-size:.8rem;margin-top:32px;border-top:1px solid #E5E7EB;padding-top:16px">
        AutoFix Kenya Ltd — Nairobi's Premier Automotive Centre
      </p>
    </div>
  </div>
</body>
</html>`;

  try {
    await transport.sendMail({
      from: FROM,
      to: customerEmail,
      subject: `Your AutoFix Kenya Order – ${order.id}`,
      html,
    });
    logger.info({ orderId: order.id, to: customerEmail }, "Order receipt email sent");
  } catch (err) {
    logger.error({ err, orderId: order.id }, "Failed to send order receipt email");
  }
}
