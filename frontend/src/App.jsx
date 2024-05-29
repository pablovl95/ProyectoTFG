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
import Addresses from "./screens/Adresses";
import Dashboard from "./screens/Dashboard";
import Delivery from "./screens/Delivery";
import { auth } from "./auth";

import Images from "./screens/Images";

function App() {
  const [loginView, setLoginView] = useState(false);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [changer, setChanger] = useState(false);
  const backendUrl = process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000'
    : process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    // Verifica si el usuario está autenticado al cargar la aplicación
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      console.log(user);
      if (user) {
        await fetch(`${backendUrl}/api/v1/users/${user.uid}`)
          .then((response) => response.json())
          .then((data) => {
            setUserData(data[0]);
            console.log("entrando", data[0]);
          });
      } if (userData === undefined) {
        console.log("no hay datos");
        await fetch(`${backendUrl}/api/v1/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            FirstName: user.displayName.split(' ')[0],
            LastName: user.displayName.split(' ')[1] + (user.displayName.split(' ')[2] || ''),
            Email: user.email,
            UserID: user.uid,
            Phone: user.phoneNumber || 'NULL',
          }),
        });
      }
    });

    return () => unsubscribe(); // Se asegura de desuscribirse cuando se desmonta el componente
  }, [backendUrl]);

  const changeCart = () => {
    setChanger(!changer);
  };

  return (
    <div className="App">
      <Navbar loginView={() => setLoginView(true)} user={userData} changeCart={changer} />
      <Routes>
        <Route path="/" element={<Home changeCart={changeCart} />} />
        <Route path="/about" element={<About />} />
        <Route path="/product/:id" element={<Product changeCart={changeCart} />} />
        <Route path="/search" element={<Search changeCart={changeCart} />} />
        <Route path="/shop/:id" element={<Shop />} />
        <Route path="/cart" element={<Cart changeCart={changeCart} />} />
        {userData && (
          <>
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/orders" element={<Orders />} />
            <Route path="/profile/addresses" element={<Addresses />} />
          </>
        )}
        {userData?.UserType === "administrator" && (
          <Route path="/dashboard" element={<Dashboard />} />
        )}
        {userData?.userType === 'delivery' && (
          <Route path="/delivery" element={<Delivery />} />
        )}
        <Route path="/images" element={<Images />} />
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
