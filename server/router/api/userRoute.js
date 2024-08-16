/* Author: Jeffry Paul Suresh Durai */
import express from 'express';
import User from '../../model/User.model.js';
import UserInteraction from '../../model/UserInteraction.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, 'username profile');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/interactions/:username', async (req, res) => {
  try {
    const interactions = await UserInteraction.findOne({ username: req.params.username });
    res.json(interactions || { interactedUsers: [] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch interactions' });
  }
});

router.post('/interactions/:username', async (req, res) => {
  try {
    const { interactedUser } = req.body;
    await UserInteraction.updateOne(
      { username: req.params.username },
      { $addToSet: { interactedUsers: interactedUser } },
      { upsert: true }
    );
    res.status(200).json({ message: 'Interaction updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update interactions' });
  }
});

export default router;
