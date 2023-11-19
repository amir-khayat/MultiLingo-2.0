import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom';
import LogoutIcon from '../images/Logout-Icon.png';
import Back from '../images/Back.png';
import HeartPaw from '../images/Heart-Paw.png';
import BlackDeleteIcon from '../images/Black-Delete-Icon.png';
import RedDeleteIcon from '../images/Red-Delete-Icon.png';
import '../css/Profile.css';
import '../css/Dashboard.css';
import { useNavigate } from 'react-router-dom';



const SavedFlashCards = (props) => {

  const { sessionId, setSessionId } = props;
  const { languageId } = useParams();

  const [savedFlashCards, setSavedFlashCards] = useState([]);
  const navigate = useNavigate();



  useEffect(() => {
    fetch(`http://127.0.0.1:5000/savedflashcards/user/${sessionId}/language/${languageId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setSavedFlashCards(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [sessionId, languageId]);

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

  const handleDelete = (flashcardId) => {
    fetch(`http://127.0.0.1:5000/flashcards/${flashcardId}`, {
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
        console.log("flashcardId", flashcardId);
        const newCards = savedFlashCards.filter((flashcard) => flashcard.id !== flashcardId);
        console.log("newCards", newCards);
        setSavedFlashCards(newCards);
        console.log("savedFlashCards", savedFlashCards);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // useEffect(() => {
  //   fetch(`http://127.0.0.1:5000/users/${sessionId}`)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setUserData(data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, [sessionId]);



  return (
    <div>
      <div className="d-flex justify-content-between align-items-center px-5 pt-5 background-dashboard">
        <h2>Saved Cards</h2>
        <div className="d-flex gap-3">
          <Link className="btn dashboard" to={`/dashboard/${sessionId}`}><img src={Back} alt="" className='dashboard_icon' />Back</Link>
          <button className="btn logout" onClick={handleLogout}><img src={LogoutIcon} alt="" className='logout_icon' /> Logout</button>
        </div>
      </div>
      <div className='container mt-5'>
        <h2 className="my-4 text-decoration-underline">
          Saved:
          <img
            src={HeartPaw}
            alt="HeartPaw"
            className="heart-paw-icon"
            style={{ width: '40px', height: '40px', marginLeft: '5px' }}
          />
        </h2>
        <div className="d-flex justify-content-center ">
          <ul className="list-unstyled w-50 language-list">
            {savedFlashCards.length > 0 ? (
              savedFlashCards.map((flashcard) => (
                <div className="d-flex align-items-center my-3 px-4" key={flashcard.id}>
                  <Link to={`/checksavedflashcard/${flashcard.id}/${languageId}`} className="language">
                    <li className="d-flex align-items-center justify-content-between p-3">
                      <div>{flashcard.word}</div>
                      <div>{flashcard.translation}</div>
                    </li>
                  </Link>
                  <button className="delete" onClick={() => handleDelete(flashcard.id)}>
                    <div className="icon-container">
                      <img src={BlackDeleteIcon} alt="" className="delete_icon black" />
                      <img src={RedDeleteIcon} alt="" className="delete_icon red" />
                    </div>
                  </button>
                </div>
              ))
            ) : (
              <div className="empty-list-message mt-5">
                <p>You have no saved cards.</p>
              </div>
            )}
          </ul>
        </div>
      </div>
    </div >

  )
}

export default SavedFlashCards;