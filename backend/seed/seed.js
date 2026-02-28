require("dotenv").config();
const connectDB = require("../config/db");

const User = require("../models/User");
const OrderItem = require("../models/OrderItem");
const Order = require("../models/Order");
const StoreSettings = require("../models/StoreSettings");


// Helpers
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sampleOne(arr) {
  return arr[randInt(0, arr.length - 1)];
}

function sampleManyUnique(arr, count) {
  const copy = [...arr];
  const out = [];
  while (out.length < count && copy.length) {
    const idx = randInt(0, copy.length - 1);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}

function daysAgo(n) {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000);
}

function makeEmail(name, idx) {
  const base = name.toLowerCase().replace(/\s+/g, ".");
  return `${base}${idx}@example.com`;
}

// Use enum-valid questions from your schema/docs
const SECURITY_QUESTIONS = [
  "What is your mother's maiden name?",
  "What is the name of your first pet?",
  "What was your first car?",
  "What elementary school did you attend?",
  "What is the name of the town where you were born?",
  "Where did you meet your spouse?",
];

function pickTwoDifferentQuestions() {
  const q1 = sampleOne(SECURITY_QUESTIONS);
  let q2 = sampleOne(SECURITY_QUESTIONS);
  while (q2 === q1) q2 = sampleOne(SECURITY_QUESTIONS);
  return [q1, q2];
}


// Seed Data
const MENU = [
  { name: "Coffee (Latte)", price: 4, image: "" },
  { name: "Cappuccino", price: 5, image: "" },
  { name: "Espresso", price: 2, image: "" },
  { name: "Pao de Queijo", price: 1, image: "" },
  { name: "Chocolate Cake", price: 5, image: "" },
  { name: "Orange Juice", price: 5, image: "" },
  { name: "Misto Quente", price: 4, image: "" },
];

// Keep customerName length 2–10 
const USER_NAMES = [
  "Ana", "Bruno", "Carla", "Diego", "Elisa",
  "Fabio", "Gabi", "Hugo", "Iris", "Joao",
  "Kaya", "Lia", "Mia", "Noah", "Otto",
];


// Seed Function
async function seed() {
  await connectDB();

  console.log("🧹 Clearing collections...");
  await Promise.all([
    User.deleteMany({}),
    OrderItem.deleteMany({}),
    Order.deleteMany({}),
    StoreSettings.deleteMany({}),
  ]);

  console.log("🏪 Creating StoreSettings...");
  await StoreSettings.create({
    weeklySchedule: {
      sunday: { open: "00:01", close: "23:59", enabled: true },
      monday: { open: "00:01", close: "23:59", enabled: true },
      tuesday: { open: "00:01", close: "23:59", enabled: true },
      wednesday: { open: "00:01", close: "23:59", enabled: true },
      thursday: { open: "00:01", close: "23:59", enabled: true },
      friday: { open: "00:01", close: "23:59", enabled: true },
      saturday: { open: "00:01", close: "23:59", enabled: true },
    },
    manualOverride: { status: null, expiresAt: null },
  });

  console.log("🍽️ Creating OrderItems...");
  const orderItems = await OrderItem.insertMany(
    MENU.map((i) => ({
      name: i.name,
      price: i.price,
      image: i.image,
      inStock: true,
    }))
  );

  const itemIds = orderItems.map((i) => i._id);

  console.log("👤 Creating 15 users (all customers first)...");
  const password = "Password123!";

  // Create users via User.create so pre('save') bcrypt hooks run
  const users = [];
  for (let i = 0; i < 15; i++) {
    const name = USER_NAMES[i];
    const email = makeEmail(name, i);

    const [q1, q2] = pickTwoDifferentQuestions();

    const user = await User.create({
      name,
      email,
      password,
      account: "user",
      securityQuestions: [
        { question: q1, answer: "seedAnswer1" },
        { question: q2, answer: "seedAnswer2" },
      ],
      favorites: [],
      recent: [],
    });

    users.push(user);
  }

  console.log("🕒 Setting createdAt spread across last 90 days...");
  // Update createdAt AFTER creation
  for (const u of users) {
    const createdAt = daysAgo(randInt(0, 90));
    await User.updateOne(
      { _id: u._id },
      { $set: { createdAt, updatedAt: createdAt } },
      { timestamps: false }
    );
  }

  console.log("⭐ Adding favorites (0–3) and recents (0–5)...");
  // Reload users fresh (with correct timestamps)
  const freshUsers = await User.find({}).lean();

  for (const u of freshUsers) {
    // Some get neither, some only recents, etc.
    const favoritesCount = randInt(0, 3);
    const recentCount = randInt(0, 5);

    const favorites = sampleManyUnique(itemIds, favoritesCount);
    const recent = sampleManyUnique(itemIds, recentCount);

    await User.updateOne(
      { _id: u._id },
      { $set: { favorites, recent } }
    );
  }

  console.log("🧑‍💼 Upgrading 3 workers + 1 admin...");
  // pick last 4 users to upgrade
  const upgraded = await User.find({}).sort({ createdAt: 1 }).limit(4);
  await User.updateOne({ _id: upgraded[0]._id }, { $set: { account: "admin" } });
  await User.updateOne({ _id: upgraded[1]._id }, { $set: { account: "worker" } });
  await User.updateOne({ _id: upgraded[2]._id }, { $set: { account: "worker" } });
  await User.updateOne({ _id: upgraded[3]._id }, { $set: { account: "worker" } });

  console.log("🧾 Creating 25 orders (mix of user-like + guest)...");
  const finalUsers = await User.find({}).sort({ createdAt: 1 });

  const ordersToCreate = [];
  for (let i = 0; i < 25; i++) {
    const fromUser = i < 12; // ~half from “users”, rest guests
    const customerName = fromUser
      ? sampleOne(finalUsers).name
      : `Guest${String(i - 11).padStart(2, "0")}`; // Guest01 etc (<=10 chars)

    // 1–4 items per order
    const itemsInOrder = randInt(1, 4);
    const pickedItems = sampleManyUnique(orderItems, itemsInOrder);

    const orderItemsPayload = pickedItems.map((it) => {
      const quantity = randInt(1, 3);
      return {
        item: it._id,
        quantity,
        priceAtPurchase: it.price,
      };
    });

    const totalPrice = orderItemsPayload.reduce(
      (sum, oi) => sum + oi.priceAtPurchase * oi.quantity,
      0
    );

    // Some variety in status
    const statusOptions = ["PLACED", "IN PROGRESS", "READY", "COMPLETED", "CANCELLED"];
    const status = sampleOne(statusOptions);

    // Spread orders across last 30 days
    const createdAt = daysAgo(randInt(0, 30));

    ordersToCreate.push({
      customerName,
      status,
      orderItems: orderItemsPayload,
      totalPrice,
      createdAt,
      updatedAt: createdAt,
    });
  }

  // Insert orders with explicit timestamps
  await Order.insertMany(ordersToCreate);

  console.log("✅ Seed complete!");
  console.log("Login password for all users:", password);
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});