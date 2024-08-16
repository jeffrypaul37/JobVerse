import {
  create
} from 'zustand';
import {
  io
} from 'socket.io-client';
import axios from 'axios';

let socket;

export const useAuthStore = create((set) => ({
  auth: {
    username: "",
    active: false,
  },
  setUsername: (name) =>
    set((state) => ({
      auth: {
        ...state.auth,
        username: name
      }
    })),
}));

export const useJobSearchStore = create((set) => ({
  jobTitle: "",
  setJobTitle: (title) => set({
    jobTitle: title
  }),
}));

export const useSocketStore = create((set) => ({
  notifications: [],
  newNotification: false,
  messages: [],
  users: [],
  interactedUsers: [],
  unreadMessages: {},

  // Initialize the socket connection
  initializeSocket: async (token, username) => {
    if (socket) return;

    socket = io(process.env.REACT_APP_SERVER_DOMAIN, {
      auth: {
        token
      },
    });

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('notification', (notification) => {
      set((state) => ({
        notifications: [notification, ...state.notifications],
        newNotification: true,
      }));
    });

    socket.on('receiveMessage', (message) => {
      set((state) => ({
        messages: [...state.messages, message],
      }));
      if (message.senderUsername !== username && message.receiverUsername === username) {
        set((state) => ({
          unreadMessages: {
            ...state.unreadMessages,
            [message.senderUsername]: (state.unreadMessages[message.senderUsername] || 0) + 1,
          },
        }));
      }
    });

    socket.on('chatHistory', (chatHistory) => {
      set({
        messages: chatHistory
      });
    });

    socket.on('interactedUsers', (interactedUsers) => {
      set({
        interactedUsers
      });
    });
  },
  joinChat: (username) => {
    if (socket) {
      socket.emit('joinChat', username);
    }
  },

  leaveChat: (username) => {
    if (socket) {
      socket.emit('leaveChat', username);
    }
  },

  // Fetch notifications from the server
  fetchNotifications: async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_SERVER_DOMAIN}/api/notifications`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      set({
        notifications: response.data
      });
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  },

  // Mark all notifications as read
  markNotificationsAsRead: async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_SERVER_DOMAIN}/api/notifications/mark-read`, {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      set((state) => ({
        notifications: state.notifications.map((n) => ({
          ...n,
          isRead: true
        })),
        newNotification: false,
      }));
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  },

  deleteNotification: async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_SERVER_DOMAIN}/api/notifications/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      set((state) => ({
        notifications: state.notifications.filter((n) => n._id !== id),
      }));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  },

  clearNewNotification: () => set({
    newNotification: false
  }),

  fetchUsers: async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_SERVER_DOMAIN}/api/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const loggedInUsername = localStorage.getItem('username');
      console.log(loggedInUsername)
      const filteredUsers = response.data.filter(user => user.username !== loggedInUsername);
      set({
        users: filteredUsers
      });
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  },

  sendMessage: (message) => {
    if (socket) {
      socket.emit('sendMessage', message);
      set((state) => ({
        messages: [...state.messages, message],
      }));
    }
  },

  // Clear unread messages for a specific user
  clearUnreadMessages: (username) => {
    set((state) => ({
      unreadMessages: {
        ...state.unreadMessages,
        [username]: 0,
      },
    }));
    localStorage.setItem('unreadMessages', JSON.stringify({
      ...JSON.parse(localStorage.getItem('unreadMessages') || '{}'),
      [username]: 0,
    }));
  },
}));