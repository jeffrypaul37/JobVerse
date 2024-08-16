import Notification from '../model/Notification.js';

export const getNotifications = async (req, res) => {
  try {
    console.log(req.user)
    const notifications = await Notification.find({ userName: req.user.username }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error });
  }
};

export const markNotificationsAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ userName: req.user.username, isRead: false }, { isRead: true });
    res.status(200).send('Notifications marked as read');
  } catch (error) {
    res.status(500).json({ message: 'Error marking notifications as read', error });
  }
};

export const createNotification = async (req, res) => {
  const { message } = req.body;
  try {
    const newNotification = new Notification({ userName: req.user.username, message });
    await newNotification.save();
    res.status(200).send('Notification created');
  } catch (error) {
    res.status(500).json({ message: 'Error creating notification', error });
  }
};

export const deleteNotification = async (req, res) => {
  const { id } = req.params;
  try {
    await Notification.findByIdAndDelete(id);
    res.status(200).send('Notification deleted');
  } catch (error) {
    res.status(500).json({ message: 'Error deleting notification', error });
  }
};
