import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const EditProfile = (props) => {
    const { sessionId } = props;
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

    return (
        <div className="container mt-5">
            <h1>Edit Profile</h1>
            <form onSubmit={handleSubmit} className="rounded border p-4">
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
