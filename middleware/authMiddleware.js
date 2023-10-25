const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const sgMail = require("@sendgrid/mail");
const { nanoid } = require("nanoid");
const jwtSecret = process.env.JWT_SECRET;
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    const user = await User.findById(decoded.userId);

    if (!user || user.token !== token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized" });
  }
};

const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const verificationToken = nanoid();
    const newUser = new User({ email, password, verificationToken });

    await newUser.save();

    const msg = {
      to: newUser.email,
      from: "noreply@example.com",
      subject: "Email Verification",
      text: "To verify your email, click the following link:",
      html: `<a href="${process.env.BASE_URL}/users/verify/${newUser.verificationToken}">Click here to verify your email</a>`,
    };

    sgMail.send(msg);

    res
      .status(201)
      .json({
        message:
          "User registered successfully. Check your email for verification instructions.",
      });
  } catch (error) {
    res.status(500).json({ message: "Registration failed" });
  }
};

module.exports = { authMiddleware, registerUser };
