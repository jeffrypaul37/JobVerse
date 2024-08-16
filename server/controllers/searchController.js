/* Author: Sivaprakash Chittu Hariharan */
import Job from "../model/Job.js";

// Search for job postings based on query parameters
export async function searchJobs(req, res) {
  try {
    const { jobTitle, location, datePosted, payRange } = req.query;
    let query = {};

    

    // Add search criteria to the query
    if (jobTitle) {
      query.positionName = { $regex: jobTitle, $options: 'i' }; // Case-insensitive search
    }
    if (location) {
      query.location = location; // Match exact province abbreviation
    }
    if (datePosted) {
      const date = new Date();
      if (datePosted === 'today') {
        date.setHours(0, 0, 0, 0);
        query.createdAt = { $gte: date };
      } else if (datePosted === 'this_week') {
        date.setDate(date.getDate() - 7);
        query.createdAt = { $gte: date };
      } else if (datePosted === 'this_month') {
        date.setMonth(date.getMonth() - 1);
        query.createdAt = { $gte: date };
      }
    }
    if (payRange) {
      const [min, max] = payRange.split('-').map(Number);
      query.salary = { $gte: min, $lte: max || Infinity };
    }



    // Fetch jobs and send response
    const jobs = await Job.find(query);
    res.status(200).json(jobs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
