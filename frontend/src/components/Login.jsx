// Login.js
import React, { useState } from 'react';
import './css/login.css';
import { signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../auth';

function Login({ onClose }) {
  const [isLogin, setIsLogin] = useState(true); // Estado para controlar si está en modo de login o registro
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const switchMode = () => {
    setIsLogin(!isLogin); // Cambia entre login y registro
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const displayName = user.displayName;
      let firstName = '';
      let lastName = '';

      if (displayName) {
        const nameParts = displayName.split(' ');
        firstName = nameParts[0];
        lastName = nameParts.slice(1).join(' ');
      }

      const userData = {
        FirstName: firstName,
        LastName: lastName,
        Email: user.email,
        Telephone: user?.phoneNumber,
        ProfileImageUrl: user.photoURL,
        UserType: 'consumer',
        AccountStatus: 'active'
      };
      console.log('User:', userData);
      
      onClose();
    } catch (error) {
      console.error('Error during Google login:', error);
    }
  };

  const handleFacebookLogin = async () => {
    const provider = new FacebookAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = FacebookAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      console.log('User:', user);
    } catch (error) {
      console.error('Error during Facebook login:', error);
    }
  };

  const handleEmailLogin = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User:', user);
    } catch (error) {
      console.error('Error during email login:', error);
    }
  };

  const handleEmailRegister = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      console.error('Passwords do not match!');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User registered:', user);
    } catch (error) {
      console.error('Error during email registration:', error);
    }
  };

  return (
    <div className="login-container">
      <div className="close-div" onClick={onClose}>
        X
      </div>
      <h2>{isLogin ? 'Login' : 'Registro'}</h2>
      <div className="switch">
        <div className={isLogin ? 'buttonSwitchOn' : 'buttonSwitchOff'} onClick={isLogin ? null : switchMode}>
          Ya soy cliente
        </div>
        <div className={isLogin ? 'buttonSwitchOff' : 'buttonSwitchOn'} onClick={isLogin ? switchMode : null}>
          Soy nuevo
        </div>
      </div>
      <form onSubmit={isLogin ? handleEmailLogin : handleEmailRegister}>
        <div className="form-group">
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
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
          <div className="form-group">
            <input
              type="password"
              id="confirm-password"
              name="confirm-password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        )}
        <div className="forgot-password">
          <a href="#">¿Has olvidado la contraseña? Recupéralo aquí</a>
        </div>
        <button type="submit">{isLogin ? 'Login' : 'Registrarse'}</button>
      </form>
      <div className="social-login">
        <div className="google-login-div" onClick={handleGoogleLogin}>
          Acceso con Google
        </div>
        <div className="facebook-login-div" onClick={handleFacebookLogin}>
          Acceso con Facebook
        </div>
      </div>
    </div>
  );
}

export default Login;
