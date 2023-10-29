import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../css/FlashCard.css';


function CheckSavedFlashCard(props) {
    const { sessionId } = props;
    const { wordId } = useParams();
    const { languageId } = useParams();

    console.log("wordId: ", wordId);

    const [flashcardInfo, setFlashcardInfo] = useState({});

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

    // Return JSX outside of useEffect
    return (
        <div className="wrapper">
            <div className="flip-card">
                <div className="flip-card-inner">
                    <div className="flip-card-front">
                        <div className="word-section">
                            <div className="word">
                                <p>{flashcardInfo.word}</p>
                            </div>
                        </div>
                        <div className="details">
                            <p><strong>Pronunciation:</strong> {flashcardInfo.pronunciation}</p>
                            <br />
                            <p><strong>Translation:</strong> {flashcardInfo.translation}</p>
                            <br />
                            <p><strong>Definition:</strong> {flashcardInfo.definition}</p>
                        </div>
                    </div>

                    <div className="flip-card-back">
                        <img src={flashcardInfo.image} className="squareImage" alt="Square Unsplash Image" />
                    </div>
                </div>
            </div>
            <div className="card-footer text-muted">
                <Link to={`/savedflashcards/${languageId}`} className="btn btn-primary">Back to Saved Flashcards</Link>
            </div>
        </div>
    );
}

export default CheckSavedFlashCard;
