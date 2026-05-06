import '../../App.css';

export function Aviso({ message, buttonText, onButtonClick }) {
  return (
    <div className="message-card">
      <p>{message}</p>
      <button onClick={onButtonClick} className="message-card-button">
        {buttonText}
      </button>
    </div>
  );
}
