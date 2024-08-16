import {
  Server
} from 'socket.io';
import jwt from 'jsonwebtoken';
import UserInteraction from '../model/UserInteraction.js';
import Message from '../model/Message.js'
import UserModel from '../model/User.model.js';
import Notification from '../model/Notification.js';

let io;
const notifiedUsers = new Set();

const initializeSocket = (server) => {
  if (io) {
    console.log('Socket.io already initialized');
    return io;
  }

  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log('A user connected');
    const userId = socket.userId;

    socket.join(userId);
    console.log(`User ${userId} joined room`);

    socket.on('joinChat', async (username) => {
      socket.join(username);

      const messages = await Message.find({
        $or: [{
          senderUsername: username
        }, {
          receiverUsername: username
        }]
      }).sort({
        timestamp: 1
      });

      socket.emit('chatHistory', messages);

      const userInteraction = await UserInteraction.findOne({
        username
      });
      const interactedUsers = userInteraction ? userInteraction.interactedUsers : [];
      socket.emit('interactedUsers', interactedUsers);
    });

    socket.on('leaveChat', (userName) => {
      socket.leave(userName);
      console.log(`User with username ${userName} left chat ${userName}`);
      notifiedUsers.forEach((key) => {
        if (key.endsWith(`_${socket.id}`)) {
          notifiedUsers.delete(key);
        }
      });
    });

    socket.on('sendMessage', async (message) => {
      const newMessage = new Message(message);
      await newMessage.save();

      await UserInteraction.updateOne({
        username: message.senderUsername
      }, {
        $addToSet: {
          interactedUsers: message.receiverUsername
        }
      }, {
        upsert: true
      });
      await UserInteraction.updateOne({
        username: message.receiverUsername
      }, {
        $addToSet: {
          interactedUsers: message.senderUsername
        }
      }, {
        upsert: true
      });

      io.to(message.receiverUsername).emit('receiveMessage', message);

      const userKey = `${message.receiverUsername}_${socket.id}`;
      const receiverRoom = io.sockets.adapter.rooms.get(message.receiverUsername);
      const isReceiverPresent = receiverRoom && receiverRoom.size > 0;
      console.log((!notifiedUsers.has(userKey)))
      if ((!notifiedUsers.has(userKey)) && (!isReceiverPresent)) {
        sendNotification(
          message.receiverUsername,
          message.senderUsername,
          'New Message',
          `${message.senderUsername} has sent you a message.`,
          'chat'
        );
        notifiedUsers.add(userKey);
      }

    });
  });

  return io;
};

const sendNotification = async (userName, senderUserName, heading, content, type) => {
  const receiverUser = await UserModel.findOne({
    username: userName
  });
  try {
    const newNotification = new Notification({
      userName,
      senderUserName,
      heading,
      content,
      type,
    });
    await newNotification.save();
    const receiverIdStr = receiverUser && receiverUser._id.toString();
    io.to(receiverIdStr).emit('notification', {
      heading,
      content,
      type,
      createdAt: newNotification.createdAt,
      senderUserName,
    });
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

export {
  initializeSocket,
  sendNotification
};