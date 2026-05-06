import { faSignInAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { Button} from '../Button/Button';
import "./Navbar.css";
export function Navbar({ isLoggedIn, onLogoutClick }) {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    if (isLoggedIn) {
      onLogoutClick();
      navigate('/');
    } else {
      navigate('/login');
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

