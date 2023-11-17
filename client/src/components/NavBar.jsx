import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../images/Logo.png';
import '../css/NavBar.css';

const NavBar = (props) => {
    const { sessionId } = props;

    return (
        <div className='background_color'>
            <nav className="navbar navbar-expand-lg">
                <div className="container">
                    <div className="navbar-brand mx-auto mt-3">
                        {sessionId ? (
                            <Link to={`/dashboard/${sessionId}`}>
                                <img src={Logo} alt="MultiLingo Logo" style={{ maxWidth: '300px' }} />
                            </Link>
                        ) : (
                            <Link to='#'>
                                <img src={Logo} alt="MultiLingo Logo" style={{ maxWidth: '300px' }} />
                            </Link>
                        )}
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default NavBar;
