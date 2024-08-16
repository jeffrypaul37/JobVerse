/* Author: Jeffry Paul Suresh Durai */
import mongoose from 'mongoose';

const userInteractionSchema = new mongoose.Schema({
  username: { type: String, required: true },
  interactedUsers: [{ type: String }]
});

const UserInteraction = mongoose.model('UserInteraction', userInteractionSchema);

export default UserInteraction;
