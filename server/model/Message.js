/* Author: Jeffry Paul Suresh Durai */
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  senderUsername: { type: String, required: true },
  receiverUsername: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model('Message', messageSchema);

export default Message;
