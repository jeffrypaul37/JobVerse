/* Author: Sivaprakash Chittu Hariharan */
import { Router } from "express";
import { searchJobs } from "../../../controllers/searchController.js";

const router = Router();

// Route to handle job search requests
router.get('/', searchJobs);

export default router;
