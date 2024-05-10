import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './screens/Home';
import Login from './components/Login';
import Navbar from './components/navbar';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [login, setLogin] = useState(false);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("sdd");
    console.log("Usuario encontrado:", loggedInUser);
    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, []);

  return (
    <Router>
      <div className="App">
          <Navbar login={() => setLogin(true)} register={() => setRegister(true)} />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
        {login && (
          <div className="overlay">
            <Login onClose={() => setLogin(false)} onRegister={()=>setRegister(true) && setLogin(false)  } />
            </div> 
        )}
      </div>
    </Router>
  );
}

export default App;
