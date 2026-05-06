import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function Button ({ texto, onClick, icono, tooltip, type = 'button', className = '' }) {
  return ( 
      <button type={type} className={`btn ${className}`.trim()} onClick={onClick} data-tooltip={tooltip}>
      {icono && <FontAwesomeIcon icon={icono} />} 
      {texto && <span>{texto}</span>}
      </button>
  ) 
}



