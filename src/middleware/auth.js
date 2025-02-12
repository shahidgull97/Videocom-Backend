import jwt from "jsonwebtoken";

import UserModel from "../user/user.model.js";

export const auth = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(400).json({ error: "User not found Please sign up" });
  }
  const decodedData = await jwt.verify(token, process.env.JWT_Secret);
  req.user = await UserModel.findById(decodedData.id);
  next();
};
