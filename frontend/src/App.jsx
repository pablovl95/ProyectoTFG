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
import Shop from "./screens/Shop";
import Cart from "./screens/Cart";
import { auth } from "./auth";

function App() {
  const [loginView, setLoginView] = useState(false);
  const [register, setRegister] = useState(false);
  const [product, setProduct] = useState({});
  const [user, setUser] = useState(null);
  useEffect(() => {
    // Verifica si el usuario está autenticado al cargar la aplicación
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user); // Actualiza el estado del usuario
    });

    return () => unsubscribe(); // Se asegura de desuscribirse cuando se desmonta el componente
  }, []);
  return (
    <div className="App">
      <Navbar loginView={() => setLoginView(true)} user={user} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/product/:id" element={<Product poduct={product}/>} />
        <Route path="/search" element={<Search/>} />
        <Route path="/shop/:id" element={<Shop/>} />
        <Route path="/cart" element={<Cart/>} />
      </Routes>
      <Footer/>
      {loginView && !user &&(
          <div className="overlay">
            <Login onClose={() => setLoginView(false)} onRegister={() => setRegister(true) && setLoginView(false)} />
          </div>
        )}
    </div>
  );
}

export default App;