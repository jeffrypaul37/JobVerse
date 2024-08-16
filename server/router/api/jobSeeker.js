/* Jayrajsinh Mahavirsinh Jadeja */

import multer from "multer";
import { Router } from "express";
import {
  getAllJobs,
  getJobById,
  applyForJob,
  getApplicantsByJobId,
  getUserApplications,
  addBookmark,
  removeBookmark,
  getBookmarksByUser,
} from "../../controllers/jobSeekerController.js";

import Auth from "../../middleware/auth.js";

const router = Router();

// Configure multer for handling file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Route to get all jobs
router.get("/jobs", getAllJobs);

// Route to apply for a job, handling resume and cover letter uploads
router.post(
  "/apply",
  upload.fields([{ name: "resume" }, { name: "coverLetter" }]),
  applyForJob
);

// Route to get job details by ID
router.get("/jobs/:id", getJobById);

// Route to get applicants for a job by job ID
router.get("/applicants/:id", getApplicantsByJobId);

// Route to get user applications by email
router.get("/applications/:email", getUserApplications);

// Route to add a bookmark
// router.post("/bookmark", addBookmark);

router
  .route("/bookmark")
  .post(Auth, addBookmark);

// Route to remove a bookmark
// router.post("/unbookmark", removeBookmark);
router
  .route("/unbookmark")
  .post(Auth, removeBookmark);


// router.post('/userBookmarks', getBookmarksByUser);

router
  .route("/userBookmarks")
  .post(Auth, getBookmarksByUser);

export default router;
