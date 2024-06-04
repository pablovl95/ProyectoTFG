import React, { useState, useEffect } from 'react';
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Navbar from "./components/navbar";
import About from "./screens/About";
import Home from "./screens/Home";
import Search from "./screens/Search";
import Security from "./screens/Security";
import Product from "./screens/Product";
import Footer from "./components/Footer";
import Shop from "./screens/Shop";
import Cart from "./screens/Cart";
import Profile from "./screens/Profile";
import Orders from "./screens/Orders";
import Addresses from "./screens/Adresses";
import Dashboard from "./screens/Dashboard";
import Delivery from "./screens/Delivery";
import Payment from "./screens/Payment";
import Workwithus from "./screens/Workwithus";
import Contactus from "./screens/Contactus";

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
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      //console.log(user);
      if (user) {
        try {
          await fetch(`${backendUrl}/api/v1/users/${user.uid}`)
            .then((response) => response.json())
            .then((data) => {
              setUserData(data[0]);
            });
        } catch (error) {
          if (userData === undefined || userData === null) {
            console.log("no hay datos");
            try {
              const body = {
                FirstName: user.displayName ? user.displayName?.split(' ')[0] : "NULL",
                LastName: user.displayName ? user.displayName?.split(' ')[1] : "NULL" + (user.displayName ? user.displayName?.split(' ')[2] : ''),
                Email: user ? user.email : "NULL",
                UserID: user ? user.uid : "NULL",
                Phone: user.phoneNumber || 'NULL',
              };
              await fetch(`${backendUrl}/api/v1/users`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
              });
              setUserData(body);
            } catch (error) {
              console.error('Error during Google login:', error);
            }
          }
        }
      }
    });

    return () => unsubscribe(); // Se asegura de desuscribirse cuando se desmonta el componente
  }, [backendUrl, user]);

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
            <Route path="/profile/payment" element={<Payment />} />
            <Route path="/profile/security" element={<Security userData={userData} />} />
            <Route path="/profile/workwithus" element={<Workwithus userData={userData} />} />
            <Route path="/profile/contact" element={<Contactus userData={userData} />} />
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
          <Login onClose={() => setLoginView(false)} setUser={(user) => setUser(user)} />
        </div>
      )}
    </div>
  );
}

export default App;
