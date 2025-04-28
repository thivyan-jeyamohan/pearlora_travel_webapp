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
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const getSriLankanDate = () => {
    const sriLankanOffset = 5.5;
    const localDate = new Date();
    const localOffset = localDate.getTimezoneOffset() / 60;
    const adjustedDate = new Date(localDate.getTime() + (sriLankanOffset - localOffset) * 60 * 60 * 1000);
    return adjustedDate.toISOString().split("T")[0];
  };

  const todayDate = getSriLankanDate();

  useEffect(() => {
    axios.get("http://localhost:5000/api/admin-destinations")
      .then((response) => {
        setDestinations(response.data);
        if (response.data.length > 0) {
          const formattedPrice = (response.data[0].price - (response.data[0].price * response.data[0].discount / 100)).toFixed(2);
          setBooking({
            ...booking,
            destination: response.data[0].name,
            price: formattedPrice,
          });
        }
      })
      .catch((error) => console.error("Error fetching destinations:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "destination") {
      const selected = destinations.find((d) => d.name === value);
      const formattedPrice = (selected.price - (selected.price * selected.discount / 100)).toFixed(2);
      setBooking({
        ...booking,
        destination: value,
        price: formattedPrice,
      });
    } else {
      setBooking({ ...booking, [name]: value });
    }

    validateForm(name, value);
  };

  const validateForm = (name, value) => {
    const errors = {};

    if (name === "name") {
      const nameRegex = /^[a-zA-Z]+$/;
      if (!nameRegex.test(value)) {
        errors.name = "Name must contain only letters (no special characters or spaces).";
      }
    }

    if (name === "date") {
      const currentDate = new Date().toISOString().split("T")[0];
      if (value <= currentDate) {
        errors.date = "Date cannot be today or in the past.";
      }
    }

    if (name === "email") {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if (!emailRegex.test(value)) {
        errors.email = "Please enter a valid email address.";
      }
    }

    if (name === "people" && value <= 0) {
      errors.people = "Number of people must be greater than 0.";
    }

    setErrors(errors);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Booking Confirmation", 20, 20);
    doc.text(`Name: ${booking.name}`, 20, 40);
    doc.text(`Email: ${booking.email}`, 20, 50);
    doc.text(`Destination: ${booking.destination}`, 20, 60);
    doc.text(`Date: ${booking.date}`, 20, 70);
    doc.text(`People: ${booking.people}`, 20, 80);
    doc.text(`Total Price: $${(booking.price * booking.people).toFixed(2)}`, 20, 90);

    doc.save("Booking_Confirmation.pdf");
    const pdfBase64 = doc.output("datauristring");
    return pdfBase64;
  };

  const sendBookingEmail = (pdfBase64) => {
    const apiKey = "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";
    const senderEmail = "anathanprashanth@gmail.com";

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
          content: pdfBase64.split("base64,")[1],
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.keys(errors).length > 0) {
      alert("Please correct the errors before submitting.");
      return;
    }

    const pdfBase64 = generatePDF();

    try {
      const response = await axios.post("http://localhost:5000/api/bookings", booking);
      alert("Booking Confirmed!");

      if (response.data.data && response.data.data._id) {
        navigate(`/userList/${response.data.data._id}`);
      } else {
        console.error('Booking ID not found!');
      }

      sendBookingEmail(pdfBase64);

    } catch (error) {
      alert("Error saving booking");
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-cover bg-center mt-15"
         style={{ backgroundImage: `url(/src/Feature/Destination/image/picture-frame-model-airplanes.jpg)` }}>
      <div className="w-full max-w-lg bg-white bg-opacity-80 rounded-3xl shadow-lg p-8">
        <h2 className="text-4xl font-semibold text-gray-800 text-center mb-8">Book Your Dream Destination ✈️</h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-lg font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="name"
              value={booking.name}
              onChange={handleChange}
              required
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={booking.email}
              onChange={handleChange}
              required
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700">Select Destination</label>
            <select
              name="destination"
              value={booking.destination}
              onChange={handleChange}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {destinations.map((dest) => (
                <option key={dest._id} value={dest.name}>
                  {dest.name} - ${parseFloat(dest.price - (dest.price * dest.discount / 100)).toFixed(2)} per person
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700">Select Date</label>
            <input
              type="date"
              name="date"
              value={booking.date}
              onChange={handleChange}
              required
              min={todayDate}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700">Number of People</label>
            <input
              type="number"
              name="people"
              min="1"
              value={booking.people}
              onChange={handleChange}
              required
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            {errors.people && <p className="text-red-500 text-sm">{errors.people}</p>}
          </div>
          <div className="text-xl font-semibold text-center mt-4">
            Total Price: <span className="text-teal-600">${(booking.price * booking.people).toFixed(2)}</span>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300 mt-6"
          >
            Confirm Booking ✅
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
