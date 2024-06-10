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
import Dashboard from "./screens/Dashboard";
import Delivery from "./screens/Delivery";
import Images from "./screens/Images";
import Workwithus from './screens/Workwithus';

import { auth } from "./auth";


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
      if (user) {
        try {
          const data = await fetch(`${backendUrl}/api/v1/users/${user.uid}`);
          const response = await data.json();
          if (response.length > 0) {
            setUserData(response[0]);
          } else {
            const body = {
              FirstName: user.displayName ? user.displayName.split(' ')[0] : "NULL",
              LastName: user.displayName ? (user.displayName.split(' ')[1] || '') + (user.displayName.split(' ')[2] || '') : "NULL",
              Email: user.email || "NULL",
              UserID: user.uid || "NULL",
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
          }
        } catch (error) {
          console.error('Error durante el inicio de sesión:', error);
        }
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
        <Route path="/cart" element={<Cart changeCart={changeCart} userData={userData} />} />
        <Route path="/work-with-us" element={<Workwithus/>}/>
        {userData && (
          <>
            <Route path="/profile" element={<Profile userData={userData} changeUserData={(udata) =>{ setUserData(udata);console.log(udata)}}/>} />
            <Route path="/profile/:id/:id2" element={<Profile userData={userData} changeUserData={(udata) => setUserData(udata)}/>}/>
            <Route path="/profile/:id" element={<Profile userData={userData} changeUserData={(udata) => setUserData(udata)}/>}/>
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
