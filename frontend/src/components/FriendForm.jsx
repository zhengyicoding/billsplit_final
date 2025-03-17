import { useState, useEffect } from 'react';
import FormField from './FormField';
import Button from './Button';
import '../css/FriendForm.css';
import PropTypes from 'prop-types';

function FriendForm({ onSubmit, initialData = null }) {
  const [formData, setFormData] = useState({
    name: '',
    profilePic: '',
  });

  const [errors, setErrors] = useState({});
  const [previewUrl, setPreviewUrl] = useState('');

  // Initialize form if editing an existing friend
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        profilePic: initialData.profilePic || '',
      });
      
      if (initialData.profilePic) {
        setPreviewUrl(initialData.profilePic);
      }
    }
  }, [initialData]);

  const handleInputChange = (value, name) => {
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Update preview if profilePic field changes
    if (name === 'profilePic') {
      setPreviewUrl(value);
    }
    
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
    
    // Optionally validate URL format if provided
    if (formData.profilePic && !isValidUrl(formData.profilePic)) {
      newErrors.profilePic = 'Please enter a valid URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Simple URL validation
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
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
      
      <FormField 
        label="Profile Picture URL"
        name="profilePic"
        value={formData.profilePic}
        onChange={handleInputChange}
        error={errors.profilePic}
        placeholder="Leave empty for random avatar"
      />
      
      {previewUrl && (
        <div className="profile-preview">
          <img 
            src={previewUrl} 
            alt="Profile preview" 
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random`;
              setErrors({
                ...errors,
                profilePic: 'Invalid image URL. A default will be used.'
              });
            }}
          />
        </div>
      )}
      
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
    profilePic: PropTypes.string,
  }),
};

export default FriendForm;