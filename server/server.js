const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const destinationRoutes = require("./routes/destinationRoutes");
const postRoutes = require("./routes/postRoutes");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use("/api/destinations", destinationRoutes);
app.use("/api/posts", postRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
