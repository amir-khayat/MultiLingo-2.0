import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom';


const SavedFlashCards = (props) => {

  const { sessionId } = props;
  const { languageId } = useParams();

  const [savedFlashCards, setSavedFlashCards] = useState([]);
  const [userData, setUserData] = useState({});



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
      <h1 className="mt-4">Saved Flash Cards</h1>
      <hr />
        <div className="border border-dark p-3 m-5 ">
          <div className="container" style={{ height: '400px', overflow: 'auto' }}>
            <div className="row">
              {savedFlashCards.map((flashcard) => {
                return (
                  <Link to={`/checksavedflashcard/${flashcard.id}/${languageId}`} className="col-md-12 mb-3" key={flashcard.id}>
                    <div className="col-md-12 mb-3" key={flashcard.id}>
                      <div className="card">
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-6">
                              <h3 className="card-title">{flashcard.word}</h3>
                            </div>
                            <div className="col-md-6">
                              <h3 className="card-subtitle text-muted">{flashcard.translation}</h3>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
        <Link to={`/dashboard/${sessionId}`} className="btn btn-primary mb-3"> Back to Dashboard </Link>

    </div>





  )
}

export default SavedFlashCards;