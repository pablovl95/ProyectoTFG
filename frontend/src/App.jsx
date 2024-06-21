import React,{useState, useEffect} from 'react';
import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import { IconBubbleText } from '@tabler/icons-react';
import Login from "./components/Login";
import Navbar from "./components/navbar";
import About from "./screens/About";
import Home from "./screens/Home";
import Search from "./screens/Search";
import Product from "./screens/Product";
import Footer from "./components/Footer";
import Cart from "./screens/Cart";
import Profile from "./screens/Profile";
import Images from "./screens/Images";
import Workwithus from './screens/Workwithus';
import NextImplementations from './screens/NextImplementations';
import Notification from './components/Notification';

import { auth } from "./auth";

function App() {
  const [loginView, setLoginView] = useState(false);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [changer, setChanger] = useState(false);
  const [notification, setNotification] = useState(null);
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
          setNotification({ type: 'error', message: 'Error durante el inicio de sesión' });
          console.error('Error durante el inicio de sesión:', error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const changeCart = () => {
    setChanger(!changer);
  };

  useEffect(() => {
    if (notification) {
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
  }, [notification]);

  const navigate = useNavigate();

  return (
    <>
      <div className="App">
        {notification && (
          <Notification notification={notification} onClose={() => setNotification(null)} />
        )}
        <Navbar loginView={() => setLoginView(true)} user={userData} changeCart={changer} setNotification={setNotification} />
        <Routes>
          <Route path="/" element={<Home changeCart={changeCart} setNotification={setNotification}/>} />
          <Route path="/about" element={<About setNotification={setNotification}/>} />
          <Route path="/product/:id" element={<Product changeCart={changeCart} setNotification={setNotification}/>} />
          <Route path="/search" element={<Search changeCart={changeCart} setNotification={setNotification}/>} />
          <Route path="/cart" element={<Cart changeCart={changeCart} userData={userData} setNotification={setNotification}/>} />
          <Route path="/work-with-us" element={<Workwithus setNotification={setNotification}/>} />
          {userData && (
            <>
              <Route path="/profile" element={<Profile userData={userData} changeUserData={(udata) => { setUserData(udata)}} setNotification={setNotification}/>} />
              <Route path="/profile/:id/:id2" element={<Profile userData={userData} changeUserData={(udata) => setUserData(udata)} setNotification={setNotification}/>} />
              <Route path="/profile/:id" element={<Profile userData={userData} changeUserData={(udata) => setUserData(udata)} setNotification={setNotification}/>} />
            </>
          )}
          {userData?.UserType === "administrator" && (
            {/*"Proximas implementaciones"*/}
          )}
          <Route path="/images" element={<Images />} />
          <Route path="/next-implementations" element={<NextImplementations/>} />
        </Routes>
        {loginView && !user && (
          <div className="overlay">
            <Login onClose={() => setLoginView(false)} setUser={(user) => setUser(user)} setNotification={setNotification} />
          </div>
        )}
        <div className="chatbot-icon" onClick={() => navigate("/next-implementations")}>
           <IconBubbleText size={30} /> 
        </div>
      </div>
      <Footer />
    </>
  );
}

export default App;
