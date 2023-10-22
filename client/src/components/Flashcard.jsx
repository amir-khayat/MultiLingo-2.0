import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const Flashcard = (props) => {
  const { sessionId } = props;
  const { languageId } = useParams();

  const [languages, setLanguages] = useState({});
  const [flashcardInfo, setFlashcardInfo] = useState({});
  const [userData, setUserData] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [apiloaded, setApiLoaded] = useState(false);
  const [englishWord, setEnglishWord] = useState('');

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

  const handleNextWord = () => {
    const prompt = `Generate a WORD with ${languages.intensity} intensity level in the ${languages.language} language. Provide its TRANSLATION in ${userData.user_language}, DEFINITION in ${userData.user_language}, and provide a plain text PRONUNCIATION of the given ${languages.language} WORD, written in ${userData.user_language} text. Give me the answer in JSON format with its keys and values in the following format:
      {
        "word": "",
        "translation": "",
        "definition": "",
        "image": "", // leave this blank
        "audio": "", // leave this blank
        "pronunciation": ""
        translated_word_in_english: ""
      }
      NOTE: MAKE SURE THE PRONUNCIATION IS NOT OF THE ${userData.user_language} TRANSLATION BUT OF THE ${languages.language} GIVEN WORD. ALSO, MAKE SURE TO FOLLOW EXACTLY WHAT I SAID.
      Japanese to Arabic EXAMPLE: {word: '耐性', translation: 'المرونة', definition: 'القدرة على التعامل مع الصعاب والتحمل والتعافي منها', image: '', pronunciation: 'رِزِلْيَنْسْ', translated_word_in_english: "resilience"}
      `;

    console.log("prompt", prompt);


    const apiKey = "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";

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
        console.log(messageContent);
        const newFlashcardInfo = {
          ...flashcardInfo,
          word: messageContent.word,
          pronunciation: messageContent.pronunciation,
          translation: messageContent.translation,
          definition: messageContent.definition,
          image: messageContent.image,
          saved: true,
          user_id: sessionId,
          language_id: languageId
        };

        const newEnglishWord = messageContent.translated_word_in_english;

        setFlashcardInfo(newFlashcardInfo);
        setEnglishWord(newEnglishWord);
        handleImage(newEnglishWord);
        setApiLoaded(true);
        // handleAudio();
      })
      .catch(error => {
        console.log("aierror", error);
      });
  };

  const handleImage = (prompt) => {
    const unsplashApiKey = "FhTpHf61Ihdv4CagqxYjJVAjod7Heqi3_9Otgzi5nNM"; // Replace with your actual Unsplash API key
    console.log("prompt", prompt);
    const imageSize = 300;
    fetch(`https://api.unsplash.com/search/photos?query= ${prompt}&w=${imageSize}&h=${imageSize} `, {
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
          image: data.results[0].urls.full
        }));
      })
      .catch(error => {
        console.log("unsplashImageError", error);
      });
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

  return (
    <div className="container mt-3">
      <Link to={`/dashboard/${sessionId}`} className="btn btn-primary mb-3"> Back to Dashboard </Link>
      <div className="card text-center" style={{ maxWidth: "400px", margin: "0 auto" }}>
        {apiloaded ? (
          <div>
            <div className="card-header">
              {languages.language} Flashcard
            </div>
            <div className="card-body d-flex align-items-center justify-content-evenly">
              <h1 className="card-title mb-0">Word:</h1>
              <h1 className="card-title mb-0">{flashcardInfo.word}</h1>
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
            </div>

            <div className="card-text">
              <p>Pronunciation: {flashcardInfo.pronunciation}</p>
              <p>Translation: {flashcardInfo.translation}</p>
              <p>Definition: {flashcardInfo.definition}</p>
            </div>
            <img src={flashcardInfo.image} className="card-img-bottom" style={{ width: "100%", height: "auto" }} alt="Flashcard" />
          </div>
        ) : (
          <div className="card-header">
            Loading...
          </div>
        )}
      </div>


      <form className="mt-4" onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "0 auto" }}>
        <input type="hidden" name="sessionId" value={sessionId} />
        <input type="hidden" name="word" value={flashcardInfo.word} />
        <input type="hidden" name="translation" value={flashcardInfo.translation} />
        <input type="hidden" name="pronunciation" value={flashcardInfo.pronunciation} />
        <input type="hidden" name="definition" value={flashcardInfo.definition} />
        <input type="hidden" name="image" value={flashcardInfo.image} />
        <p>Do you want to collect this flashcard?</p>
        <div className="btn-group btn-group-toggle d-flex justify-content-center" role="group" aria-label="Save Flashcard">
          <label
            className={`btn btn-outline-success ${flashcardInfo.saved === true ? 'active' : ''}`}
            onClick={handleSaveFlashcard}
          >
            Collect
          </label>

          <label
            className={`btn btn-outline-warning ${flashcardInfo.saved === false ? 'active' : ''}`}
            onClick={handleUnsaveFlashcard}
          >
            No Thanks
          </label>
        </div>
        <div className="d-flex justify-content-center mt-3">
          <button type="submit" className="btn btn-dark">Next Flashcard</button>
        </div>
      </form>
    </div>
  );
};

export default Flashcard;

