import React, { useState } from 'react';
import './css/login.css';
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../auth';
import { IconX } from '@tabler/icons-react';

function Login({ onClose, setUser, setNotification }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [FirstName, setFirstName] = useState('');
  const [LastName, setLastName] = useState('');
  const [Telephone, setTelephone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const backendUrl = process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000'
    : process.env.REACT_APP_BACKEND_URL;

  const switchMode = () => {
    setIsLogin(!isLogin);
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userSnapshot = await fetch(`${backendUrl}/api/v1/users/${user.uid}`);
      const userData = await userSnapshot.json();
      if (userData.length === 0) {
        await fetch(`${backendUrl}/api/v1/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            FirstName: user.displayName.split(' ')[0],
            LastName: user.displayName.split(' ')[1],
            Email: user.email,
            UserID: user.uid,
            Phone: user.phoneNumber || 'NULL',
          }),
        });
      }
      setNotification({ type: 'success', message: 'Has iniciado sesión correctamente' });
    } catch (error) {
      setNotification({ type: 'error', message: 'Error durante el inicio de sesión con Google' });
      console.error('Error durante el inicio de sesión con Google:', error);
    }
  };

  const handleEmailLogin = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      setUser(user);
      setNotification({ type: 'success', message: 'Has iniciado sesión correctamente' });
    } catch (error) {
      setNotification({ type: 'error', message: 'Error durante el inicio de sesión con correo electrónico' });
      console.error('Error durante el inicio de sesión con correo electrónico:', error);
    }
  };

  const handleEmailRegister = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setNotification({ type: 'error', message: '¡Las contraseñas no coinciden!' });
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await fetch(`${backendUrl}/api/v1/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          FirstName,
          LastName,
          Email: email,
          UserID: user.uid,
          Phone: Telephone,
        }),
      });
      setUser(user);
      setNotification({ type: 'success', message: 'Te has registrado correctamente' });
    } catch (error) {
      setNotification({ type: 'error', message: 'Error durante el registro con correo electrónico' });
      console.error('Error durante el registro con correo electrónico:', error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-container-i">

        <div className="login-close-div" onClick={onClose}>
          X
        </div>
        <div className="login-close-div-mobile" onClick={onClose}>
          <IconX />
        </div>
        <h2 className='login-h2'>{isLogin ? 'Login' : 'Registro'}</h2>

        <div className="login-switch">
          <div className={isLogin ? 'login-buttonSwitchOn' : 'login-buttonSwitchOff'} onClick={isLogin ? null : switchMode}>
            Ya soy cliente
          </div>
          <div className={isLogin ? 'login-buttonSwitchOff' : 'login-buttonSwitchOn'} onClick={isLogin ? switchMode : null}>
            Soy nuevo
          </div>
        </div>

        <form onSubmit={isLogin ? handleEmailLogin : handleEmailRegister}>
          <div className="login-form-group">
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="login-form-group">
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {!isLogin && (
            <>
              <div className="login-form-group">
                <input
                  type="password"
                  id="confirm-password"
                  name="confirm-password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <div className="login-form-group">
                <input
                  type="FirstName"
                  id="FirstName"
                  name="FirstName"
                  placeholder="FirstName"
                  value={FirstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="login-form-group">
                <input
                  type="LastName"
                  id="LastName"
                  name="LastName"
                  placeholder="LastName"
                  value={LastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div className="login-form-group">
                <input
                  type="Telephone"
                  id="Telephone"
                  name="Telephone"
                  placeholder="Telephone Number"
                  value={Telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                />
              </div>
            </>
          )}
          <div className="login-forgot-password">
            <a href="#">¿Has olvidado la contraseña? Recupéralo aquí</a>
          </div>
          <button type="submit" className="login-button">{isLogin ? 'Login' : 'Registrarse'}</button>
        </form>
        <div className="login-social-login">
          <div className="login-google-login-div" onClick={handleGoogleLogin}>
            Acceso con Google
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
