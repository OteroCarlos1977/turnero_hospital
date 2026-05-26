import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Tarjeta } from './componentes/Tarjeta/Tarjeta.jsx';
import { Formulario } from './componentes/Formulario/Formulario.jsx';
import { Selector } from './componentes/Selector/Selector.jsx';
import { Principal } from './componentes/Principal/Principal.jsx';
import { Turnos } from './componentes/Turnos/Turnos.jsx';
import { Navbar } from './componentes/Navbar/Navbar.jsx';
import { Confirmacion } from './componentes/Confirmacion/Confirmacion.jsx';
import { Administrador } from './componentes/Administrador/Administrador.jsx';
import { PrivateRoute } from './componentes/PrivateRoute/PrivateRoute.jsx';
import { Carga } from './componentes/Carga/Carga.jsx';
import { Vista } from './componentes/Vista/Vista.jsx';
import { Editar } from './componentes/Editar/Editar.jsx';
import { VistaTurnos } from './componentes/Vista/VistaTurnos.jsx';
import { Login } from './componentes/Login/Login.jsx';
import './App.css';
import './componentes/Modal/Modal.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLoginSuccess = (token) => {
    setIsLoggedIn(true);
    localStorage.setItem('authToken', token);
  };

  const handleLogoutClick = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('authToken');
  };

  return (
    <Router>
      <Navbar 
        isLoggedIn={isLoggedIn} 
        onLogoutClick={handleLogoutClick}  
      />
      <div className='containerPrincipal'>
        <Routes>
          <Route path="/" element={<Principal />} />
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/selector" element={<Selector />} />
          <Route path="/tarjeta" element={<Tarjeta />} />
          <Route path="/formulario" element={<Formulario />} />
          <Route path="/confirmacion" element={<Confirmacion />} />
          <Route path="/turno" element={<Turnos />} /> 
          <Route path="/administrar" element={<PrivateRoute isLoggedIn={isLoggedIn}><Administrador /></PrivateRoute>}/>
          <Route path="/carga" element={<Carga />} />
          <Route path="/vista" element={<Vista />} />
          <Route path="/editar" element={<Editar />} />
          <Route path="/vista-turnos" element={<VistaTurnos />} />
        </Routes>
      </div>
      <footer className="developerFooter" aria-label="Marca de desarrollo">
        <span className="developerFooterLogo">CO</span>
        <span>Desarrollado por Carlos Otero</span>
      </footer>
    </Router>
  );
}

export default App;
