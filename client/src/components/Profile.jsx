import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Profile = (props) => {
  const { sessionId } = props;
  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    user_language: ''
  });

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

  return (
    <div>
      <h1>Profile</h1>
      <h2>User Information</h2>
      <p>First Name: {userData.first_name}</p>
      <p>Last Name: {userData.last_name}</p>
      <p>Email: {userData.email}</p>
      <p>User Language: {userData.user_language}</p>
      <Link to={`/editprofile/${sessionId}`}>Edit Profile</Link>
      <br />
      <Link to={`/dashboard/${sessionId}`}>Dashboard</Link>
    </div>
  );
};

export default Profile;
