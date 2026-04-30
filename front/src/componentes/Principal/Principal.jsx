import { Button} from '../Button/Button';
import {useNavigate} from 'react-router-dom';

import '../../App.css'
export function Principal() {
    const navigate = useNavigate();


    return (
      <section className="home-panel">
        <div className="home-copy">
          <span className="eyebrow">Turnos online</span>
          <h1>Gestioná tu atención médica de forma simple.</h1>
          <p>Reservá un turno disponible o consultá tus próximas visitas usando tu DNI.</p>
        </div>
        <div className="home-actions">
          <Button
            texto="Nuevo Turno"
            className="btn-primary btn-large"
            onClick={() => navigate('/selector')}
          />
          <Button
            texto="Ver Turno"
            className="btn-large"
            onClick={() => navigate('/turno')}
          />
        </div>
      </section>
    ) 
    
}


