const { db, admin } = require("../Config/firebase");
const { hashPassword, verifyPassword } = require("../utils/passwordUtils");
const { generateToken } = require("../utils/jwtUtils");
const { validateRegistration, validateUpdate } = require("../Utils/validation");
const registerService = async (userData) => {
  const { name, email, phoneNumber, password } = userData;

  try {
    if (!email || !phoneNumber || !password || !name) {
      const error = new Error("Missing required fields");
      error.status = 400;
      throw error;
    }
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
    return { token: token, user_id: userRecord.uid };
  } catch (error) {
    console.error("Error in registerService:", error.message);
    throw error;
  }
};

const loginService = async ({ email, password }) => {
  try {
    const userRecord = await admin.auth().getUserByEmail(email);

    const userDoc = await db.collection("Users").doc(userRecord.uid).get();
    if (!userDoc.exists) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }

    const userData = userDoc.data();
    const isPasswordValid = await verifyPassword(password, userData.password);

    if (!isPasswordValid) {
      const error = new Error("Invalid Credentials");
      error.status = 400;
      throw error;
    }
    const token = generateToken({ userId: userRecord.uid });
    return { message: "Login successful", token };
  } catch (error) {
    console.error("Error in LoginService:", error.message);
    throw error;
  }
};

const getUserService = async ({ userId }) => {
  try {
    const userRef = db.collection("Users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }
    const userData = userDoc.data();
    delete userData.password;
    return { userData };
  } catch (error) {
    console.error("Error in getUserService:", error.message);
    throw error;
  }
};
const updateProfileService = async (userData, userId) => {
  const { name, email, phoneNumber } = userData;
  try {

    // Check for duplicate email or phone (excluding the current user)
    const userExists = await Promise.all([
      db.collection("Users").where("email", "==", email).get(),
      db.collection("Users").where("phoneNumber", "==", phoneNumber).get(),
    ]);

    if (
      (userExists[0].size && userExists[0].docs[0].id !== userId) ||
      (userExists[1].size && userExists[1].docs[0].id !== userId)
    ) {
      const error = new Error("Email or Phone number already in use");
      error.status = 400;
      throw error;
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

    return { message: "Profile updated successfully" };
  } catch (error) {
    console.error("Error in updateProfileService:", error.message);
    throw error;
  }
};

module.exports = {
  registerService : validateRegistration , registerUser,
  loginService,
  getUserService,
  updateProfileService,
};
