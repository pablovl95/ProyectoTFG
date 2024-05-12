import React, { useState, useEffect } from 'react';
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import  Navbar  from "./components/navbar";
import  About  from "./screens/About";
import  Home  from "./screens/Home";
import  Search  from "./screens/Search";
import Product from "./screens/Product";
import Footer from "./components/Footer";
function App() {
  const [login, setLogin] = useState(false);
  const [register, setRegister] = useState(false);
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
      <Footer/>
      {login && (
          <div className="overlay">
            <Login onClose={() => setLogin(false)} onRegister={() => setRegister(true) && setLogin(false)} />
          </div>
        )}
    </div>
  );
}

export default App;