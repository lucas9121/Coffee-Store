require("dotenv").config();
const connectDB = require("./config/db")
const app = require('./app');
const orderRoutes = require("./routes/orderRoutes");
const menuRoutes = require("./routes/menuRoutes")
// const kioskRoutes = require("./routes/kioskRoutes");

// Connect to DB
connectDB();

// Routes
app.use("/menu", menuRoutes);
app.use("/orders", orderRoutes);
// app.use("/kiosk", kioskRoutes);


const PORT = process.env.PORT || 3002;

app.listen(PORT, function(){
  console.log("Backend running on port: ", PORT)
})