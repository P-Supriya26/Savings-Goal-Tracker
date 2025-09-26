const express = require('express');
const SavingsGoal = require('../models/SavingsGoal');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all goals for a user
router.get('/', auth, async (req, res) => {
  try {
    const goals = await SavingsGoal.find({ userId: req.userId })
      .sort({ createdAt: -1 });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get a specific goal
router.get('/:id', auth, async (req, res) => {
  try {
    const goal = await SavingsGoal.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    res.json(goal);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create a new goal
router.post('/', auth, async (req, res) => {
  try {
    const {
      title,
      description,
      targetAmount,
      targetDate,
      category,
      priority,
      monthlyContribution
    } = req.body;

    const goal = new SavingsGoal({
      userId: req.userId,
      title,
      description,
      targetAmount,
      targetDate,
      category,
      priority,
      monthlyContribution
    });

    await goal.save();
    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update a goal
router.put('/:id', auth, async (req, res) => {
  try {
    const {
      title,
      description,
      targetAmount,
      currentAmount,
      targetDate,
      category,
      priority,
      status,
      monthlyContribution
    } = req.body;

    const goal = await SavingsGoal.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      {
        title,
        description,
        targetAmount,
        currentAmount,
        targetDate,
        category,
        priority,
        status,
        monthlyContribution
      },
      { new: true, runValidators: true }
    );

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    res.json(goal);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add money to a goal
router.patch('/:id/add-money', auth, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const goal = await SavingsGoal.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    goal.currentAmount += amount;
    
    // Check if goal is completed
    if (goal.currentAmount >= goal.targetAmount) {
      goal.status = 'Completed';
    }

    await goal.save();
    res.json(goal);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete a goal
router.delete('/:id', auth, async (req, res) => {
  try {
    const goal = await SavingsGoal.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
