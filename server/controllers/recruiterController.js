/* Author: Ashish Kumar Guntipalli */

import Job from "../model/Job.js";
import Applicant from "../model/Applicants.js";
import User from "../model/User.model.js";
import mongoose from 'mongoose';
import {
    sendNotification
} from "../config/socketConnection.js";

// export async function getAllJobs(req, res) {
//     try {
//         const jobs = await Job.find();
//         res.status(200).json(jobs);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// }


export async function addApplicant(req, res) {
    const {
        name,
        email,
        resume,
        coverLetter,
        jobId,
        status
    } = req.body;

    try {
        const newApplicant = new Applicant({
            name,
            email,
            resume,
            coverLetter,
            jobId,
            status: status || 'Applied'
        });

        await newApplicant.save();
        res.status(201).json(newApplicant);
    } catch (err) {
        res.status(400).json({
            message: err.message
        });
    }
}

export async function getApplicantsByJobId(req, res) {
    const {
        id: jobId
    } = req.params;
    console.log(jobId);
    if (!jobId) {
        return res.status(400).json({
            error: 'Job ID is required'
        });
    }

    try {
        const applicants = await Applicant.find({
            jobId
        });

        if (applicants.length === 0) {
            return res.status(404).json({
                message: 'No applicants found for this job'
            });
        }

        return res.status(200).json(applicants);
    } catch (error) {
        console.error('Error fetching applicants:', error);
        return res.status(500).json({
            error: 'An error occurred while fetching applicants'
        });
    }
}



export async function updateApplicantStatus(req, res) {
    const {
        applicantId
    } = req.params;
    const {
        status
    } = req.body;

    // Validate the input
    const validStatuses = ['Applied', 'Interview', 'Accepted', 'Rejected'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({
            error: 'Invalid status value'
        });
    }

    try {
        // Find the applicant by ID and update the status
        const updatedApplicant = await Applicant.findByIdAndUpdate(
            applicantId, {
                status
            }, {
                new: true
            } // Return the updated document
        );

        if (!updatedApplicant) {
            return res.status(404).json({
                error: 'Applicant not found'
            });
        }
        if (status && status !== "Applied") {
            const jobInfo = await Job.findOne({
                _id: updatedApplicant.jobId
            });
            let notificationMessage = status === 'Interview' ? `You have been shortlisted for an interview for the position of ${jobInfo.positionName} at ${jobInfo.companyName}. Please check your email for further details.` :
                status === 'Accepted' ? `Congratulations! Your application for the position of ${jobInfo.positionName} at ${jobInfo.companyName} has been accepted. Welcome to the team!` :
                status === 'Rejected' ? `We regret to inform you that your application for the position of ${jobInfo.positionName} at ${jobInfo.companyName} has been rejected. Thank you for your interest.` :
                "Invalid status provided.";
            sendNotification(updatedApplicant.name,
                jobInfo.positionName,
                'Application status updated',
                notificationMessage,
                'statusChange')
        }
        return res.status(200).json(updatedApplicant);
    } catch (error) {
        console.error('Error updating applicant status:', error);
        return res.status(500).json({
            error: 'Internal Server Error'
        });
    }
}




export async function createJob(req, res) {
    const {
        positionName,
        salary,
        positionsAvailable,
        jobDescription,
        resumeRequired,
        coverLetterRequired,
        recruiterId,
        companyName,
        location
    } = req.body;

    console.log(location, companyName)

    try {
        // Convert recruiterId to ObjectId
        const convertedRecruiterId = mongoose.Types.ObjectId(recruiterId);

        // Fetch user by recruiterId
        const user = await User.findById(convertedRecruiterId);
        if (!user) {
            return res.status(400).json({
                message: "Invalid recruiter ID"
            });
        }

        // Check if user has the Recruiter role
        if (!user.roles.Recruiter) {
            return res.status(403).json({
                message: "Unauthorized. Only recruiters can create jobs."
            });
        }

        // Create and save the new job
        const newJob = new Job({
            positionName,
            salary,
            positionsAvailable,
            jobDescription,
            resumeRequired,
            coverLetterRequired,
            recruiterId: convertedRecruiterId,
            companyName,
            location
        });

        await newJob.save();
        res.status(201).json(newJob);
    } catch (err) {
        res.status(400).json({
            message: err.message
        });
    }
}
export async function getJobsForRecruiter(req, res) {
    const {
        recruiterId
    } = req.query; // Get recruiterId from query parameters

    try {
        if (!recruiterId) {
            return res.status(400).json({
                message: 'Recruiter ID is required.'
            });
        }

        // Find jobs that match the recruiterId
        const jobs = await Job.find({
            recruiterId: recruiterId
        });

        // Send the jobs as a response
        res.status(200).json(jobs);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
}

export const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({
                message: 'Job not found'
            });
        }
        res.status(200).json(job);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

export const updateJob = async (req, res) => {
    try {
        // Extract companyName along with other fields from the request body
        const {
            positionName,
            salary,
            positionsAvailable,
            jobDescription,
            resumeRequired,
            coverLetterRequired,
            location,
            companyName
        } = req.body;

        // Find and update the job with the new data
        const job = await Job.findByIdAndUpdate(req.params.id, {
            positionName,
            salary,
            positionsAvailable,
            jobDescription,
            resumeRequired,
            coverLetterRequired,
            location, // Updated field
            companyName // Include new field
        }, {
            new: true,
            runValidators: true
        });

        if (!job) {
            return res.status(404).json({
                message: 'Job not found'
            });
        }

        res.status(200).json(job);
    } catch (err) {
        res.status(400).json({
            message: err.message
        });
    }
};

export const deleteJob = async (req, res) => {
    try {
        await Applicant.deleteMany({
            jobId: {
                $in: req.params.id
            }
        });
        const job = await Job.findByIdAndDelete(req.params.id);
        if (!job) {
            return res.status(404).json({
                message: 'Job not found'
            });
        }
        res.status(200).json({
            message: 'Job deleted successfully'
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};