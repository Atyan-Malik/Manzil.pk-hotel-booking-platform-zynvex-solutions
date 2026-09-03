const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  });
};

const bookingConfirmationTemplate = (booking, hotel, room) => `
  <div style="font-family: sans-serif; max-width: 500px; margin: auto;">
    <h2 style="color: #16a34a;">Booking Confirmed</h2>
    <p>Your stay at <strong>${hotel.name}</strong> has been confirmed.</p>
    <p><strong>Room:</strong> ${room.roomType}</p>
    <p><strong>Check-in:</strong> ${new Date(booking.checkIn).toDateString()}</p>
    <p><strong>Check-out:</strong> ${new Date(booking.checkOut).toDateString()}</p>
    <p><strong>Total:</strong> PKR ${booking.totalPrice.toLocaleString()}</p>
  </div>
`;

const hotelStatusTemplate = (hotel, approved, reason) => `
  <div style="font-family: sans-serif; max-width: 500px; margin: auto;">
    <h2 style="color: ${approved ? "#16a34a" : "#dc2626"};">
      ${approved ? "Hotel Approved" : "Hotel Registration Rejected"}
    </h2>
    <p>Your hotel <strong>${hotel.name}</strong> has been ${approved ? "approved and is now live." : `rejected. Reason: ${reason}`}</p>
  </div>
`;

module.exports = { sendEmail, bookingConfirmationTemplate, hotelStatusTemplate };
