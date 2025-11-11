import express from "express";
import {
  addToBookShelf,
  getFromBookShelf,
  deleteFromBookShelf,
} from "../contollers/bookshelf.controller.js";
const router = express.Router();

router.post("/v1/:key", addToBookShelf);
router.get("/v1", getFromBookShelf);
router.delete("/v1/:key", deleteFromBookShelf);

export default router;
