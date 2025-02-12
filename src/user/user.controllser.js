import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModel from "./user.model.js";

// Register User
export const SignUp = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new UserModel({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error signing up" });
  }
};

// Login User
export const Login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, username: user.username },
      "SECRET",
      { expiresIn: "1h" }
    );
    res
      .cookie("jwtToken", token, { maxAge: 1 * 60 * 60 * 1000, httpOnly: true })
      .json({ success: true, msg: "user login successful", token });
    // res.json({ token, username: user.username });
  } catch (error) {
    res.status(500).json({ error: "Error logging in" });
  }
};
