import React, { useState, useEffect } from 'react';
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/Login.jsx";
import  Navbar  from "./components/Navbar.jsx";
import  About  from "./screens/About.jsx";
import  Home  from "./screens/Home.jsx";
import  Search  from "./screens/Search.jsx";
import Product from "./screens/Product.jsx";

function App() {
  const [login, setLogin] = useState(false);
useEffect(() => {
  console.log("Login status: ", login);
}, [login]);
  return (
    <div className="App">
      <Navbar login={() => setLogin(true)} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/search" element={<Search />} />
      </Routes>
      {login && (
          <div className="overlay">
            <Login onClose={() => setLogin(false)} onRegister={() => setRegister(true) && setLogin(false)} />
          </div>
        )}
    </div>
  );
}

export default App;