/* Author: Ashish Kumar Guntipalli */
import mongoose from 'mongoose';

const applicantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    resume: { type: String},
    coverLetter: { type: String },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    status: { 
        type: String, 
        enum: ['Applied', 'Interview', 'Accepted', 'Rejected'], // Set of allowed values
        default: 'Applied' 
    }
});

const Applicants = mongoose.model('Applicants', applicantSchema);

export default Applicants;
