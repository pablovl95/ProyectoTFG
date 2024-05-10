// Login.js
import React, { useState } from 'react';
import './css/login.css';

function Login({ onClose }) {
  const [isLogin, setIsLogin] = useState(true); // Estado para controlar si está en modo de login o registro

  const switchMode = () => {
    setIsLogin(!isLogin); // Cambia entre login y registro
  };

  return (
    <div className="login-container">
      <div className="close-div" onClick={onClose}>
        X
      </div>
      <h2>{isLogin ? "Login" : "Registro"}</h2>
      <div className="switch">
        <div className={isLogin ? "buttonSwitchOn" : "buttonSwitchOff"} onClick={isLogin ? null : switchMode}>
          Ya soy cliente
        </div>
        <div className={isLogin ? "buttonSwitchOff" : "buttonSwitchOn"} onClick={isLogin ? switchMode : null}>
          Soy nuevo
        </div>
      </div>
      <form>
        <div className="form-group">
          <input type="text" id="username" name="username" />
        </div>
        <div className="form-group">
          <input type="password" id="password" name="password" />
        </div>
        {!isLogin && ( 
          <div className="form-group">
            <label htmlFor="confirm-password">Confirm Password:</label>
            <input type="password" id="confirm-password" name="confirm-password" />
          </div>
        )}
        <div className="forgot-password">
          <a href="#">¿Has olvidado la contraseña? Recupéralo aquí</a>
        </div>
        <button type="submit">{isLogin ? "Login" : "Registrarse"}</button>
      </form>
      <div className="social-login">
        <div className="google-login-div">Acceso con Google</div>
        <div className="facebook-login-div">Acceso con Facebook</div>
      </div>
    </div>
  );
}

export default Login;
