import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

//type
interface Book {
  olKey: string;
  title: string;
  authors: string[];
  cover_id: string;
  description: string;
}
interface BookshelfState {
  bookshelf: Book[];
  isAddingToBookshelf: boolean;
  isFetchingBookshelf: boolean;
  isDeletingFromBookshelf: boolean;
  deletingBookId: string | null;
  error: string | null;
}

// Add book to bookshelf
export const addToBookshelf = createAsyncThunk<Book, string>(
  "user/addToBookshelf",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/bookshelf/v1/${id}`,
        {},
        { withCredentials: true }
      );
      toast.success("Book added successfully");
      return response.data as Book; // ✅ cast to Book
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`There was an error: ${error.message}`);
        console.error("addToBookshelf failed:", error.message);
        return rejectWithValue(error.message); // ✅ reject with message
      }
      return rejectWithValue("Unknown error");
    }
  }
);

export const deleteFromBookshelf = createAsyncThunk<string, string>(
  "user/deleteFromBookshelf",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`http://localhost:3000/api/bookshelf/v1/${id}`, {
        withCredentials: true,
      });
      toast.success("Book deleted successfully");
      return id; // ✅ always return a string
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`There was an error: ${error.message}`);
        console.error("deleteFromBookshelf failed:", error.message);
        return rejectWithValue(error.message); // ✅ reject with a string message
      }
      return rejectWithValue("Unknown error"); // ✅ fallback reject
    }
  }
);

// Get bookshelf data
export const getBookshelf = createAsyncThunk(
  "user/getBookshelf",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/bookshelf/v1`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Failed to fetch bookshelf: ${error.message}`);
        console.error("getBookshelf failed:", error.message);
        return rejectWithValue(null);
      }
    }
  }
);
const initialState: BookshelfState = {
  bookshelf: [],
  isAddingToBookshelf: false,
  isFetchingBookshelf: false,
  isDeletingFromBookshelf: false,
  deletingBookId: null,
  error: null,
};

const bookshelfSlice = createSlice({
  name: "bookshelf",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Add to bookshelf
      .addCase(addToBookshelf.pending, (state) => {
        state.isAddingToBookshelf = true;
      })
      .addCase(addToBookshelf.fulfilled, (state, action) => {
        state.isAddingToBookshelf = false;
        state.bookshelf.push(action.payload);
      })
      .addCase(addToBookshelf.rejected, (state) => {
        state.isAddingToBookshelf = false;
      })

      // delete from bookshelf
      .addCase(deleteFromBookshelf.pending, (state, action) => {
        state.isDeletingFromBookshelf = true;
        state.deletingBookId = action.meta.arg;
      })
      .addCase(deleteFromBookshelf.fulfilled, (state, action) => {
        state.isDeletingFromBookshelf = false;
        state.deletingBookId = null;
        state.bookshelf = state.bookshelf.filter(
          (book) => book.olKey !== action.payload
        );
      })
      .addCase(deleteFromBookshelf.rejected, (state) => {
        state.isDeletingFromBookshelf = false;
        state.deletingBookId = null;
      })

      // Get bookshelf
      .addCase(getBookshelf.pending, (state) => {
        state.isFetchingBookshelf = true;
      })
      .addCase(getBookshelf.fulfilled, (state, action) => {
        state.isFetchingBookshelf = false;
        state.bookshelf = action.payload.bookshelf || [];
      })
      .addCase(getBookshelf.rejected, (state) => {
        state.isFetchingBookshelf = false;
      });
  },
});

export default bookshelfSlice.reducer;
