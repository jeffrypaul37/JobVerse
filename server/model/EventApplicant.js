/* Author: Sivaprkash Chittu Hariharan */

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const eventApplicantSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true }
})

const Eventapplicant = mongoose.model('Eventapplicant', eventApplicantSchema);


export default Eventapplicant;
