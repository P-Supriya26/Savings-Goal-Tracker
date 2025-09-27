import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Plus, Target, TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { formatINR } from '../utils/currency';

const Dashboard = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalGoals: 0,
    totalTarget: 0,
    totalSaved: 0,
    completedGoals: 0
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await axios.get('/api/goals');
      setGoals(response.data);
      calculateStats(response.data);
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (goalsData) => {
    const totalGoals = goalsData.length;
    const totalTarget = goalsData.reduce((sum, goal) => sum + goal.targetAmount, 0);
    const totalSaved = goalsData.reduce((sum, goal) => sum + goal.currentAmount, 0);
    const completedGoals = goalsData.filter(goal => goal.status === 'Completed').length;

    setStats({
      totalGoals,
      totalTarget,
      totalSaved,
      completedGoals
    });
  };

  const getProgressPercentage = (current, target) => {
    return Math.round((current / target) * 100);
  };

  const getCategoryData = () => {
    const categories = {};
    goals.forEach(goal => {
      if (categories[goal.category]) {
        categories[goal.category] += goal.currentAmount;
      } else {
        categories[goal.category] = goal.currentAmount;
      }
    });

    return Object.entries(categories).map(([name, value]) => ({
      name,
      value
    }));
  };

  const getPriorityData = () => {
    const priorities = { High: 0, Medium: 0, Low: 0 };
    goals.forEach(goal => {
      priorities[goal.priority]++;
    });

    return Object.entries(priorities).map(([name, value]) => ({
      name,
      value
    }));
  };

  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="card-header">
        <h1 className="card-title">Dashboard</h1>
        <Link to="/goals/new" className="btn btn-primary">
          <Plus size={20} style={{ marginRight: '0.5rem' }} />
          New Goal
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <Target size={40} style={{ color: '#667eea', marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{stats.totalGoals}</h3>
          <p style={{ color: '#64748b' }}>Total Goals</p>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <DollarSign size={40} style={{ color: '#10b981', marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
            {formatINR(stats.totalSaved)}
          </h3>
          <p style={{ color: '#64748b' }}>Total Saved</p>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <TrendingUp size={40} style={{ color: '#f59e0b', marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
            {formatINR(stats.totalTarget)}
          </h3>
          <p style={{ color: '#64748b' }}>Total Target</p>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <Calendar size={40} style={{ color: '#8b5cf6', marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{stats.completedGoals}</h3>
          <p style={{ color: '#64748b' }}>Completed</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-2">
        <div className="card">
          <h3 className="card-title">Savings by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={getCategoryData()}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {getCategoryData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="card-title">Goals by Priority</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getPriorityData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#667eea" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Goals */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Recent Goals</h3>
          <Link to="/goals" className="btn btn-secondary btn-sm">
            View All
          </Link>
        </div>

        {goals.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <Target size={60} style={{ color: '#cbd5e1', marginBottom: '1rem' }} />
            <h3 style={{ color: '#64748b', marginBottom: '0.5rem' }}>No goals yet</h3>
            <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>
              Start by creating your first savings goal
            </p>
            <Link to="/goals/new" className="btn btn-primary">
              <Plus size={20} style={{ marginRight: '0.5rem' }} />
              Create Goal
            </Link>
          </div>
        ) : (
          <div className="grid grid-3">
            {goals.slice(0, 6).map(goal => (
              <div key={goal._id} className="goal-card">
                <div className="goal-header">
                  <div>
                    <h4 className="goal-title">{goal.title}</h4>
                    <span className="goal-category">{goal.category}</span>
                  </div>
                  <span style={{ 
                    color: goal.status === 'Completed' ? '#10b981' : 
                           goal.status === 'Active' ? '#3b82f6' : '#f59e0b',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}>
                    {goal.status}
                  </span>
                </div>

                <div className="goal-amount">
                  {formatINR(goal.currentAmount)} / {formatINR(goal.targetAmount)}
                </div>

                <div className="goal-progress">
                  <div className="progress-text">
                    <span>Progress</span>
                    <span>{getProgressPercentage(goal.currentAmount, goal.targetAmount)}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: `${getProgressPercentage(goal.currentAmount, goal.targetAmount)}%` 
                      }}
                    ></div>
                  </div>
                </div>

                <div style={{ marginTop: '1rem' }}>
                  <Link 
                    to={`/goals/${goal._id}/edit`} 
                    className="btn btn-secondary btn-sm"
                    style={{ marginRight: '0.5rem' }}
                  >
                    Edit
                  </Link>
                  <Link to="/goals" className="btn btn-primary btn-sm">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
