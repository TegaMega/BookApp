import express from "express";
import { search } from "../contollers/search.controller.js";
const router = express.Router();

router.get("/:query", search);

export default router;
