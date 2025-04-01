import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom";
import * as SibApiV3Sdk from 'sib-api-v3-sdk'; // Brevo SDK

const BookingForm = () => {
  const [destinations, setDestinations] = useState([]);
  const [booking, setBooking] = useState({
    name: "",
    email: "",
    date: "",
    people: 1,
    destination: "",
    price: 0,
  });
  const navigate = useNavigate();

  // Fetch available destinations
  useEffect(() => {
    axios.get("http://localhost:5000/api/admin-destinations")
      .then((response) => {
        setDestinations(response.data);
        if (response.data.length > 0) {
          setBooking({
            ...booking,
            destination: response.data[0].name,
            price: response.data[0].price - (response.data[0].price * response.data[0].discount / 100),
          });
        }
      })
      .catch((error) => console.error("Error fetching destinations:", error));
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "destination") {
      const selected = destinations.find((d) => d.name === value);
      setBooking({
        ...booking,
        destination: value,
        price: selected.price - (selected.price * selected.discount / 100),
      });
    } else {
      setBooking({ ...booking, [name]: value });
    }
  };

  // Generate PDF and send as an email attachment
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Booking Confirmation", 20, 20);
    doc.text(`Name: ${booking.name}`, 20, 40);
    doc.text(`Email: ${booking.email}`, 20, 50);
    doc.text(`Destination: ${booking.destination}`, 20, 60);
    doc.text(`Date: ${booking.date}`, 20, 70);
    doc.text(`People: ${booking.people}`, 20, 80);
    doc.text(`Total Price: $${booking.price * booking.people}`, 20, 90);

    
    doc.save("Booking_Confirmation.pdf"); 
    const pdfBase64 = doc.output("datauristring"); // Generate base64 PDF
    return pdfBase64;

  };

  // Send confirmation email with the PDF attachment
  const sendBookingEmail = (pdfBase64) => {
    const apiKey = "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"; // Replace with your actual API key
    const senderEmail = "anathanprashanth@gmail.com"; // Replace with your actual email

    // Set up Brevo API client
    SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = apiKey;
    const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

    const sender = { email: senderEmail };
    const receiver = [{ email: booking.email }];

    const emailData = {
      sender,
      to: receiver,
      subject: "Booking Confirmation",
      textContent: `Dear ${booking.name},\n\nThank you for booking with us! Please find your confirmation attached.\n\nBest regards,\nYour Travel Agency`,
      attachment: [
        {
          content: pdfBase64.split("base64,")[1], // Extract base64 content
          name: "Booking_Confirmation.pdf",
          type: "application/pdf",
        },
      ],
    };

    try {
      tranEmailApi.sendTransacEmail(emailData).then((response) => {
        console.log("Email sent successfully to", booking.email);
        alert("Booking confirmed! Email sent successfully.");
      });
    } catch (error) {
      console.error("Error sending email:", error);
      alert("There was an error sending the email.");
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    generatePDF(); 
    // Ensure all necessary fields are filled
    if (!booking.name || !booking.email || !booking.destination || !booking.date || booking.people <= 0) {
      alert("Please fill all fields.");
      return;
    }

    // Generate PDF for confirmation
    const pdfBase64 = generatePDF();
    console.log("PDF Base64:", pdfBase64);

    try {
      const response = await axios.post("http://localhost:5000/api/bookings", booking);
      alert("Booking Confirmed!");

      if (response.data.data && response.data.data._id) {
        // Redirect to booking confirmation page or user list after booking
        navigate(`/userList/${response.data.data._id}`);
      } else {
        console.error('Booking ID not found!');
      }

      // Send the booking email after successful form submission
      sendBookingEmail(pdfBase64);

    } catch (error) {
      alert("Error saving booking");
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-cover bg-center"
         style={{ backgroundImage: `url(/src/Feature/Destination/image/picture-frame-model-airplanes.jpg)` }}>
      <div className="w-full max-w-lg bg-white bg-opacity-80 rounded-lg shadow-2xl p-8">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">Book Your Dream Destination ✈️</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium">Full Name</label>
            <input
              type="text"
              name="name"
              value={booking.name}
              onChange={handleChange}
              required
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={booking.email}
              onChange={handleChange}
              required
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Select Destination</label>
            <select
              name="destination"
              value={booking.destination}
              onChange={handleChange}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {destinations.map((dest) => (
                <option key={dest._id} value={dest.name}>
                  {dest.name} - ${dest.price - (dest.price * dest.discount / 100)} per person
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Select Date</label>
            <input
              type="date"
              name="date"
              value={booking.date}
              onChange={handleChange}
              required
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Number of People</label>
            <input
              type="number"
              name="people"
              min="1"
              value={booking.people}
              onChange={handleChange}
              required
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="text-xl font-bold text-center">
            Total Price: <span className="text-blue-600">${booking.price * booking.people}</span>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Confirm Booking ✅
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
