import axios from "axios";
import { User } from "../model/user.model.js";

export const addToBookShelf = async (req, res) => {
  const { key } = req.params;

  try {
    // Fetch book details from OpenLibrary API
    const { data } = await axios.get(
      `https://openlibrary.org/works/${key}.json`
    );

    if (!data) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Fetch author names
    let authorNames = [];
    if (data.authors && Array.isArray(data.authors)) {
      const authorPromises = data.authors.map(async (a) => {
        const authorKey = a.author?.key;
        if (authorKey) {
          try {
            const authorRes = await axios.get(
              `https://openlibrary.org${authorKey}.json`
            );
            return authorRes.data?.name || "Unknown Author";
          } catch (err) {
            console.error(`Error fetching author ${authorKey}:`, err.message);
            return "Unknown Author";
          }
        }
        return "Unknown Author";
      });

      authorNames = await Promise.all(authorPromises);
    }

    const book = {
      olKey: key,
      title: data.title || "Untitled",
      authors: authorNames,
      cover_id: data.covers?.[0] || null,
      addedAt: new Date(),
    };

    // Ensure req.user exists
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    // Check if book already exists in user's bookshelf
    const user = await User.findById(req.user._id);
    const alreadyExists = user.bookShelf.some((b) => b.olKey === key);

    if (alreadyExists) {
      return res.status(409).json({ message: "Book already in bookshelf" });
    }

    // Add book to user's bookshelf
    user.bookShelf.push(book);
    await user.save();

    res.status(200).json({ message: "Book added to bookshelf", book });
  } catch (error) {
    console.error("Error in addToBookShelf:", error.stack);
    res
      .status(500)
      .json({ message: "Error adding book", error: error.message });
  }
};

export const getFromBookShelf = async (req, res) => {
  console.log("📚 bookshelf.route.js loaded");

  try {
    // Ensure the user is authenticated
    if (!req.user || !req.user._id) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: User not found" });
    }
    console.log("📚 req.user in getFromBookShelf:", req.user);

    // Fetch the user from the database
    const user = await User.findById(req.user._id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Return the bookshelf (empty array if none)
    const bookshelf = Array.isArray(user.bookShelf) ? user.bookShelf : [];
    console.log("📚 Bookshelf returned:", bookshelf);

    return res.status(200).json({ success: true, bookshelf });
  } catch (error) {
    console.error("Error fetching bookshelf:", error.stack);
    return res.status(500).json({
      success: false,
      message: "Error fetching bookshelf",
      error: error.message,
    });
  }
};

export const deleteFromBookShelf = async (req, res) => {
  const { key } = req.params;

  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { bookShelf: { olKey: key } } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Book removed from bookshelf" });
  } catch (error) {
    console.error("Error removing book:", error.stack);
    res
      .status(500)
      .json({ message: "Error removing book", error: error.message });
  }
};
