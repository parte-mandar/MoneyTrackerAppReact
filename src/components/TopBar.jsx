import { FiSearch } from 'react-icons/fi'
import './TopBar.css'

function TopBar({ value, onChange }) {
  return (
    <div className="top-bar">
      <FiSearch className="top-bar-icon" aria-hidden="true" />
      <input
        type="search"
        className="top-bar-input"
        placeholder="Search..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search"
      />
    </div>
  )
}

export default TopBar
