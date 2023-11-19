import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import LogoutIcon from '../images/Logout-Icon.png';
import Back from '../images/Back.png';


import '../css/FlashCard.css';


function CheckSavedFlashCard(props) {
    const { sessionId, setSessionId } = props;

    const [flashcardInfo, setFlashcardInfo] = useState({});
    const [liked, setLiked] = useState(false);



    const { wordId } = useParams();
    const { languageId } = useParams();
    const navigate = useNavigate();

    console.log("wordId: ", wordId);

    useEffect(() => {
        fetch(`http://127.0.0.1:5000/flashcards/${wordId}`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setFlashcardInfo(data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [wordId]); // Add wordId as a dependency

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





    const word = [
        `${flashcardInfo.translation}`,
        `${flashcardInfo.word}`
    ];

    const [wordIndex, setWordIndex] = useState(0);

    const handleWordHover = () => {
        setWordIndex((wordIndex + 1) % word.length);
    };


    // Return JSX outside of useEffect
    return (
        <div>
            <div className="d-flex justify-content-between align-items-center px-5 pt-5 background-dashboard">
                <h2 onMouseEnter={handleWordHover} className="profile-transition">{word[wordIndex]}</h2>
                <div className="d-flex gap-3">
                    <Link className="btn dashboard" to={`/savedflashcards/${languageId}`}><img src={Back} alt="" className='dashboard_icon' />Back</Link>
                    <button className="btn logout" onClick={handleLogout}><img src={LogoutIcon} alt="" className='logout_icon' /> Logout</button>
                </div>
            </div>
            <div className="wrapper">
                <div className="flip-card">
                    <div className="flip-card-inner">
                        <div className="flip-card-front">
                            <img src={flashcardInfo.image} className="squareImage" alt={flashcardInfo.translation} />
                        </div>

                        <div className="flip-card-back">
                            <div className="word-section">
                                <div className="word">
                                    <p>{flashcardInfo.word}</p>
                                </div>
                            </div>
                            <hr className='hr' />
                            <div className="details">
                                <p><strong>Pronunciation:</strong> {flashcardInfo.pronunciation}</p>
                                <hr />
                                <p><strong>Translation:</strong> {flashcardInfo.translation}</p>
                                <hr />
                                <p><strong>Definition:</strong> {flashcardInfo.definition}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CheckSavedFlashCard;
