import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import LogoutIcon from '../images/Logout-Icon.png';
import DashboardIcon from '../images/Dashboard-Icon.png';
import CatCofee from '../images/Cat-Coffee.png';
import '../css/Profile.css';


const EditProfile = (props) => {
    const { sessionId, setSessionId } = props;
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        user_language: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        // Fetch user data from the server and populate the form
        fetch(`http://127.0.0.1:5000/users/${sessionId}`)
            .then((response) => response.json())
            .then((data) => {
                setFormData(data);
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

    const handleSubmit = (e) => {
        e.preventDefault();

        // Update user data on the server
        fetch(`http://127.0.0.1:5000/users/${sessionId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setFormData({
                        first_name: '',
                        last_name: '',
                        email: '',
                        user_language: ''
                    });
                    console.log('Profile updated successfully');
                    navigate("/profile/" + sessionId)
                } else {
                    setErrors(data); // Display error message from backend
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const languageOptions = [
        "English", "Mandarin Chinese", "Spanish", "French", "Arabic",
        "Russian", "German", "Japanese", "Portuguese", "Hindi",
        "Korean", "Turkish", "Italian", "Dutch", "Spanish"
    ];

    const editProfile = [
        'Edit Profile', // English (already present in the original list)
        'Profil bearbeiten', // German
        'Modifica profilo', // Italian
        'Editar perfil', // Spanish
        'Редактировать профиль', // Russian
        'プロフィールを編集', // Japanese
        'Edit Profile', // English (already present in the original list)
        '编辑个人资料', // Chinese
        'Modifier le profil', // French
        'تعديل الملف الشخصي', // Arabic
        'Rediger profil', // Norwegian
        '프로필 편집', // Korean
    ];



    const [editProfileIndex, setEditProfileIndex] = useState(0);

    const handleEditProfileHover = () => {
        setEditProfileIndex((editProfileIndex + 1) % editProfile.length);
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center px-5 pt-5 background-dashboard">
                <h2 onMouseEnter={handleEditProfileHover} className="profile-transition">{editProfile[editProfileIndex]}</h2>
                <div className="d-flex gap-3">
                    <Link className="btn dashboard" to={`/dashboard/${sessionId}`}><img src={DashboardIcon} alt="" className='dashboard_icon' />Dashboard</Link>
                    <button className="btn logout" onClick={handleLogout}><img src={LogoutIcon} alt="" className='logout_icon' /> Logout</button>
                </div>
            </div>
            <form
                onSubmit={handleSubmit}
                className="rounded border p-4"
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
                }}
            >
                <img
                    src={CatCofee}
                    alt="CatCoffee"
                    className="cat-coffee"
                    style={{
                        position: 'absolute',
                        top: '-90px', // Adjust the distance from the top
                        right: '20px', // Adjust the distance from the right
                        width: '170px', // Adjust the width as needed
                        height: 'auto', // Maintain aspect ratio
                    }}
                />
                {Object.keys(errors).length > 0 && (
                    <div className="alert alert-danger">
                        {Object.values(errors).map((error, index) => (
                            <p key={index} className="text-danger">{error}</p>
                        ))}
                    </div>
                )}
                <div className="mb-3">
                    <label htmlFor="first_name" className="form-label">First Name:</label>
                    <input
                        type="text"
                        className="form-control"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="last_name" className="form-label">Last Name:</label>
                    <input
                        type="text"
                        className="form-control"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email:</label>
                    <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">User Language:</label>
                    <select
                        className="form-select"
                        name="user_language"
                        value={formData.user_language}
                        onChange={handleChange}
                    >
                        <option value="" disabled>Select a language</option>
                        {languageOptions.map((language, index) => (
                            <option key={index} value={language}>
                                {language}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">Update Profile</button>
            </form>
        </div>

    );
};

export default EditProfile;
