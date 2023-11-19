import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import LogoutIcon from '../images/Logout-Icon.png';
import Back from '../images/Back.png';
import AddIconBlack from '../images/Add-Icon.png';
import AddIconGreen from '../images/Add-Icon-Green.png';
import ScratchingCat from '../images/Scratching-Cat.png';
import '../css/Dashboard.css';
import '../css/Profile.css';


const AddLanguage = (props) => {
  const { sessionId, setSessionId } = props;
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

  const handleLogout = () => {
    // Delete the session from the server
    fetch(`http://127.0.0.1:5000/logout_session`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        session_id: sessionId
      })
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setSessionId('');
        navigate('/');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const languageOptions = [
    "English", "Chinese", "Spanish", "French", "Arabic",
    "Russian", "German", "Japanese", "Portuguese", "Hindi",
    "Korean", "Turkish", "Italian", "Dutch", "Punjabi"
  ];

  const index = languageOptions.indexOf(userData.user_language);
  if (index > -1) {
    languageOptions.splice(index, 1);
  }

  const addLanguage = [
    'Add Language', // English (already present in the original list)
    'Sprache hinzufügen', // German
    'Aggiungi lingua', // Italian
    'Agregar idioma', // Spanish
    'Добавить язык', // Russian
    '言語を追加', // Japanese
    'Add Language', // English (already present in the original list)
    '添加语言', // Chinese
    'Ajouter une langue', // French
    'إضافة لغة', // Arabic
    'Legg til språk', // Norwegian
    '언어 추가', // Korean
    'Add Language', // English (already present in the original list)
  ];


  const [addLanguageIndex, setAddLanguageIndex] = useState(0);

  const handleAddLanguageHover = () => {
    setAddLanguageIndex((addLanguageIndex + 1) % addLanguage.length);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center px-5 pt-5 background-dashboard">
        <h2 onMouseEnter={handleAddLanguageHover} className="profile-transition">{addLanguage[addLanguageIndex]}</h2>
        <div className="d-flex gap-3">
          <Link className="btn dashboard" to={`/dashboard/${sessionId}`}><img src={Back} alt="" className='dashboard_icon' />Back</Link>
          <button className="btn logout" onClick={handleLogout}><img src={LogoutIcon} alt="" className='logout_icon' /> Logout</button>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="rounded border p-4"
        style={{
          fontFamily: 'Arial, sans-serif',
          border: '1px solid #ccc',
          padding: '40px',
          borderRadius: '12px',
          maxWidth: '600px',
          margin: '15em auto 0',
          position: 'relative',
          top: '50%',
          transform: 'translateY(-50%)',
        }}>
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

        <div className="d-flex justify-content-center mt-4 ">
          <button className="add" style={{
            backgroundColor: 'transparent', // Set the background color to transparent
            border: 'none', // Optionally remove the border too
          }}>
            <div className="add-icon-container">
              <img src={AddIconBlack} alt="" className='add_icon black-add' />
              <img src={AddIconGreen} alt="" className='add_icon green-add' />
              Language
            </div>
          </button>
          <img
            src={ScratchingCat}
            alt="ScratchingCat"
            className="scratching-cat"
            style={{
              position: 'absolute',
              bottom: '-140px', // Adjust the distance from the bottom
              right: '0',
              width: '120px', // Adjust the width as needed
              height: 'auto', // Maintain aspect ratio
            }}
          />

        </div>

      </form>
    </div>



  )
}

export default AddLanguage;
