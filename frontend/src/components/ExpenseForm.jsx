import { useState, useEffect } from 'react';
import FormField from './FormField';
import Button from './Button';
import './ExpenseForm.css';
import PropTypes from 'prop-types';

function ExpenseForm({ onSubmit, initialData = null, friends = [] }) {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    friendId: '',
    date: new Date().toISOString().slice(0, 10),
    splitMethod: 'equally',
    paidBy: 'you',
    userAmount: '',
  });

  const [errors, setErrors] = useState({});

  // Initialize form if editing an existing expense
  useEffect(() => {
    if (initialData) {
      // Format the date for the date input
      const formattedDate = new Date(initialData.date).toISOString().slice(0, 10);
      
      setFormData({
        description: initialData.description || '',
        amount: initialData.amount || '',
        friendId: initialData.friendId || '',
        date: formattedDate,
        splitMethod: initialData.splitMethod || 'equally',
        paidBy: initialData.paidBy || 'you',
        userAmount: initialData.userAmount || '',
      });
    }
  }, [initialData]);

  const handleInputChange = (value, name) => {
    if (name === 'amount' && value && formData.splitMethod === 'equally') {
      // When amount changes for an equal split, update userAmount automatically
      const amount = parseFloat(value);
      setFormData({
        ...formData,
        amount: value,
        userAmount: (amount / 2).toFixed(2),
      });
    } else if (name === 'splitMethod' && value === 'equally' && formData.amount) {
      // When switching to equal split, recalculate userAmount
      const amount = parseFloat(formData.amount);
      setFormData({
        ...formData,
        splitMethod: value,
        userAmount: (amount / 2).toFixed(2),
      });
    } else {
      // Normal field update
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Clear error for the field being edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

    
    // For custom split, validate userAmount
    const validate = () => {
        const newErrors = {};
        
        if (!formData.description.trim()) {
          newErrors.description = 'Description is required';
        }
        
        if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
          newErrors.amount = 'Valid amount is required';
        }
        
        if (!formData.friendId) {
          newErrors.friendId = 'Please select a friend';
        }
        
        // For custom split, validate userAmount
        if (formData.splitMethod === 'custom') {
          if (!formData.userAmount || isNaN(formData.userAmount)) {
            newErrors.userAmount = 'Your share amount is required';
          } else if (parseFloat(formData.userAmount) > parseFloat(formData.amount)) {
            newErrors.userAmount = 'Your share cannot exceed the total amount';
          }
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        
        if (validate()) {
          onSubmit(formData);
        }
      };
    
      // Calculate the friend's portion of the bill
      const friendAmount = 
        formData.amount && formData.userAmount
          ? (parseFloat(formData.amount) - parseFloat(formData.userAmount)).toFixed(2)
          : '';
      
      // Get the selected friend's name
      const selectedFriendName = formData.friendId
        ? friends.find(f => f._id === formData.friendId)?.name || 'Friend'
        : 'Friend';
    
      return (
        <form className="expense-form" onSubmit={handleSubmit}>
          <FormField 
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            error={errors.description}
            placeholder="Enter expense description"
          />
          
          <FormField 
            label="Total Amount ($)"
            name="amount"
            type="number"
            min="0.01"
            step="0.01"
            value={formData.amount}
            onChange={handleInputChange}
            required
            error={errors.amount}
            placeholder="0.00"
          />
          
          <FormField 
            label="Split With"
            name="friendId"
            type="select"
            value={formData.friendId}
            onChange={handleInputChange}
            required
            error={errors.friendId}
            placeholder="Select a friend"
            options={friends.map(friend => ({
              value: friend._id,
              label: friend.name
            }))}
          />
          
          <FormField 
            label="Date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleInputChange}
            required
          />
          
          <FormField 
            label="Who Paid?"
            name="paidBy"
            type="radio"
            value={formData.paidBy}
            onChange={handleInputChange}
            options={[
              { value: 'you', label: 'You Paid Full Amount' },
              { value: 'friend', label: `${selectedFriendName} Paid Full Amount` }
            ]}
          />
          
          <FormField 
            label="Split Method"
            name="splitMethod"
            type="radio"
            value={formData.splitMethod}
            onChange={handleInputChange}
            options={[
              { value: 'equally', label: 'Split Equally (50/50)' },
              { value: 'custom', label: 'Custom Split' }
            ]}
          />
          
          {formData.splitMethod === 'custom' && (
            <div className="custom-split-section">
              <FormField 
                label="Your Share ($)"
                name="userAmount"
                type="number"
                min="0"
                step="0.01"
                value={formData.userAmount}
                onChange={handleInputChange}
                required={formData.splitMethod === 'custom'}
                error={errors.userAmount}
                placeholder="0.00"
              />
              
              {formData.amount && formData.userAmount && (
                <div className="friend-paid-summary">
                  <p>
                    {selectedFriendName}'s share: 
                    <span className="amount">${friendAmount}</span>
                  </p>
                </div>
              )}
            </div>
          )}
          
          {formData.amount && (
            <div className="split-summary">
              {formData.paidBy === 'you' ? (
                <p>
                  {formData.splitMethod === 'equally' ? (
                    <span className="balance positive">
                      {selectedFriendName} owes you: 
                      ${(parseFloat(formData.amount) / 2).toFixed(2)}
                    </span>
                  ) : (
                    <span className="balance positive">
                      {selectedFriendName} owes you: 
                      ${friendAmount}
                    </span>
                  )}
                </p>
              ) : (
                <p>
                  {formData.splitMethod === 'equally' ? (
                    <span className="balance negative">
                      You owe {selectedFriendName}: 
                      ${(parseFloat(formData.amount) / 2).toFixed(2)}
                    </span>
                  ) : (
                    <span className="balance negative">
                      You owe {selectedFriendName}: 
                      ${formData.userAmount}
                    </span>
                  )}
                </p>
              )}
            </div>
          )}
          
          <div className="form-actions">
            <Button type="submit" variant="primary">
              {initialData ? 'Save Changes' : 'Add Expense'}
            </Button>
          </div>
        </form>
      );
    }
    ExpenseForm.propTypes = {
      onSubmit: PropTypes.func.isRequired,
      initialData: PropTypes.shape({
        description: PropTypes.string,
        amount: PropTypes.number,
        friendId: PropTypes.string,
        date: PropTypes.string,
        splitMethod: PropTypes.string,
        paidBy: PropTypes.string,
        userAmount: PropTypes.number,
      }),
      friends: PropTypes.arrayOf(PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      })).isRequired,
    };
    
    
    export default ExpenseForm;