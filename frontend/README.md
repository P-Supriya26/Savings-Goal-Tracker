# 💰 Savings Goal Tracker with Financial Bot

A comprehensive MERN stack application for tracking savings goals with an AI-powered financial advisor chatbot.

## 🚀 Features

- **Goal Management**: Create, edit, delete, and track savings goals
- **Progress Visualization**: Beautiful charts and progress bars
- **AI Financial Advisor**: Chatbot powered by OpenAI for financial advice
- **User Authentication**: Secure login and registration
- **Dashboard**: Overview of all goals and statistics
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **OpenAI API** for chatbot functionality
- **bcryptjs** for password hashing

### Frontend
- **React.js** with React Router
- **Axios** for API calls
- **Recharts** for data visualization
- **Lucide React** for icons
- **CSS3** for styling

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud)
- OpenAI API key
- npm or yarn

## 🔧 Installation & Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd savings-goal-tracker
```

### 2. Backend Setup
```bash
cd backend
npm install
```

### 3. Environment Configuration
Create a `config.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/savings-tracker
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
OPENAI_API_KEY=your-openai-api-key-here
NODE_ENV=development
```

### 4. Frontend Setup
```bash
cd frontend
npm install
```

### 5. Start the Application

#### Start Backend (Terminal 1)
```bash
cd backend
npm start
```

#### Start Frontend (Terminal 2)
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📱 Usage

### 1. Registration/Login
- Create a new account or login with existing credentials
- Secure authentication with JWT tokens

### 2. Create Savings Goals
- Click "New Goal" to create a savings goal
- Set target amount, date, category, and priority
- Add monthly contribution amounts

### 3. Track Progress
- View progress bars and percentage completion
- Add money to goals manually
- Filter and sort goals by various criteria

### 4. Dashboard
- Overview of all goals and statistics
- Visual charts showing savings by category
- Progress tracking and completion status

### 5. AI Financial Advisor
- Chat with the AI bot for financial advice
- Get personalized saving tips
- Ask questions about budgeting and investment

## 🗂️ Project Structure

```
savings-goal-tracker/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── SavingsGoal.js
│   │   └── ChatMessage.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── goals.js
│   │   └── chat.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   └── config.env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   ├── GoalsList.js
│   │   │   ├── GoalForm.js
│   │   │   └── ChatBot.js
│   │   ├── contexts/
│   │   │   └── AuthContext.js
│   │   ├── App.js
│   │   └── App.css
│   └── package.json
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Goals
- `GET /api/goals` - Get all user goals
- `POST /api/goals` - Create new goal
- `GET /api/goals/:id` - Get specific goal
- `PUT /api/goals/:id` - Update goal
- `PATCH /api/goals/:id/add-money` - Add money to goal
- `DELETE /api/goals/:id` - Delete goal

### Chat
- `GET /api/chat/history` - Get chat history
- `POST /api/chat/message` - Send message to AI
- `GET /api/chat/tips` - Get saving tips

## 🎨 Features in Detail

### Goal Management
- **CRUD Operations**: Full create, read, update, delete functionality
- **Categories**: Emergency Fund, Vacation, Education, Home, Car, Retirement, Other
- **Priority Levels**: High, Medium, Low
- **Status Tracking**: Active, Completed, Paused, Cancelled
- **Progress Visualization**: Real-time progress bars and percentages

### AI Financial Advisor
- **OpenAI Integration**: Powered by GPT-3.5-turbo
- **Context Awareness**: Considers user's goals and history
- **Financial Advice**: Saving tips, budgeting advice, goal planning
- **Fallback Responses**: Graceful handling of API failures

### Dashboard & Analytics
- **Statistics Overview**: Total goals, saved amount, target amount, completed goals
- **Visual Charts**: Pie charts for categories, bar charts for priorities
- **Progress Tracking**: Visual representation of goal completion
- **Recent Goals**: Quick access to latest goals

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured for secure cross-origin requests

## 🚀 Deployment

### Backend Deployment (Heroku)
1. Create a Heroku app
2. Set environment variables in Heroku dashboard
3. Deploy using Git or Heroku CLI

### Frontend Deployment (Netlify/Vercel)
1. Build the React app: `npm run build`
2. Deploy the build folder to your preferred platform
3. Update API URLs for production

### Environment Variables for Production
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/savings-tracker
JWT_SECRET=your-production-jwt-secret
OPENAI_API_KEY=your-openai-api-key
NODE_ENV=production
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the console for error messages
2. Verify your environment variables
3. Ensure MongoDB is running
4. Check OpenAI API key validity

## 🔮 Future Enhancements

- [ ] Email notifications for goal milestones
- [ ] Budget tracking and expense management
- [ ] Investment tracking and portfolio management
- [ ] Social features and goal sharing
- [ ] Mobile app development
- [ ] Advanced analytics and reporting
- [ ] Integration with banking APIs
- [ ] Goal templates and suggestions

---

**Happy Saving! 💰**
