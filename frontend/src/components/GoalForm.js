import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Save, ArrowLeft, Target, DollarSign, Calendar, Tag, AlertCircle } from 'lucide-react';

const GoalForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetAmount: '',
    currentAmount: '',
    targetDate: '',
    category: 'Other',
    priority: 'Medium',
    monthlyContribution: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      fetchGoal();
    }
  }, [id, isEdit]);

  const fetchGoal = async () => {
    try {
      const response = await axios.get(`/api/goals/${id}`);
      const goal = response.data;
      setFormData({
        title: goal.title,
        description: goal.description || '',
        targetAmount: goal.targetAmount.toString(),
        currentAmount: goal.currentAmount.toString(),
        targetDate: new Date(goal.targetDate).toISOString().split('T')[0],
        category: goal.category,
        priority: goal.priority,
        monthlyContribution: goal.monthlyContribution.toString()
      });
    } catch (error) {
      console.error('Error fetching goal:', error);
      setError('Failed to load goal');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const goalData = {
        ...formData,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: parseFloat(formData.currentAmount) || 0,
        monthlyContribution: parseFloat(formData.monthlyContribution) || 0
      };

      if (isEdit) {
        await axios.put(`/api/goals/${id}`, goalData);
      } else {
        await axios.post('/api/goals', goalData);
      }

      navigate('/goals');
    } catch (error) {
      console.error('Error saving goal:', error);
      setError(error.response?.data?.message || 'Failed to save goal');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'Emergency Fund',
    'Vacation',
    'Education',
    'Home',
    'Car',
    'Retirement',
    'Other'
  ];

  const priorities = [
    { value: 'Low', label: 'Low Priority' },
    { value: 'Medium', label: 'Medium Priority' },
    { value: 'High', label: 'High Priority' }
  ];

  return (
    <div>
      <div className="card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => navigate('/goals')}
            className="btn btn-secondary"
            style={{ padding: '0.5rem' }}
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="card-title">
            {isEdit ? 'Edit Goal' : 'Create New Goal'}
          </h1>
        </div>
      </div>

      <div className="card">
        {error && (
          <div className="alert alert-error">
            <AlertCircle size={20} style={{ marginRight: '0.5rem' }} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">
                <Target size={20} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                Goal Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g., Emergency Fund, Vacation to Europe"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Tag size={20} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-select"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-input"
              placeholder="Describe your goal and why it's important to you..."
              rows="3"
            />
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">
                <DollarSign size={20} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                Target Amount *
              </label>
              <input
                type="number"
                name="targetAmount"
                value={formData.targetAmount}
                onChange={handleChange}
                className="form-input"
                placeholder="10000"
                min="0"
                step="0.01"
                required
              />
            </div>

            {isEdit && (
              <div className="form-group">
                <label className="form-label">
                  <DollarSign size={20} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                  Current Amount
                </label>
                <input
                  type="number"
                  name="currentAmount"
                  value={formData.currentAmount}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>
            )}
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">
                <Calendar size={20} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                Target Date *
              </label>
              <input
                type="date"
                name="targetDate"
                value={formData.targetDate}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <DollarSign size={20} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                Monthly Contribution
              </label>
              <input
                type="number"
                name="monthlyContribution"
                value={formData.monthlyContribution}
                onChange={handleChange}
                className="form-input"
                placeholder="500"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Priority Level</label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {priorities.map(priority => (
                <label key={priority.value} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="radio"
                    name="priority"
                    value={priority.value}
                    checked={formData.priority === priority.value}
                    onChange={handleChange}
                    style={{ margin: 0 }}
                  />
                  <span>{priority.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => navigate('/goals')}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              <Save size={20} style={{ marginRight: '0.5rem' }} />
              {loading ? 'Saving...' : (isEdit ? 'Update Goal' : 'Create Goal')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalForm;
