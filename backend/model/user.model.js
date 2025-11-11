import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  olKey: { type: String, required: true },
  title: { type: String, required: true },
  authors: { type: [String], default: [] },
  cover_id: { type: Number, default: null },
  addedAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: { type: String, default: "" },
  bookShelf: { type: [bookSchema], default: [] }, // 👈 structured array
});

export const User = mongoose.model("User", userSchema);
