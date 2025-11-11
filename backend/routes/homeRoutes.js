import express from "express";
import { setHome } from "../contollers/home.controller.js";
const router = express.Router();

router.get("/:term", setHome);

export default router;
