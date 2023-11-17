import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const AddLanguage = (props) => {
  const { sessionId } = props;
  const [formData, setFormData] = useState({
    language: '',
    intensity: '',
    user_id: sessionId,
  });

  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    user_language: '',
  });


  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data from the server
    fetch(`http://127.0.0.1:5000/users/${sessionId}`)
      .then((response) => response.json())
      .then((data) => {
        setUserData(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [sessionId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({}); // Clear previous errors on form submission
    fetch("http://127.0.0.1:5000/add_language", { // Corrected URL
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setFormData({ // Corrected call to setFormData
            language: '',
            intensity: '',
            user_id: sessionId,
          });
          console.log("Language added successfully");
          navigate("/dashboard/" + sessionId);
        } else {
          setErrors(data); // Display error message from the backend
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const languageOptions = [
    "English", "Chinese", "Spanish", "French", "Arabic",
    "Russian", "German", "Japanese", "Portuguese", "Hindi",
    "Korean", "Turkish", "Italian", "Dutch", "Spanish"
  ];

  const index = languageOptions.indexOf(userData.user_language);
  if (index > -1) {
    languageOptions.splice(index, 1);
  }

  return (
    <div className="container">
      <h1 className="mt-4 mb-4">Add Language</h1>
      <form onSubmit={handleSubmit} className="rounded border p-4">
        <div className="mb-3">
          <label htmlFor="language" className="form-label">
            Language
          </label>
          <select
            className="form-select"
            name="language"
            value={formData.language}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select a language</option>
            {languageOptions.map((language, index) => (
              <option key={index} value={language}>
                {language}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="intensity" className="form-label">
            Learning Intensity
          </label>
          <select
            className="form-select"
            name="intensity"
            onChange={handleChange}
            value={formData.intensity}
            required
          >
            <option value="">Select Learning Intensity</option>
            <option value="Beginner">1 - Beginner</option>
            <option value="Intermediate">2 - Intermediate</option>
            <option value="Advanced">3 - Advanced</option>
          </select>
        </div>

        <button type="submit" className="btn btn-success">
          Add Language
        </button>
      </form>
      <Link to={`/dashboard/${sessionId}`} className="btn btn-sm btn-danger mt-4">Back to Dashboard</Link>
    </div>



  )
}

export default AddLanguage;
