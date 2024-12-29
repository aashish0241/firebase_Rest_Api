const { validateRegistration, validateUpdate } = require("../Utils/validation");
const authService = require("../Service/authService");

// Registration
const register = async (req, res) => {
  try {
    const registration = await authService.registerService(req.body);

    res.status(201).json({
      message: "User registered successfully",
      user_id: registration.user_id,
      token: registration.token,
    });
  } catch (error) {
    next(error);
  }
};

// Login
const login = async (req, res, next) => {
  try {
    const login = await authService.loginService(req.body);

    res.status(200).json({ message: "Login successful", token: login.token });
  } catch (err) {
    next(err);
  }
};

// Get Profile
const getProfile = async (req, res, next) => {
  try {
    const getProfile = await authService.getUserService(req.body);
    res.status(200).json(getProfile);
  } catch (err) {
    next(err);
  }
};

// Update Profile
const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const updateProfile = await authService.updateProfileService(
      req.body,
      userId
    );
    res.status(200).json(updateProfile);
  } catch (err) {
    next(err);
  }
};

// Export routes
module.exports = {
  register: [validateRegistration, register],
  login,
  getProfile,
  updateProfile: [validateUpdate, updateProfile],
};
