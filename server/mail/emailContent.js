export const generateEmailContent = (firstName,lastName,hotelName,roomNumber,checkInDate,checkOutDate,totalPrice,bookingId) => {
  const mailSubject = `Booking Confirmation - ${hotelName}`;

  const mailHtml = `
    <h1>Dear ${firstName} ${lastName},</h1>
    <p>Thank you for booking with ${hotelName}!</p>
    <p>Here are your booking details:</p>
    <ul>
      <li><strong>Hotel Name:</strong> ${hotelName}</li>
      <li><strong>Booking ID:</strong> ${bookingId}</li>
      <li><strong>Room Number:</strong> ${roomNumber}</li>
      <li><strong>Check In:</strong> ${checkInDate}</li>
      <li><strong>Check Out:</strong> ${checkOutDate}</li>
      <li><strong>Total Price:</strong> Rs ${totalPrice}</li>
    </ul>
    <p>We look forward to welcoming you!</p>
  `;

  return { mailSubject, mailHtml };
};