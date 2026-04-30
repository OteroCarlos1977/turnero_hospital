// eslint-disable-next-line no-unused-vars
import React from 'react';
import { faSignInAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { Button} from '../Button/Button';
import "./Navbar.css";


// eslint-disable-next-line react/prop-types
export function Navbar({ isLoggedIn, onLogoutClick }) {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    if (isLoggedIn) {
      onLogoutClick(); // Ejecuta la función de logout
      navigate('/');   // Redirige al usuario a la página principal
    } else {
      navigate('/login'); // Redirige al usuario a la página de login
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => navigate('/')}>
        <img src="/logo_Cast.png" alt="Hospital Municipal" className="navbar-logo" />
        <div>
          <span className="navbar-kicker">Hospital Municipal</span>
          <h2>Turnero Médico</h2>
        </div>
      </div>
      <Button
      tooltip={isLoggedIn ? "Salir" : "Ingresar"}
      icono={isLoggedIn ? faSignOutAlt : faSignInAlt}
      onClick={handleButtonClick}
      />
    </nav>
  );
}

