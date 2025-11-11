import express from "express";
import authRoutes from "./routes/auth.routes.js";
import searchRoutes from "./routes/search.routes.js";
import bookShelfRoutes from "./routes/bookshelf.route.js";
import homeRoutes from "./routes/homeRoutes.js";
import { connectDB } from "./config/db.js";
import cors from "cors";
import { protectRoute } from "./middleware/protectRoute.js";
import cookieParser from "cookie-parser";
import part from "path";

const app = express();
const _dirname = path.resolve()
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // if you're using cookies or auth headers
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/home", homeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/search", protectRoute, searchRoutes);
app.use("/api/bookshelf", protectRoute, bookShelfRoutes);

if(ENV_VARS.NODE_ENV === "production") {
  app.use(express.static(path.join(_dirname,"/frontend/dist")));
  app.get("*",(req,res) => {
    res.sendFile(path.resolve(_dirname,"frontend","dist","index.html"))
  })
}

app.listen("3000", () => {
  console.log("listening on port 3000");
  connectDB();
});
