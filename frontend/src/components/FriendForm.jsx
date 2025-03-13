import { useState, useEffect } from 'react';
import FormField from './FormField';
import Button from './Button';
import './FriendForm.css';
import PropTypes from 'prop-types';

function FriendForm({ onSubmit, initialData = null }) {
  const [formData, setFormData] = useState({
    name: '',
  });

  const [errors, setErrors] = useState({});

  // Initialize form if editing an existing friend
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
      });
    }
  }, [initialData]);

  const handleInputChange = (value, name) => {
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for the field being edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
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

  return (
    <form className="friend-form" onSubmit={handleSubmit}>
      <FormField 
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        required
        error={errors.name}
        placeholder="Enter friend's name"
      />
      
      <div className="form-actions">
        <Button type="submit" variant="primary">
          {initialData ? 'Save Changes' : 'Add Friend'}
        </Button>
      </div>
    </form>
  );
}
FriendForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    name: PropTypes.string,
  }),
};

export default FriendForm;