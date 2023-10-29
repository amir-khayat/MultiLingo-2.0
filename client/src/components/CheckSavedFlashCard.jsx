import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

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
        <div className="card text-center" style={{ maxWidth: "400px", margin: "0 auto" }}>
            <div className="card-header">
                {flashcardInfo.language} Flashcard {/* Use flashcardInfo.language */}
            </div>
            <div className="card-body d-flex align-items-center justify-content-evenly">
                <h1 className="card-title mb-0">Word:</h1>
                <h2 className="card-title mb-0">{flashcardInfo.word}</h2>
            </div>

            <div className="card-text">
                <p>Pronunciation: {flashcardInfo.pronunciation}</p>
                <p>Translation: {flashcardInfo.translation}</p>
                <p>Definition: {flashcardInfo.definition}</p>
            </div>

            <img src={flashcardInfo.image} className="card-img-bottom" style={{ width: "100%", height: "auto" }} alt="Flashcard Image" />
            <div className="card-footer text-muted">
                <Link to={`/savedflashcards/${languageId}`} className="btn btn-primary">Back to Saved Flashcards</Link>
            </div>

        </div>
    );
}

export default CheckSavedFlashCard;
