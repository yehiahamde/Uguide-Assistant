const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

// User Schema
const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 100,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
    },
    confirmPassword: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
    },
    nationality: {
      type: String,
      required: true,
      trim: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Generate Token
UserSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id, isAdmin: this.isAdmin }, process.env.JWT_SECRET_KEY);
};

// User Model
const User = mongoose.model("User", UserSchema);

// Validate Register User
function validateRegisterUser(obj) {
  const schema = Joi.object({
    email: Joi.string().trim().min(5).max(100).required().email(),
    fullName: Joi.string().trim().min(2).max(200).required(),
    nationality: Joi.string().trim().min(2).max(200),
    password: Joi.string().trim().min(6).required(),
    confirmPassword: Joi.string().trim().min(6).required(),
  });
  return schema.validate(obj);
}

// Validate Login User
function validateLoginUser(obj) {
  const schema = Joi.object({
    email: Joi.string().trim().min(5).max(100).required().email(),
    password: Joi.string().trim().min(6).required(),
  });
  return schema.validate(obj);
}

// Validate Change Password
function validateChangePassword(obj) {
  const schema = Joi.object({
    password: Joi.string().trim().min(6).required(),
  });
  return schema.validate(obj);
}

// Validate Update User
function validateUpdateUser(obj) {
  const schema = Joi.object({
    email: Joi.string().trim().min(5).max(100).email(),
    fullName: Joi.string().trim().min(2).max(200).required(),
    nationality: Joi.string().trim().min(2).max(200).required(),
    password: Joi.string().trim().min(6),
    isAdmin: Joi.boolean().required(), // Adding isAdmin field validation
  });
  return schema.validate(obj);
}

// Validate Add User
function validateAddUser(obj) {
  const schema = Joi.object({
    email: Joi.string().trim().min(5).max(100).required().email(),
    fullName: Joi.string().trim().min(2).max(200).required(),
    nationality: Joi.string().trim().min(2).max(200).required(),
    password: Joi.string().trim().min(6).required(),
    confirmPassword: Joi.string().trim().min(6).required(),
    isAdmin: Joi.boolean().required(), // Adding isAdmin field validation
  });
  return schema.validate(obj);
}


module.exports = {
  User,
  validateLoginUser,
  validateRegisterUser,
  validateAddUser,
  validateUpdateUser,
  validateChangePassword,
};
