import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import LogoutIcon from '../images/Logout-Icon.png';
import DashboardIcon from '../images/Dashboard-Icon.png';
import CatPeep from '../images/Cat-Peep.png';
import '../css/Profile.css';



const Profile = (props) => {
  const { sessionId, setSessionId } = props;
  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    user_language: ''
  });
  const navigate = useNavigate();


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

  const profile = [
    'Profile',
    'Profil', // German
    'Profilo', // Italian
    'Profile', // English
    'Профиль', // Russian
    'プロフィール', // Japanese
    'Perfil', // Spanish
    '个人资料', // Chinese
    'Profile', // English
    'Profil', // French
    'الملف الشخصي', // Arabic
    'Profil', // Norwegian
    '프로필', // Korean
    'Profile', // English
  ];


  const [profileIndex, setProfileIndex] = useState(0);

  const handleProfileHover = () => {
    setProfileIndex((profileIndex + 1) % profile.length);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center px-5 pt-5 background-dashboard">
        <h2 onMouseEnter={handleProfileHover} className="profile-transition">{profile[profileIndex]}</h2>
        <div className="d-flex gap-3">
          <Link className="btn dashboard" to={`/dashboard/${sessionId}`}><img src={DashboardIcon} alt="" className='dashboard_icon' />Dashboard</Link>
          <button className="btn logout" onClick={handleLogout}><img src={LogoutIcon} alt="" className='logout_icon' /> Logout</button>
        </div>
      </div>
      {/* Rest of your profile information */}
      <div style={{ fontFamily: 'Arial, sans-serif', border: '1px solid #ccc', padding: '40px', borderRadius: '12px', maxWidth: '600px', margin: '15em auto 0', position: 'relative', top: '50%', transform: 'translateY(-50%)' }}>
        <div style={{ position: 'relative' }}>
          <img src={CatPeep} alt="CatPeep" style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            width: '100px', // Adjust the width as needed
            height: 'auto' // Maintain aspect ratio
          }} />
          {/* Rest of your profile information */}
        </div>
        <h2 style={{ textAlign: 'center', fontSize: '24px', marginBottom: '20px' }}>User Information</h2>
        <div style={{ marginBottom: '30px' }}>
          <ul style={{ listStyle: 'none', padding: '0' }}>
            <li style={{ marginBottom: '12px', fontSize: '16px' }}>
              <strong>First Name:</strong> {userData.first_name}
            </li>
            <li style={{ marginBottom: '12px', fontSize: '16px' }}>
              <strong>Last Name:</strong> {userData.last_name}
            </li>
            <li style={{ marginBottom: '12px', fontSize: '16px' }}>
              <strong>Email:</strong> {userData.email}
            </li>
            <li style={{ marginBottom: '12px', fontSize: '16px' }}>
              <strong>User Language:</strong> {userData.user_language}
            </li>
          </ul>
        </div>
        <div style={{ textAlign: 'center' }}>
          <a
            href={`/editprofile/${sessionId}`}
            style={{
              textDecoration: 'none',
              backgroundColor: '#4CAF50',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '5px',
              fontSize: '18px',
              transition: 'background-color 0.3s ease',
              display: 'inline-block'
            }}
            onMouseOver={(e) => { e.target.style.backgroundColor = '#388E3C'; }}
            onMouseOut={(e) => { e.target.style.backgroundColor = '#4CAF50'; }}
          >
            Edit Profile
          </a>
        </div>
      </div>
    </div>
  );
};

export default Profile;
