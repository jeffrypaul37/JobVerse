/* Jayrajsinh Mahavirsinh Jadeja */

import Job from "../model/Job.js";
import Applicant from "../model/Applicants.js";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import dotenv from "dotenv";
import UserModel from "../model/User.model.js";
import { sendNotification } from "../config/socketConnection.js";

dotenv.config();

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer for handling file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Function to upload a file to Cloudinary
const uploadToCloudinary = async (file) => {
  if (!file || !file.buffer) {
    throw new Error("Invalid file object");
  }

  const fileBuffer =
    file.buffer instanceof ArrayBuffer ? Buffer.from(file.buffer) : file.buffer;

  // Set a timeout for the upload request
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Request timed out")), 30000)
  );

  // Promise to handle Cloudinary upload
  const uploadPromise = new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ resource_type: "auto" }, (error, result) => {
        if (error) {
          console.error("Cloudinary error:", error);
          reject(error);
        } else {
          resolve(result);
        }
      })
      .end(fileBuffer);
  });

  return Promise.race([uploadPromise, timeout]);
};

// Controller to get all jobs
export async function getAllJobs(req, res) {
  try {
    const jobs = await Job.find();
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Controller to apply for a job
export const applyForJob = async (req, res) => {
  const { name, email, jobId } = req.body;
  const resumeFile = req.files?.resume;
  const coverLetterFile = req.files?.coverLetter;

  if (!name || !email || !jobId) {
    return res.status(400).json({ message: "Required fields are missing" });
  }

  try {
    const resumeUpload = resumeFile
      ? await uploadToCloudinary(resumeFile[0].buffer)
      : null;
    const coverLetterUpload = coverLetterFile
      ? await uploadToCloudinary(coverLetterFile[0].buffer)
      : null;

    const newApplicant = new Applicant({
      name,
      email,
      resume: resumeUpload?.secure_url,
      coverLetter: coverLetterUpload?.secure_url,
      jobId,
    });

    await newApplicant.save();
    const jobInfo = await Job.findOne({
      _id: jobId
    });
    const userInfo = await UserModel.findOne({
      _id: jobInfo.recruiterId
    });
    sendNotification(userInfo.username,
      jobInfo.positionName,
      'New Applicant',
      `${name} has applied for the ${jobInfo.positionName} position. Please review their application. `,
      'application')
    res.status(201).json(newApplicant);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Controller to get applicants by job ID
export async function getApplicantsByJobId(req, res) {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "Job ID is required" });
  }

  try {
    const applicants = await Applicant.find({ jobId: id });

    if (applicants.length === 0) {
      return res
        .status(404)
        .json({ message: "No applicants found for this job" });
    }

    return res.status(200).json(applicants);
  } catch (error) {
    console.error("Error fetching applicants:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching applicants" });
  }
}

// Controller to get a job by ID
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Controller to get user applications by email
export const getUserApplications = async (req, res) => {
  try {
    const email = req.params.email;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const applications = await Applicant.find({ email }).populate("jobId");
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to add a bookmark
export const addBookmark = async (req, res) => {
  try {
    const { username, jobId } = req.body;
    console.log("marker1")
    console.log(username, jobId)

    if (!username || !jobId) {
      return res.status(400).json({ message: "Username and Job ID are required" });
    }
    console.log("marker2")
    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.bookmarks.includes(jobId)) {
      return res.status(400).json({ message: "Job is already bookmarked" });
    }

    user.bookmarks.push(jobId);
    await user.save();

    res.status(200).json({ message: "Job bookmarked successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to remove a bookmark
export const removeBookmark = async (req, res) => {
  try {
    const { username, jobId } = req.body;

    if (!username || !jobId) {
      return res.status(400).json({ message: "Username and Job ID are required" });
    }

    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.bookmarks.includes(jobId)) {
      return res.status(400).json({ message: "Job is not bookmarked" });
    }

    user.bookmarks = user.bookmarks.filter((id) => id.toString() !== jobId);
    await user.save();

    res.status(200).json({ message: "Job removed from bookmarks" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to get all bookmarks of a user
export const getBookmarksByUser = async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    const user = await UserModel.findOne({ username }).populate("bookmarks");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the bookmarks
    res.status(200).json(user.bookmarks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
