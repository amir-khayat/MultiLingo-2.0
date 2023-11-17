import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '../images/Logout-Icon.png';
import AddIconBlack from '../images/Add-Icon.png';
import AddIconGreen from '../images/Add-Icon-Green.png';
import ProfileIcon from '../images/Profile-Icon.png';
import BlackDeleteIcon from '../images/Black-Delete-Icon.png';
import RedDeleteIcon from '../images/Red-Delete-Icon.png';
import Cat1 from '../images/Cat1.png';
import Cat2add from '../images/Cat2+.png';
import FavoriteIcon from '../images/Favorite.png';
import CatPop from '../images/Cat-Popup.png';
import '../css/Dashboard.css';


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

  const hello = [
    'Hello',
    'Hola',
    'Bonjour',
    'Hallo',
    'Ciao',
    'Hello',
    'Привет',
    'こんにちは',
    '你好',
    'Hello',
    'مرحبا', // It's also used as "Hello" in Arabic
    'Olá',
    'Hallo',
    'Hej',
    '여보세요',
    'Hei',
    'Hello',
  ];

  const [helloIndex, setHelloIndex] = useState(0);

  const handleHelloHover = () => {
    setHelloIndex((helloIndex + 1) % hello.length);
  };

  const [showAdditionalImage, setShowAdditionalImage] = useState(false);

  const handleCat1Hover = () => {
    setShowAdditionalImage(true);
  };

  const handleCat1Leave = () => {
    setShowAdditionalImage(false);
  };


  return (
    <div>
      <div className="d-flex justify-content-between align-items-center px-5 pt-5 background-dashboard">
        <h2 onMouseEnter={handleHelloHover} className="hello-transition"> {hello[helloIndex]} {userData.first_name}</h2>
        <div className="d-flex gap-3">
          <Link className="btn profile" to={`/profile/${sessionId}`}><img src={ProfileIcon} alt="" className='profile_icon' /> Profile</Link>
          <button className="btn logout" onClick={handleLogout}><img src={LogoutIcon} alt="" className='logout_icon' /> Logout</button>
        </div>
      </div>
      <div className='container mt-5'>
        <h2 className="my-4 text-decoration-underline">Languages:</h2>
        <div className="d-flex justify-content-center ">
          <ul className="list-unstyled w-50 language-list">
            {languages.length > 0 ? (
              languages.map((language) => (
                <div className="d-flex align-items-center my-3 px-4" key={language.id}>
                  <Link to={`/flashcard/${language.id}`} className="language">
                    <li className="d-flex align-items-center justify-content-between p-3">
                      <div>{language.language}</div>
                      <div>{language.intensity}</div>
                      <div>
                        <Link to={`/savedflashcards/${language.id}`} style={{ textDecoration: 'none' }}>
                          <button className="btn favorite">
                            <img src={FavoriteIcon} alt="" className="favorite_icon" /> Favorited
                          </button>
                        </Link>
                      </div>
                    </li>
                  </Link>
                  <button className="delete" onClick={() => handleDelete(language.id)}>
                    <div className="icon-container">
                      <img src={BlackDeleteIcon} alt="" className="delete_icon black" />
                      <img src={RedDeleteIcon} alt="" className="delete_icon red" />
                    </div>
                  </button>
                </div>
              ))
            ) : (
              <div className="empty-list-message">
                <Link to={`/addlanguage/${sessionId}`}>
                  <img src={Cat2add} alt="" className="cat-add-image" />
                </Link>
              </div>
            )}
          </ul>
        </div>
        <div className="d-flex justify-content-center mt-4 mb-5">
          <Link className="add" to={`/addlanguage/${sessionId}`}>
            <div className="add-icon-container">
              <img src={AddIconBlack} alt="" className='add_icon black-add' />
              <img src={AddIconGreen} alt="" className='add_icon green-add' />
              Language
            </div>
          </Link>
        </div>
        <div>
          <img
            src={Cat1}
            alt="Cat1"
            className="cat-image"
            onMouseEnter={handleCat1Hover}
            onMouseLeave={handleCat1Leave}
          />
        </div>
        <div className={`additional-image ${showAdditionalImage ? 'active' : ''}`}>
        <img src={CatPop} alt="" style={{ width: '100px' }} />
        </div>
      </div>


    </div>
  );
};

export default Dashboard;
