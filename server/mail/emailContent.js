export const generateEmailContent = (
    firstName,
    lastName,
    hotelName,
    roomNumber,
    checkInDate,
    checkOutDate,
    totalPrice,
    bookingId
  ) => {
    const mailSubject = `Booking Confirmation - ${hotelName}`;
  
    const mailHtml = `
      <h2 style="font-family: Arial, sans-serif;">Booking Confirmation</h2>
  
      <p style="font-family: Arial, sans-serif;">
        Dear ${firstName} ${lastName},
      </p>
  
      <p style="font-family: Arial, sans-serif;">
        We are pleased to confirm your reservation at <strong>${hotelName}</strong>. Please find the details of your booking below:
      </p>
  
      <ul style="font-family: Arial, sans-serif; padding-left: 20px;">
        <li><strong>Booking Reference:</strong> ${bookingId}</li>
        <li><strong>Room Number:</strong> ${roomNumber}</li>
        <li><strong>Check-In Date:</strong> ${checkInDate}</li>
        <li><strong>Check-Out Date:</strong> ${checkOutDate}</li>
        <li><strong>Total Price:</strong> LKR ${totalPrice}</li>
      </ul>
  
      <p style="font-family: Arial, sans-serif;">
        Should you need any assistance prior to your arrival, feel free to reach out through our website.
      </p>
  
      <p style="font-family: Arial, sans-serif;">
        We look forward to welcoming you and ensuring a pleasant and comfortable stay.
      </p>
  
      <p style="font-family: Arial, sans-serif;">
        Best regards,<br />
        <strong>The ${hotelName} Team</strong>
      </p>
    `;
  
    return { mailSubject, mailHtml };
  };
  