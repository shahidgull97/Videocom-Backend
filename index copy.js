// backend/server.js
// const express = require('express');
import express from "express";
// const http = require('http');
import http from "http";
// const { Server } = require('socket.io');
import { Server } from "socket.io";
// const mongoose = require('mongoose');
import mongoose from "mongoose";
// const dotenv = require('dotenv');
import dotenv from "dotenv";
dotenv.config();
// const cors = require('cors');
import cors from "cors";
// const bcrypt = require('bcryptjs');
import bcrypt from "bcryptjs";
// const jwt = require('jsonwebtoken');
import jwt from "jsonwebtoken";
// const User = require("./models/User");
import fs from "fs";
import router from "./src/user/user.router.js";
export const app = express();
const server = http.createServer(
  {
    key: fs.readFileSync("localhost-key.pem"), // Path to your SSL key
    cert: fs.readFileSync("localhost.pem"), // Path to your SSL certificate
  },
  app
);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api", router);

// WebRTC Signaling
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", (roomId) => {
    console.log(`[SERVER] User ${socket.id} is trying to join room: ${roomId}`);
    socket.join(roomId);
    socket.to(roomId).emit("user-joined", socket.id); // Notify others
    console.log(`User ${socket.id} joined room ${roomId}`);
    // Notify existing users in the room about the new user
    socket.to(roomId).emit("user-joined", socket.id);
  });

  socket.on("offer", ({ offer, roomId }) => {
    console.log(`Offer sent in room ${roomId}`);
    socket.to(roomId).emit("offer", { offer, sender: socket.id });
  });

  socket.on("answer", ({ answer, roomId }) => {
    console.log(`Answer sent in room ${roomId}`);
    socket.to(roomId).emit("answer", { answer, sender: socket.id });
  });

  socket.on("ice-candidate", ({ candidate, roomId }) => {
    console.log(`ICE Candidate sent in room ${roomId}`);
    socket.to(roomId).emit("ice-candidate", { candidate, sender: socket.id });
  });

  socket.on("send-message", ({ message, roomId }) => {
    socket.to(roomId).emit("receive-message", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

export default server;
