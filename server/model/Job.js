/* Author: Ashish Kumar Guntipalli */

import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
    positionName: { type: String, required: true },
    salary: { type: Number, required: true },
    positionsAvailable: { type: Number, required: true },
    jobDescription: { type: String, required: true },
    resumeRequired: { type: Boolean, required: true },
    coverLetterRequired: { type: Boolean, required: true },
    createdAt: { type: Date, default: Date.now },
    recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User schema
    companyName: { type: String, required: true }, // New field for company name
    location: { 
        type: String, 
        required: true,
        enum: [
            'Alberta',
            'British Columbia',
            'Manitoba',
            'New Brunswick',
            'Newfoundland and Labrador',
            'Northwest Territories',
            'Nova Scotia',
            'Nunavut',
            'Ontario',
            'Prince Edward Island',
            'Quebec',
            'Saskatchewan',
            'Yukon'
        ] // Fixed set of values for Canadian provinces
    }
});

const Job = mongoose.model('Job', jobSchema);

export default Job;
