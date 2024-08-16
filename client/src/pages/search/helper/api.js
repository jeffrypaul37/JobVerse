/* Author: Sivaprakash Chittu Hariharan */
import axios from 'axios';

// default base URL for Axios
axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;


// api call to fetch job based on criteria
export const fetchJobs = async (params) => {
  try {
    const response = await axios.get('/api/search', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw new Error('Error fetching jobs. Please try again later.');
  }
};


/* Fetch user bookmarks */
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

/* Toggle bookmark */
export const toggleBookmark = async (username, jobId, isBookmarked) => {
  const token = localStorage.getItem("token");
  const url = isBookmarked ? `/api/jobSeeker/unbookmark` : `/api/jobSeeker/bookmark`;
  try {
    const response = await axios.post(url, 
      {username, jobId},
      {
        headers: { Authorization: `Bearer ${token}` }
      }
      
    );
    return response.data;
  } catch (error) {
    console.error("Error updating bookmark:", error);
    throw new Error("Failed to update bookmark.");
  }
};