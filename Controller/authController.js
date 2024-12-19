const { db, admin } = require("../Config/firebase");
const { hashPassword, verifyPassword } = require("../utils/passwordUtils");
const { generateToken } = require("../utils/jwtUtils");
const Joi = require("joi");

// Validation schemas
const registerSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string()
    .pattern(/^\+\d{10,15}$/)
    .required(),
  password: Joi.string().min(8).required(),
});

const validateRegistration = (req, res, next) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

// Registration
const register = async (req, res) => {
  try {
    const { name, email, phoneNumber, password } = req.body;
    const hashedPassword = await hashPassword(password);

    // Create user in Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email,
      password,
      phoneNumber,
      displayName: name,
    });

    // Store additional user data in Firestore
    await db
      .collection("Users")
      .doc(userRecord.uid)
      .set({
        user_id: userRecord.uid,
        name,
        email,
        phoneNumber,
        password: hashedPassword,
        preferences: { language: "English", notifications: true },
        status: "Active",
        created_at: admin.firestore.FieldValue.serverTimestamp(),
        updated_at: admin.firestore.FieldValue.serverTimestamp(),
      });
    const token = generateToken(userRecord.uid);
    res.status(201).json({
      message: "User registered successfully",
      user_id: userRecord.uid,
      token,
    });
  } catch (error) {
    console.error("Error registering user:", error.message);
    res
      .status(500)
      .json({ error: "Registration failed", details: error.message });
  }
};
// Login
const login = async (req, res, next) => {
  console.log(req.body);
  const { email, password } = req.body;

  try {
    const userRecord = await admin.auth().getUserByEmail(email);

    const userDoc = await db.collection("Users").doc(userRecord.uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({ message: "User not found in database" });
    }

    const userData = userDoc.data();
    const isPasswordValid = await verifyPassword(password, userData.password);

    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken({ userId: userRecord.uid });
    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    next(err);
  }
};

// Get Profile
const getProfile = async (req, res, next) => {
  try {
    console.log(req.user.userId);
    const userRef = db.collection("Users").doc(req.user.userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists)
      return res.status(404).json({ message: "User not found" });
    const userData = userDoc.data();
    delete userData.password;
    res.status(200).json(userData);
  } catch (err) {
    next(err);
  }
};

// Update Profile
const updateProfile = async (req, res, next) => {
  try {
    const { name, email, phoneNumber } = req.body;
    const userId = req.user.userId;

    // Check for duplicate email or phone (excluding the current user)
    const userExists = await Promise.all([
      db.collection("Users").where("email", "==", email).get(),
      db.collection("Users").where("phoneNumber", "==", phoneNumber).get(),
    ]);

    if (
      (userExists[0].size && userExists[0].docs[0].id !== userId) ||
      (userExists[1].size && userExists[1].docs[0].id !== userId)
    ) {
      return res
        .status(400)
        .json({ message: "Email or Phone number already in use" });
    }

    // Update Firebase Authentication if email or phone number has changed
    const userRecord = await admin.auth().getUser(userId);
    const updates = {};

    if (email !== userRecord.email) updates.email = email;
    if (phoneNumber !== userRecord.phoneNumber)
      updates.phoneNumber = phoneNumber;

    if (Object.keys(updates).length) {
      await admin.auth().updateUser(userId, updates);
    }

    // Update user data in Firestore
    await db
      .collection("Users")
      .doc(userId)
      .update({ name, email, phoneNumber });

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (err) {
    next(err);
  }
};

// Export routes
module.exports = {
  register: [validateRegistration, register],
  login,
  getProfile,
  updateProfile,
};
