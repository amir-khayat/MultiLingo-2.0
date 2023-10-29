import './App.css';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Registration from './components/Registration';
import Login from './components/Login';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import AddLanguage from './components/AddLanguage';
import SavedFlashCards from './components/SavedFlashCards';
import Flashcard from './components/Flashcard';
import { Route, Routes } from 'react-router-dom';
import EditProfile from './components/EditProfile';
import CheckSavedFlashCard from './components/CheckSavedFlashCard';
// import background from './images/background.JPG';


function App() {

  const [sessionId, setSessionId] = useState(Cookies.get("sessionId") || "");

  useEffect(() => {
    console.log("sessionId changed:", sessionId);
    Cookies.set("sessionId", sessionId);
  }, [sessionId]);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/dashboard/:id' element={<Dashboard sessionId={sessionId} setSessionId={setSessionId} />} />
        <Route path="/profile/:id" element={<Profile sessionId={sessionId} />} />
        <Route path="/addlanguage/:id" element={<AddLanguage sessionId={sessionId} />} />
        <Route path="/flashcard/:languageId" element={<Flashcard sessionId={sessionId} />} />
        <Route path="/savedflashcards/:languageId" element={<SavedFlashCards sessionId={sessionId} />} />
        <Route path="/editprofile/:id" element={<EditProfile sessionId={sessionId} />} />
        <Route path="/register" element={<Registration setSessionId={setSessionId} />} />
        <Route path="/login" element={<Login setSessionId={setSessionId} />} />
        <Route path="/checksavedflashcard/:wordId/:languageId" element={<CheckSavedFlashCard setSessionId={sessionId} />} />
      </Routes>
      
    </div>
  );
}

export default App;