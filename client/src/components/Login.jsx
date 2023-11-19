import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardIcon from '../images/Dashboard-Icon.png';
import '../css/Dashboard.css';


const Login = (props) => {
    const { setSessionId } = props;
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch("http://127.0.0.1:5000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setFormData({
                        email: '',
                        password: '',
                    });
                    console.log("Logged in successfully");
                    setSessionId(data.user_id);
                    navigate("/dashboard/" + data.user_id)
                } else {
                    setErrors(data); // Display error message from backend
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center px-5 pt-5 background-dashboard">
                <h2>Login</h2>
                <div className="d-flex gap-3">
                    <Link className="btn dashboard" to={`/register`}>Register</Link>
                    <Link className="btn logout" to={`/`}><img src={DashboardIcon} alt="" className='dashboard_icon' />Home</Link>
                </div>
            </div>
            <form onSubmit={handleSubmit} style={{
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
                {Object.keys(errors).length > 0 ? (
                    <div className="alert alert-danger">
                        {Object.values(errors).map((error, index) => (
                            <p key={index} className="text-danger">{error}</p>
                        ))}
                    </div>
                ) : null}



                <div className="mb-3">
                    <label className="form-label">Email:</label>
                    <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Passwordsss:</label>
                    <input
                        type="password"
                        className="form-control"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
        </div>
    );
};

export default Login;
