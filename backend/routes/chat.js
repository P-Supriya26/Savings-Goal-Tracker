const express = require('express');
const ChatMessage = require('../models/ChatMessage');
const SavingsGoal = require('../models/SavingsGoal');
const auth = require('../middleware/auth');

const router = express.Router();

// Simple rule-based reply generator (no external API)
function generateSimpleReply(userText, goals) {
  const text = (userText || '').toLowerCase();
  const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' });

  // Goal summary
  if (text.includes('summary') || text.includes('overview') || text.includes('goals')) {
    if (!goals || goals.length === 0) {
      return 'You do not have any goals yet. Create one to start tracking your savings!';
    }
    const lines = goals.slice(0, 5).map(g => `• ${g.title}: ${inr.format(g.currentAmount)} of ${inr.format(g.targetAmount)} (${g.progressPercentage}% , status: ${g.status})`);
    return `Here is a quick summary of your goals:\n${lines.join('\n')}${goals.length > 5 ? `\n…and ${goals.length - 5} more` : ''}`;
  }

  // Emergency fund
  if (text.includes('emergency')) {
    return 'For an emergency fund, aim for 3–6 months of essential expenses. Start with a small target (for example ₹25,000), set an auto-transfer after payday, and keep it in a liquid account so it is easy to access.';
  }

  // Budget
  if (text.includes('budget') || text.includes('50/30/20')) {
    return 'Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings. Track expenses weekly, cap discretionary spends, and automate the 20% to your savings on salary day.';
  }

  // Save X in Y months
  const numMatch = text.match(/save\s*(₹|rs\.?|inr)?\s*(\d+[\d,]*)\s*(in|within)?\s*(\d+)\s*month/);
  if (numMatch) {
    const amount = parseInt(numMatch[2].replace(/,/g, ''), 10);
    const months = parseInt(numMatch[4], 10);
    const perMonth = months > 0 ? Math.ceil(amount / months) : amount;
    return `To save ${inr.format(amount)} in ${months} month(s), target about ${inr.format(perMonth)} per month. Tips: 1) Auto-transfer this amount on payday, 2) Cut 2–3 variable categories (e.g., eating out, shopping), 3) Use cashbacks/discounts to boost savings.`;
  }

  // Generic saving tips
  if (text.includes('save') || text.includes('saving') || text.includes('tips')) {
    return 'Quick saving tips: 1) Set an auto-transfer right after payday, 2) Track spends and cap non-essentials, 3) Negotiate or switch for cheaper plans (phone, internet), 4) Use cashbacks/discounts, 5) Sell items you do not use.';
  }

  // Investment
  if (text.includes('invest') || text.includes('investment')) {
    return 'General note: Build an emergency fund first. For long-term goals, consider diversified index funds/SIP. Match investments to time horizon and risk profile. This is not financial advice—do your own research.';
  }

  // Default
  return 'I can help with savings, budgeting, and goal planning. Try: "Show my goal summary", "How to build an emergency fund?", or "How to save ₹25,000 in 3 months?"';
}

// Get chat history
router.get('/history', auth, async (req, res) => {
  try {
    const messages = await ChatMessage.find({ userId: req.userId })
      .sort({ timestamp: -1 })
      .limit(50);
    res.json(messages.reverse());
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Send message to AI chatbot
router.post('/message', auth, async (req, res) => {
  // Safely read and normalize the incoming message once for both try/catch
  const userText = (req.body && typeof req.body.message === 'string')
    ? req.body.message.trim()
    : '';

  // Declare here so it's accessible in catch
  let userMessage = null;

  try {
    if (!userText) {
      return res.status(400).json({ message: 'Message cannot be empty' });
    }

    // Save user message
    userMessage = new ChatMessage({
      userId: req.userId,
      message: userText,
      isFromUser: true
    });
    await userMessage.save();

    // Get user's goals for context
    const userGoals = await SavingsGoal.find({ userId: req.userId });
    
    // Get recent chat history for context
    const recentMessages = await ChatMessage.find({ userId: req.userId })
      .sort({ timestamp: -1 })
      .limit(10);

    // Prepare context for AI
    let context = "You are a helpful financial advisor chatbot. Provide practical, actionable advice about saving money, budgeting, and achieving financial goals. Keep responses concise and friendly.\n\n";
    
    if (userGoals.length > 0) {
      const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' });
      context += "User's current savings goals:\n";
      userGoals.forEach(goal => {
        context += `- ${goal.title}: ${inr.format(goal.currentAmount)}/${inr.format(goal.targetAmount)} (${goal.progressPercentage}% complete)\n`;
      });
      context += "\n";
    }

    // Add recent conversation context
    if (recentMessages.length > 0) {
      context += "Recent conversation:\n";
      recentMessages.reverse().forEach(msg => {
        if (msg.isFromUser) {
          context += `User: ${msg.message}\n`;
        } else {
          context += `Assistant: ${msg.response}\n`;
        }
      });
      context += "\n";
    }

    context += `User: ${userText}\nAssistant:`;

    // Generate simple response locally (no external API)
    const aiResponse = generateSimpleReply(userText, userGoals);

    // Save AI response
    const aiMessage = new ChatMessage({
      userId: req.userId,
      message: userText,
      response: aiResponse,
      isFromUser: false
    });
    await aiMessage.save();

    res.json({
      userMessage: userMessage,
      aiResponse: aiMessage
    });

  } catch (error) {
    console.error('Chat error:', error);
    
    // Fallback response if OpenAI fails
    const fallbackResponse = "I'm sorry, I'm having trouble connecting right now. Here are some general saving tips: 1) Create a budget and track expenses, 2) Set up automatic transfers to savings, 3) Look for ways to reduce monthly bills, 4) Consider the 50/30/20 rule (50% needs, 30% wants, 20% savings). Please try again later!";
    
    const aiMessage = new ChatMessage({
      userId: req.userId,
      message: userText,
      response: fallbackResponse,
      isFromUser: false
    });
    await aiMessage.save();

    res.json({
      userMessage: userMessage, // may be null if validation failed before save
      aiResponse: aiMessage
    });
  }
});

// Get saving tips
router.get('/tips', auth, async (req, res) => {
  try {
    const tips = [
      "Start with small amounts - even $5 a day adds up to $1,825 per year!",
      "Use the 24-hour rule before making non-essential purchases",
      "Set up automatic transfers to your savings account on payday",
      "Track your expenses for a month to identify spending patterns",
      "Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings",
      "Consider high-yield savings accounts for better interest rates",
      "Review and cancel unused subscriptions regularly",
      "Cook at home more often to save on dining out costs",
      "Use cashback apps and credit cards with rewards",
      "Set specific, measurable savings goals with deadlines"
    ];

    const randomTips = tips.sort(() => 0.5 - Math.random()).slice(0, 3);
    res.json({ tips: randomTips });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
