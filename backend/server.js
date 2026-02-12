const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db")
// const orderRoutes = require("./routes/orderRoutes");
// const kioskRoutes = require("./routes/kioskRoutes");

require("dotenv").config();

const app = express();

// Middleware
app.use(cors())
app.use(express.json());

// Connect to DB
connectDB();

// Routes
// app.use("/orders", orderRoutes);
// app.use("/kiosk", kioskRoutes);


const PORT = process.env.PORT || 3002;

app.listen(PORT, function(){
  console.log("Backend running on port: ", PORT)
})