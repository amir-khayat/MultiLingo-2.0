import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Dashboard = (props) => {
  const { sessionId, setSessionId } = props;
  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    user_language: ''
  });
  const [languages, setLanguages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user's languages from the server
    fetch(`http://127.0.0.1:5000/languages/user/${sessionId}`)
      .then((response) => response.json())
      .then((data) => {
        setLanguages(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [sessionId]);

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

  const handleDelete = (languageId) => {
    // Delete the language from the server
    fetch(`http://127.0.0.1:5000/languages/${languageId}`, {
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
        // Update the languages state variable
        const newLanguages = languages.filter((language) => language.id !== languageId);
        setLanguages(newLanguages);
      })
      .catch((error) => {
        console.log(error);
      });
  }; // Add this closing curly brace


  return (
    <div className="container mt-5">
      <h1>Hello, {userData.first_name}</h1>

      <button className="btn btn-primary" onClick={handleLogout}>Logout</button>

      <div className="mt-3">
        <Link className="btn btn-secondary me-2" to={`/addlanguage/${sessionId}`}>Add Language</Link>
        <Link className="btn btn-secondary" to={`/profile/${sessionId}`}>Profile</Link>
      </div>

      <h2 className="mt-4">Your Languages:</h2>
      <ul>
        {languages.map((language) => (
          <li key={language.id} className="d-flex align-items-center mt-2">
            <Link to={`/flashcard/${language.id}`}>
              {language.language} | {language.intensity}
            </Link>
            <button className="btn btn-danger ms-2" onClick={() => handleDelete(language.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
