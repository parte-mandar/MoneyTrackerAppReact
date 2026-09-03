import { FiPlus } from 'react-icons/fi'
import './FloatingActionButton.css'

function FloatingActionButton({ onClick }) {
  return (
    <button
      type="button"
      className="fab"
      onClick={onClick}
      aria-label="Add transaction"
    >
      <FiPlus className="fab-icon" aria-hidden="true" />
    </button>
  )
}

export default FloatingActionButton
