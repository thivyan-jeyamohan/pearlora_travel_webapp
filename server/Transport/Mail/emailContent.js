export const generateEmailContent = (
  airtaxiName,
  departure,
  departure_datetime,
  destination,
  destination_datetime,
  ticket_price,
  seats,
) => {
  const mailSubject = `New Air Taxi Travel Added: ${airtaxiName}`;

  const mailHtml = `
      <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Air Taxi Travels</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f9;
      color: #333;
      margin: 0;
      padding: 0;
    }

    .container {
      width: 100%;
      max-width: 600px;
      margin: 20px auto;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      padding: 30px;
    }

    h1 {
      font-size: 24px;
      color: #4CAF50;
      text-align: center;
      margin-bottom: 20px;
    }

    .content {
      font-size: 16px;
      line-height: 1.6;
      margin-bottom: 20px;
    }

    .content p {
      margin: 10px 0;
    }

    .content strong {
      color: #333;
    }

    .footer {
      text-align: center;
      font-size: 14px;
      color: #777;
      margin-top: 30px;
    }

    .btn {
      display: inline-block;
      padding: 10px 20px;
      background-color: #4CAF50;
      color: #fff;
      text-decoration: none;
      border-radius: 5px;
      font-size: 16px;
      text-align: center;
      margin-top: 20px;
    }

    .btn:hover {
      background-color: #45a049;
    }
  </style>
</head>
<body>

  <div class="container">
    <h1>New Air Taxi Travel Added</h1>

    <div class="content">
      <p><strong>Air Taxi Name:</strong> ${airtaxiName}</p>
      <p><strong>Departure Location:</strong> ${departure}</p>
      <p><strong>Departure Date & Time:</strong> ${departure_datetime}</p>
      <p><strong>Destination Location:</strong> ${destination}</p>
      <p><strong>Destination Date & Time:</strong> ${destination_datetime}</p>
      <p><strong>Ticket Price:</strong> LKR ${ticket_price}</p>
      <p><strong>Total Seats Available:</strong> ${seats}</p>
    </div>

    <a href="#" class="btn">View Details</a>
    
    <div class="footer">
      <p>Thank you for choosing our service!</p>
      <p>If you have any questions, feel free to contact us.</p>
    </div>
  </div>

</body>
</html>
    `;

  return { mailSubject, mailHtml };
};
