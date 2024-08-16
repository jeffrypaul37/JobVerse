/* Jayrajsinh Mahavirsinh Jadeja */

import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

/* Get username (and userId) of the logged-in user */
export const getUsername = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`/api/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error("Error fetching user details");
  }
};

/* Fetch all jobs */
export const fetchJobs = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`/api/jobSeeker/jobs`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw new Error("Failed to fetch jobs.");
  }
};

/* Fetch a specific job by ID */
export const fetchJobById = async (id) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`/api/jobSeeker/jobs/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching job details:", error);
    throw new Error("Failed to fetch job details.");
  }
};

/* Apply for a job */
export const applyForJob = async (formData) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(`/api/jobSeeker/apply`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error applying for job:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Failed to apply for job.");
  }
};

/* Fetch job applications */
export const fetchApplications = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`/api/jobSeeker/applications`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching applications:", error);
    throw new Error("Failed to fetch applications.");
  }
};

/* Fetch user profile */
export const fetchUserProfile = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`/api/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw new Error("Failed to fetch profile.");
  }
};

/* Update user profile */
export const updateUserProfile = async (profileData) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.put(`/api/profile`, profileData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw new Error("Failed to update profile.");
  }
};

/* Fetch user applications */
export const fetchApplicationsByEmail = async (email) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`/api/jobSeeker/applications/${email}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching applications by email:", error);
    throw new Error("Failed to fetch applications by email.");
  }
};

export const fetchUserBookmarks = async (username) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(`/api/jobSeeker/userBookmarks`, 
      {
        username,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
      );
    return response.data;
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    throw new Error("Failed to fetch bookmarks.");
  }
};

export const toggleBookmark = async (username, jobId, isBookmarked) => {
  const token = localStorage.getItem("token");
  const url = isBookmarked
    ? '/api/jobSeeker/unbookmark'
    : '/api/jobSeeker/bookmark';

  try {
    const response = await axios.post(url, 
      {username, jobId},
      {
        headers: { Authorization: `Bearer ${token}` }
      }
      
    );
    return response.data;
  } catch (error) {
    throw new Error('Failed to update bookmark status.');
  }
};