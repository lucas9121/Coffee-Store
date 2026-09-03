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
  { name: "Coffee", price: 4, image: "", category: "coffee" },
  { name: "Latte", price: 6, image: "", category: "coffee" },
  { name: "Espresso", price: 2, image: "", category: "coffee" },
  { name: "Cappuccino", price: 6, image: "", category: "coffee" },
  { name: "Iced Coffee", price: 7, image: "", category: "coffee" },
  { name: "Pao de Queijo", price: 1, image: "", category: "food" },
  { name: "Misto Quente", price: 6, image: "", category: "food" },
  { name: "Orange Juice", price: 7, image: "", category: "juice" },
  { name: "Chocolate Cake", price: 5, image: "", category: "dessert" },
];

// Keep customerName length 2–10
const USER_NAMES = [
  "Ana",
  "Bruno",
  "Carla",
  "Diego",
  "Elisa",
  "Fabio",
  "Gabi",
  "Hugo",
  "Iris",
  "Joao",
  "Kaya",
  "Lia",
  "Mia",
  "Noah",
  "Otto",
];

const GUEST_NAMES = [
  "Guest01",
  "Guest02",
  "Guest03",
  "Guest04",
  "Guest05",
  "Guest06",
  "Guest07",
  "Guest08",
  "Guest09",
  "Guest10",
  "Guest11",
  "Guest12",
  "Guest13",
];

const ORDER_SOURCES = ["MOBILE", "IN PERSON"];

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
      category: i.category,
      inStock: true,
      isVisible: true,
    }))
  );

  const itemIds = orderItems.map((i) => i._id);

  const password = "Password123!";

  console.log("👑 Creating admin account...");
  {
    const [q1, q2] = pickTwoDifferentQuestions();

    const admin = await User.create({
      name: "Admin",
      email: "admin@example.com",
      password,
      account: "admin",
      securityQuestions: [
        { question: q1, answer: "seedAnswer1" },
        { question: q2, answer: "seedAnswer2" },
      ],
      favorites: [],
      recent: [],
    });

    const createdAt = daysAgo(randInt(0, 60));
    await User.collection.updateOne(
      { _id: admin._id },
      { $set: { createdAt, updatedAt: createdAt } }
    );
  }

  console.log("🧑‍💼 Creating worker accounts...");
  const workerNames = ["Worker", "Pedro", "Marcos"];
  const workerEmails = [
    "worker@example.com",
    "pedro.worker@example.com",
    "marcos.worker@example.com",
  ];

  for (let i = 0; i < workerNames.length; i++) {
    const [q1, q2] = pickTwoDifferentQuestions();

    const worker = await User.create({
      name: workerNames[i],
      email: workerEmails[i],
      password,
      account: "worker",
      securityQuestions: [
        { question: q1, answer: "seedAnswer1" },
        { question: q2, answer: "seedAnswer2" },
      ],
      favorites: [],
      recent: [],
    });

    const createdAt = daysAgo(randInt(0, 60));
    await User.collection.updateOne(
      { _id: worker._id },
      { $set: { createdAt, updatedAt: createdAt } }
    );
  }

  console.log("👤 Creating 15 customer users...");
  const customerUsers = [];

  for (let i = 0; i < 15; i++) {
    const name = USER_NAMES[i];
    const email = makeEmail(name, i);

    const [q1, q2] = pickTwoDifferentQuestions();

    const user = await User.create({
      name,
      email,
      password,
      account: "user",
      expoPushToken: null,
      securityQuestions: [
        { question: q1, answer: "seedAnswer1" },
        { question: q2, answer: "seedAnswer2" },
      ],
      favorites: [],
      recent: [],
    });

    customerUsers.push(user);
  }

  console.log("🕒 Setting createdAt spread across last 60 days...");
  for (const u of customerUsers) {
    const createdAt = daysAgo(randInt(0, 60));
    await User.collection.updateOne(
      { _id: u._id },
      { $set: { createdAt, updatedAt: createdAt } }
    );
  }

  console.log("⭐ Adding favorites (0–3) and recents (0–5)...");
  const allUsers = await User.find({}).lean();

  for (const u of allUsers) {
    const favoritesCount = randInt(0, 3);
    const recentCount = randInt(0, 5);

    const favorites = sampleManyUnique(itemIds, favoritesCount);
    const recent = sampleManyUnique(itemIds, recentCount);

    await User.updateOne(
      { _id: u._id },
      { $set: { favorites, recent } }
    );
  }

  console.log("📱 Assigning source groups to customer users and guests...");
  // Each person gets only one source type, never both.
  const customerSourceMap = new Map();
  const guestSourceMap = new Map();

  const freshCustomerUsers = await User.find({ account: "user" }).sort({ createdAt: 1 });

  for (const user of freshCustomerUsers) {
    customerSourceMap.set(user._id.toString(), sampleOne(ORDER_SOURCES));
  }

  for (const guestName of GUEST_NAMES) {
    guestSourceMap.set(guestName, sampleOne(ORDER_SOURCES));
  }

  console.log("🧾 Creating 25 orders (mix of customer users + guests)...");
  const ordersToCreate = [];

  for (let i = 0; i < 25; i++) {
    const fromUser = i < 12; // about half customer users, rest guests

    let customerName;
    let source;
    let user = null;

    if (fromUser) {
      const pickedUser = sampleOne(freshCustomerUsers);
      customerName = pickedUser.name;
      source = customerSourceMap.get(pickedUser._id.toString());
      user = pickedUser._id
    } else {
      const guestName = sampleOne(GUEST_NAMES);
      customerName = guestName;
      source = guestSourceMap.get(guestName);
    }

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

    const statusOptions = ["PLACED", "IN PROGRESS", "READY", "COMPLETED", "CANCELLED"];
    const status = sampleOne(statusOptions);

    const createdAt = daysAgo(randInt(0, 30));

    ordersToCreate.push({
      customerName,
      user,
      status,
      source,
      orderItems: orderItemsPayload,
      totalPrice,
      createdAt,
      updatedAt: createdAt,
    });
  }

  await Order.insertMany(ordersToCreate);

  console.log("✅ Seed complete!");
  console.log("Admin login: admin@example.com");
  console.log("Worker login: worker@example.com");
  console.log("Login password for all users:", password);

  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});