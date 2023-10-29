import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { OPENAI_API_KEY } from '../ApiKey.js';
import '../css/FlashCard.css';
import background from '../images/background.JPG';
import imageComingSoon from '../images/image-coming-soon-placeholder.png';


const Flashcard = (props) => {
  const { sessionId } = props;
  const { languageId } = useParams();

  const [languages, setLanguages] = useState({});
  const [flashcardInfo, setFlashcardInfo] = useState({});
  const [userData, setUserData] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [apiloaded, setApiLoaded] = useState(false);
  const [englishWord, setEnglishWord] = useState('');
  const [wordsfromdb, setWordsfromdb] = useState([]);
  const [imageReady, setImageReady] = useState(false);
  const [infoReady, setInfoReady] = useState(false);
  const [liked, setLiked] = useState(false);



  useEffect(() => {
    fetch(`http://127.0.0.1:5000/languages/${languageId}`)
      .then((response) => response.json())
      .then((data) => {
        setLanguages(data);
        setLoaded(true);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [languageId]);

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/users/${sessionId}`)
      .then((response) => response.json())
      .then((data) => {
        setUserData(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [sessionId]);

  useEffect(() => {
    fetch(`http://127.0.0.1:5000//flashcards/user/${sessionId}/language/${languageId}`)
      .then((response) => response.json())
      .then((data) => {
        setWordsfromdb(data);
        // console.log("wordsfromdb", wordsfromdb); 
      })
      .catch((error) => {
        console.log(error);
      });
  }, [sessionId, languageId]);




  const handleNextWord = () => {
    setApiLoaded(false);

    const prompt = `Generate a ${languages.language} word with ${languages.intensity} intensity level. Please provide its TRANSLATION in ${userData.user_language}, DEFINITION in ${userData.user_language}, and a plain text PRONUNCIATION of the given ${languages.language} word, written in ${userData.user_language} text. Please review the following list of words carefully and avoid using any of them: [${wordsfromdb}], ensure that the generated word has a unique and distinct meaning from any word on that list. Provide the answer in JSON format with keys and values in the following format:
      {
        "word": "",
        "translation": "", // in ${userData.user_language} text 
        "definition": "", // in ${userData.user_language} text
        "image": "", // leave this blank
        "audio": "", // leave this blank
        "pronunciation": "" // pronounce the given word in ${userData.user_language} text using a simplified format (so if the user language is arabic and the word is in english it would be like this (eg. Word:Voyage Pronunciation: فو-يَيْج)
        translated_word_in_english: ""
      }`;

    console.log("prompt", prompt);


    const apiKey = OPENAI_API_KEY;

    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { "role": "system", "content": "You are a language learning assistant." },
          { "role": "user", "content": `${prompt}` },
        ]
      })
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        const messageContent = JSON.parse(data.choices[0].message.content);

        setEnglishWord(messageContent.translated_word_in_english);
        handleImage(messageContent.translated_word_in_english);

        console.log(messageContent);
        const newFlashcardInfo = {
          ...flashcardInfo,
          word: messageContent.word,
          pronunciation: messageContent.pronunciation,
          translation: messageContent.translation,
          definition: messageContent.definition,
          image: messageContent.image,
          saved: false,
          user_id: sessionId,
          language_id: languageId
        };

        // const newEnglishWord = messageContent.translated_word_in_english;

        setFlashcardInfo(newFlashcardInfo);
        setWordsfromdb(prevWords => prevWords.concat(newFlashcardInfo.word));
        setApiLoaded(true);
        // setInfoReady(true);
      })
      .catch(error => {
        console.log("aierror", error);
      });
  };

  const handleImage = (prompt) => {
    const unsplashApiKey = "FhTpHf61Ihdv4CagqxYjJVAjod7Heqi3_9Otgzi5nNM"; // Replace with your actual Unsplash API key
    console.log("prompt", prompt);
    const imageSize = 300;
    fetch(`https://api.unsplash.com/search/photos?query=${prompt}&w=${imageSize}&h=${imageSize} `, {
      headers: {
        "Accept-Version": "v1",
        "Authorization": `Client-ID ${unsplashApiKey}`
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log("unsplashImageData", data);
        setFlashcardInfo(prevData => ({
          ...prevData,
          image: data.results[0]?.urls?.full || ''
        }));
        console.log("image", flashcardInfo.image);
        setImageReady(true);

      })
      .catch(error => {
        console.log("unsplashImageError", error);
      });
  };

  // useEffect(() => {
  //   // Perform API calls and fetch data
  //   const delay = setTimeout(() => {
  //     setInfoReady(true); // Assuming you're setting this state to render the content
  //   }, 1000); // Adjust the delay time (in milliseconds) as needed

  //   return () => clearTimeout(delay);
  // }, []); 



  useEffect(() => {
    // Generate flashcard information using GPT-3 API
    if (loaded && Object.keys(languages).length > 0 && Object.keys(userData).length > 0) {
      handleNextWord();
    }
  }, [loaded]);


  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://127.0.0.1:5000/add_flashcard", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(flashcardInfo)
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log("Flashcard added successfully");
          handleNextWord();
        } else {
          console.log("Error adding flashcard");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSaveFlashcard = (e) => {
    e.preventDefault();
    setFlashcardInfo((prevData) => ({
      ...prevData,
      saved: true,
    }));
    console.log("saved", flashcardInfo);
  };

  const handleUnsaveFlashcard = (e) => {
    e.preventDefault();
    setFlashcardInfo((prevData) => ({
      ...prevData,
      saved: false,
    }));
    console.log("unsaved", flashcardInfo);
  }

  const handleLike = () => {
    setLiked(!liked);
  };

  // const handleAudio = () => {
  //   const apiKey = "J9pirXwN8FatHGKoJ73XS5RffB1gMieu5CR7xJ58";

  //   fetch("https://127.0.0.1:5000/api/narakeet/text-to-speech/mp3", {  // Use the appropriate endpoint for your use case
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       "x-api-key": apiKey  // Use the correct header for API key
  //     },
  //     body: JSON.stringify({
  //       text: flashcardInfo.word,
  //       lang: languages.language
  //     })
  //   })
  //     .then(response => response.json())
  //     .then(data => {
  //       console.log("Audio Data", data);

  //     })
  //     .catch(error => {
  //       console.error("Audio Error:", error);
  //     });
  // };

  return (
    <div className="container mt-3">
      <Link to={`/dashboard/${sessionId}`} className="btn btn-primary mb-3"> Back to Dashboard </Link>
      <div>
        <h2>{languages.language} Flashcard</h2>
      </div>
      <div className="text-center" style={{ maxWidth: "400px", margin: "0 auto" }}>
        {apiloaded && imageReady && infoReady ? (
          <div className="wrapper">
            <div className="flip-card">
              <div
                className={`like-button ${liked || flashcardInfo.saved ? 'clicked' : ''}`}
                onClick={flashcardInfo.saved ? handleUnsaveFlashcard : handleSaveFlashcard}
              >
                &#x2665; {/* Unicode for heart symbol */}
              </div>


              <div className="flip-card-inner">
                <div className="flip-card-front" style={{ backgroundImage: `url(${background})` }}>
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

                <div className="flip-card-back">
                  {flashcardInfo.image ? (
                    <img src={flashcardInfo.image} className="squareImage" alt={flashcardInfo.translation} />
                  ) : (
                    // Alternative content if flashcardInfo.image is empty or null
                    <img src={imageComingSoon} className="squareImage" alt={flashcardInfo.translation} />
                  )}                
                </div>
              </div>
            </div>
            <div className="form-section">
              <form className="mt-4" onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "0 auto" }}>
                <input type="hidden" name="sessionId" value={sessionId} />
                <input type="hidden" name="word" value={flashcardInfo.word} />
                <input type="hidden" name="translation" value={flashcardInfo.translation} />
                <input type="hidden" name="pronunciation" value={flashcardInfo.pronunciation} />
                <input type="hidden" name="definition" value={flashcardInfo.definition} />
                <input type="hidden" name="image" value={flashcardInfo.image} />
                <div className="d-flex justify-content-center mt-3">
                  <button type="submit" className="btn btn-dark">Next Flashcard</button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="card-header">
            <h4>Loading...</h4>
            <form className="mt-4" onSubmit={handleNextWord} style={{ maxWidth: "400px", margin: "0 auto" }}>
              <div className="d-flex justify-content-center mt-3">
                <button type="submit" className="btn btn-dark">Meowments of Impatience</button>
              </div>
            </form>
          </div>
        )}
      </div>


    </div>
  );
};

export default Flashcard;

{/* <button
            className="btn rounded-circle p-0"
            style={{
              width: "40px",
              height: "40px",
              lineHeight: 0,
              fontSize: "24px",
            }}
            onClick={handleAudio}
          >
            <span role="img" aria-label="Play">
              🗣️
            </span>
          </button> */}