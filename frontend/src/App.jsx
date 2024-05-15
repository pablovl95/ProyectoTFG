import React, { useState, useEffect } from 'react';
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Navbar from "./components/navbar";
import About from "./screens/About";
import Home from "./screens/Home";
import Search from "./screens/Search";
import Product from "./screens/Product";
import Footer from "./components/Footer";
import Shop from "./screens/Shop";
import Cart from "./screens/Cart";
import Profile from "./screens/Profile";
import Orders from "./screens/Orders";
import Adresses from "./screens/Adresses";
import Dashboard from "./screens/Dashboard";
import Delivery from "./screens/Delivery";
import { auth } from "./auth";

function App() {
  const [loginView, setLoginView] = useState(false);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const backendUrl = process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000'
    : process.env.REACT_APP_BACKEND_URL;


  useEffect(() => {
    // Verifica si el usuario está autenticado al cargar la aplicación
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        fetch(`${backendUrl}/api/v1/users/${user.uid}`)
          .then((response) => response.json())
          .then((data) => {
            setUserData(data[0]);
            //console.log(data[0]);
          });
      }
    });

    return () => unsubscribe(); // Se asegura de desuscribirse cuando se desmonta el componente
  }, []);
  return (
    <div className="App">
      <Navbar loginView={() => setLoginView(true)} user={userData} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/search" element={<Search />} />
        <Route path="/shop/:id" element={<Shop />} />
        <Route path="/cart" element={<Cart />} />
        {userData && (
          <>
            <Route path="/profile" element={<Profile />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/adresses" element={<Adresses />} />
          </>
        )}
        {userData?.UserType === 'administrator' && (
            <Route path="/dashboard" element={<Dashboard />} />
          )}
          {userData?.userType === 'delivery' && (
            <Route path="/delivery" element={<Delivery />} />
          )}

      </Routes>
      <Footer />
      {loginView && !user && (
        <div className="overlay">
          <Login onClose={() => setLoginView(false)} />
        </div>
      )}
    </div>
  );
}

export default App;