const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { User, validateUpdateUser, validateAddUser } = require("../models/Users");

/**
 *  @desc    Update User
 *  @route   /api/users/:id
 *  @method  PUT
 *  @access  private (only admin & user himself)
 */
module.exports.updateUser = asyncHandler(async (req, res) => {
  // Check if the user making the request is an admin or the user themselves
  if (!req.user.isAdmin && req.user.id !== req.params.id) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const { error } = validateUpdateUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // Check if password is provided and hash it if necessary
  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }

  // Construct the update object with allowed fields
  const updateObj = {};
  if (req.body.email) updateObj.email = req.body.email;
  if (req.body.password) updateObj.password = req.body.password;
  if (req.body.username) updateObj.username = req.body.username;
  if (req.body.fullName) updateObj.fullName = req.body.fullName;
  if (req.body.nationality) updateObj.nationality = req.body.nationality;
  if (req.body.isAdmin !== undefined) updateObj.isAdmin = req.body.isAdmin; // Include isAdmin if provided

  // Update the user document
  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    { $set: updateObj },
    { new: true }
  ).select("-password");

  if (!updatedUser) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json(updatedUser);
});


/**
 *  @desc    Get All Users
 *  @route   /api/users
 *  @method  GET
 *  @access  private (only admin)
 */
module.exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  res.status(200).json(users);
});

/**
 *  @desc    Get User By Id
 *  @route   /api/users/:id
 *  @method  GET
 *  @access  private (only admin & user himself)
 */
module.exports.getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: "user not found" });
  }
});

/**
 *  @desc    Delete User
 *  @route   /api/users/:id
 *  @method  DELETE
 *  @access  private (only admin & user himself)
 */
module.exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "user has been deleted successfully" });
  } else {
    res.status(404).json({ message: "user not found" });
  }
});

/**
 *  @desc    Add User
 *  @route   /api/users
 *  @method  POST
 *  @access  private (only admin)
 */
module.exports.addUser = asyncHandler(async (req, res) => {
  const { error } = validateAddUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { email, password, username, fullName, nationality, confirmPassword, isAdmin } = req.body; // Added isAdmin here

  let existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User with this email already exists" });
  }

  // Check if password and confirmPassword match
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    email,
    password: hashedPassword,
    username,
    fullName,
    nationality,
    confirmPassword: hashedPassword,
    isAdmin, // Added isAdmin to the newUser object
  });

  await newUser.save();

  // Generate token for the newly registered user
  const token = newUser.generateToken();

  // Optionally, you may choose to send additional user data along with the token
  const responseData = {
    user: newUser.toObject(),
    token,
  };

  res.status(201).json(responseData);
});