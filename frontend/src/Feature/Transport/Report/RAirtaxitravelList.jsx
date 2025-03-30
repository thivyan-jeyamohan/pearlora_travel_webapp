import React, { useState, useEffect } from "react";
import axios from "axios";

const RAirtaxitravelList = ({ filters }) => {
  const [travels, setTravels] = useState([]);

  useEffect(() => {
    const fetchTravels = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/airSeats");
        setTravels(response.data);
      } catch (error) {
        console.error("Error fetching travel details:", error);
      }
    };
    fetchTravels();
  }, []);

  // Filter travels based on user selection
  const filteredTravels = travels.filter((travel) => {
    return (
      (!filters.departure || travel.departure === filters.departure) &&
      (!filters.destination || travel.destination === filters.destination) &&
      (!filters.date || travel.departure_datetime.startsWith(filters.date))
    );
  });

  // Generate and download the PDF using PDFShift API
  const generatePDF = async () => {
    const htmlContent = `
      <html>
        <head>
          <style>
            table {
              width: 100%;
              border: 1px solid black;
              border-collapse: collapse;
            }
            th, td {
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
            }
          </style>
        </head>
        <body>
          <h1>Travel Details</h1>
          <table>
            <thead>
              <tr>
                <th>Air Taxi Name</th>
                <th>Departure</th>
                <th>Departure Date & Time</th>
                <th>Destination</th>
                <th>Destination Date & Time</th>
                <th>Ticket Fee (LKR)</th>
              </tr>
            </thead>
            <tbody>
              ${filteredTravels
                .map((travel) => {
                  return `
                    <tr>
                      <td>${travel.airtaxiName}</td>
                      <td>${travel.departure}</td>
                      <td>${new Date(travel.departure_datetime).toLocaleString()}</td>
                      <td>${travel.destination}</td>
                      <td>${new Date(travel.destination_datetime).toLocaleString()}</td>
                      <td>${travel.ticket_price} LKR</td>
                    </tr>
                  `;
                })
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `;

    try {
      // Base64 encode the API key for Basic Authentication
      const apiKey = "sk_5b40e13713fba655f0bf4e2c5e3ebd663d706b46"; // Replace with your actual PDFShift API key
      const base64EncodedApiKey = btoa(`api:${apiKey}`);

      const response = await fetch("https://api.pdfshift.io/v3/convert/pdf", {
        method: "POST",
        headers: {
          Authorization: `Basic ${base64EncodedApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source: htmlContent,
          landscape: false,
          use_print: false,
        }),
      });

      // Check for successful response (HTTP 200 OK)
      if (!response.ok) {
        throw new Error(`PDFShift API error: ${response.statusText}`);
      }

      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "travel_details.pdf"; // File name for the downloaded PDF
      link.click();
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-6 mt-10">
      {/* Button to trigger PDF generation */}
      <button
        onClick={generatePDF}
        className="bg-blue-500 text-white py-2 px-6 rounded mt-5"
      >
        Download as PDF
      </button>

      {/* Display filtered travels in a table */}
      <div className="mt-10 w-full overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-left">Air Taxi Name</th>
              <th className="py-2 px-4 text-left">Departure</th>
              <th className="py-2 px-4 text-left">Departure Date & Time</th>
              <th className="py-2 px-4 text-left">Destination</th>
              <th className="py-2 px-4 text-left">Destination Date & Time</th>
              <th className="py-2 px-4 text-left">Ticket Fee (LKR)</th>
            </tr>
          </thead>
          <tbody>
            {filteredTravels.map((travel) => (
              <tr key={travel._id}>
                <td className="py-2 px-4">{travel.airtaxiName}</td>
                <td className="py-2 px-4">{travel.departure}</td>
                <td className="py-2 px-4">
                  {new Date(travel.departure_datetime).toLocaleString()}
                </td>
                <td className="py-2 px-4">{travel.destination}</td>
                <td className="py-2 px-4">
                  {new Date(travel.destination_datetime).toLocaleString()}
                </td>
                <td className="py-2 px-4">{travel.ticket_price} LKR</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RAirtaxitravelList;
