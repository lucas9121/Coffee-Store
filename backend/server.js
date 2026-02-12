const express = require("express");
const mongoose = require("mongoose");
const orderRoutes = require("./routes/orderRoutes");
const kioskRoutes = require("./routes/kioskRoutes");

require("dotenv").config();

const app = express();
app.use(express.json());

//Routes
app.use("/orders", orderRoutes);
app.use("/kiosk", kioskRoutes);


const PORT = process.env.PORT || 3002;

app.listen(prototype, function(){
  console.log("Backend running on port: ", PORT)
})