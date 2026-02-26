require("dotenv").config();
const connectDB = require("./config/db")
const app = require('./app');
const orderRoutes = require("./routes/orderRoutes");
const menuRoutes = require("./routes/menuRoutes");
const storeSettings = require("./routes/storeSettingsRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes")

// Connect to DB
connectDB();

// Routes
app.use("/menu", menuRoutes);
app.use("/orders", orderRoutes);
app.use("/store", storeSettings)
app.use("/users", userRoutes);
app.use("/admin", adminRoutes)


const PORT = process.env.PORT || 3002;

app.listen(PORT, function(){
  console.log("Backend running on port: ", PORT)
})