import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Plus, Edit, Trash2, DollarSign, Calendar, Target, Filter } from 'lucide-react';
import { formatINR } from '../utils/currency';

const GoalsList = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await axios.get('/api/goals');
      setGoals(response.data);
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (goalId) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await axios.delete(`/api/goals/${goalId}`);
        setGoals(goals.filter(goal => goal._id !== goalId));
      } catch (error) {
        console.error('Error deleting goal:', error);
        alert('Failed to delete goal');
      }
    }
  };

  const handleAddMoney = async (goalId, amount) => {
    try {
      const response = await axios.patch(`/api/goals/${goalId}/add-money`, { amount });
      setGoals(goals.map(goal => 
        goal._id === goalId ? response.data : goal
      ));
    } catch (error) {
      console.error('Error adding money:', error);
      alert('Failed to add money to goal');
    }
  };

  const getProgressPercentage = (current, target) => {
    return Math.round((current / target) * 100);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return '#10b981';
      case 'Active': return '#3b82f6';
      case 'Paused': return '#f59e0b';
      case 'Cancelled': return '#ef4444';
      default: return '#64748b';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#ef4444';
      case 'Medium': return '#f59e0b';
      case 'Low': return '#10b981';
      default: return '#64748b';
    }
  };

  const filteredGoals = goals.filter(goal => {
    if (filter === 'all') return true;
    return goal.status === filter;
  });

  const sortedGoals = [...filteredGoals].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'targetAmount':
        return b.targetAmount - a.targetAmount;
      case 'currentAmount':
        return b.currentAmount - a.currentAmount;
      case 'targetDate':
        return new Date(a.targetDate) - new Date(b.targetDate);
      case 'progress':
        return getProgressPercentage(b.currentAmount, b.targetAmount) - 
               getProgressPercentage(a.currentAmount, a.targetAmount);
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

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
        <h1 className="card-title">My Savings Goals</h1>
        <Link to="/goals/new" className="btn btn-primary">
          <Plus size={20} style={{ marginRight: '0.5rem' }} />
          New Goal
        </Link>
      </div>

      {/* Filters and Sorting */}
      <div className="card">
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={20} />
            <label>Filter:</label>
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="form-select"
              style={{ width: 'auto' }}
            >
              <option value="all">All Goals</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Paused">Paused</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label>Sort by:</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="form-select"
              style={{ width: 'auto' }}
            >
              <option value="createdAt">Date Created</option>
              <option value="title">Title</option>
              <option value="targetAmount">Target Amount</option>
              <option value="currentAmount">Current Amount</option>
              <option value="targetDate">Target Date</option>
              <option value="progress">Progress</option>
            </select>
          </div>
        </div>
      </div>

      {/* Goals Grid */}
      {sortedGoals.length === 0 ? (
        <div className="card">
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <Target size={80} style={{ color: '#cbd5e1', marginBottom: '1rem' }} />
            <h3 style={{ color: '#64748b', marginBottom: '0.5rem' }}>
              {filter === 'all' ? 'No goals yet' : `No ${filter.toLowerCase()} goals`}
            </h3>
            <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>
              {filter === 'all' 
                ? 'Start by creating your first savings goal'
                : `You don't have any ${filter.toLowerCase()} goals yet`
              }
            </p>
            <Link to="/goals/new" className="btn btn-primary">
              <Plus size={20} style={{ marginRight: '0.5rem' }} />
              Create Goal
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-3">
          {sortedGoals.map(goal => (
            <div key={goal._id} className="goal-card">
              <div className="goal-header">
                <div>
                  <h4 className="goal-title">{goal.title}</h4>
                  <span className="goal-category">{goal.category}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                  <span style={{ 
                    color: getStatusColor(goal.status),
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}>
                    {goal.status}
                  </span>
                  <span style={{ 
                    color: getPriorityColor(goal.priority),
                    fontSize: '0.75rem',
                    fontWeight: '500'
                  }}>
                    {goal.priority} Priority
                  </span>
                </div>
              </div>

              {goal.description && (
                <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  {goal.description}
                </p>
              )}

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

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                margin: '1rem 0',
                fontSize: '0.875rem',
                color: '#64748b'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Calendar size={16} />
                  <span>Target: {new Date(goal.targetDate).toLocaleDateString()}</span>
                </div>
                {goal.monthlyContribution > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <DollarSign size={16} />
                    <span>{formatINR(goal.monthlyContribution)}/mo</span>
                  </div>
                )}
              </div>

              {/* Quick Add Money */}
              {goal.status === 'Active' && (
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="number"
                      placeholder="Amount"
                      min="0"
                      step="0.01"
                      id={`amount-${goal._id}`}
                      style={{ 
                        flex: 1, 
                        padding: '0.5rem', 
                        border: '1px solid #e2e8f0', 
                        borderRadius: '0.25rem',
                        fontSize: '0.875rem'
                      }}
                    />
                    <button
                      onClick={() => {
                        const amount = parseFloat(document.getElementById(`amount-${goal._id}`).value);
                        if (amount > 0) {
                          handleAddMoney(goal._id, amount);
                          document.getElementById(`amount-${goal._id}`).value = '';
                        }
                      }}
                      className="btn btn-success btn-sm"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link 
                  to={`/goals/${goal._id}/edit`} 
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1, textAlign: 'center' }}
                >
                  <Edit size={16} style={{ marginRight: '0.25rem' }} />
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(goal._id)}
                  className="btn btn-danger btn-sm"
                  style={{ flex: 1 }}
                >
                  <Trash2 size={16} style={{ marginRight: '0.25rem' }} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GoalsList;
