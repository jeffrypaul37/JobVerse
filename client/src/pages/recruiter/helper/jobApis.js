import axios from 'axios';
import { getUsername } from '../../auth/helper/api';

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

/* Create Job */
export const createJob = async (jobData, token) => {
    try {
        const response = await axios.post(`/api/recruiter/createJob`, jobData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        throw new Error('Error creating job listing');
    }
};

/* Fetch jobs for a specific recruiter */
export const fetchJobs = async (recruiterId) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.get(`/api/recruiter/getJobsForRecruiter`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { recruiterId }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching jobs:', error);
        throw new Error('Failed to fetch jobs.');
    }
};

/* Fetch a specific job by ID */
export const fetchJobById = async (jobId) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.get(`/api/recruiter/getJobById/${jobId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching job details:', error);
        throw new Error('Failed to fetch job details.');
    }
};

/* Update a specific job */
export const updateJob = async (jobId, jobData) => {
    const token = localStorage.getItem("token");
    try {
        await axios.put(`/api/recruiter/updateJob/${jobId}`, jobData, {
            headers: { Authorization: `Bearer ${token}` }
        });
    } catch (error) {
        console.error('Error updating job:', error);
        throw new Error('Failed to update job.');
    }
};

/* Delete a specific job */
export const deleteJob = async (jobId) => {
    const token = localStorage.getItem("token");
    try {
        await axios.delete(`/api/recruiter/deleteJob/${jobId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    } catch (error) {
        console.error('Error deleting job:', error);
        throw new Error('Failed to delete job.');
    }
};

/* Fetch applicants for a specific job */
export const fetchApplicantsByJobId = async (jobId) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.get(`/api/recruiter/getApplicantsByJobId/${jobId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching applicants:', error);
        throw new Error('Failed to fetch applicants.');
    }
};

/* Update applicant's status for a specific job */
export const updateApplicantStatus = async (applicantId, newStatus, jobId) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.put(
            `/api/recruiter/updateApplicantStatus/${applicantId}`,
            { status: newStatus, jobId },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.status === 200;
    } catch (error) {
        console.error('Error updating status:', error);
        throw new Error('Failed to update applicant status.');
    }
};

/* Delete a specific job */
export const deleteJobById = async (jobId) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.delete(`/api/recruiter/deleteJob/${jobId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.status === 200;
    } catch (error) {
        console.error('Error deleting job:', error);
        throw new Error('Failed to delete job.');
    }
};



/* Fetch a Recruiter's Id job */
export const getRecruiterId = async () => {
    try {
        const { userId } = await getUsername(); // Assuming getUsername returns { userId }
        return userId;
    } catch (error) {
        throw new Error('Error fetching recruiter ID');
    }
}
