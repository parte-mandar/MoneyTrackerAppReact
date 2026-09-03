import { useState } from 'react'
import { FiChevronRight } from 'react-icons/fi'
import Categories from './Categories'
import './Settings.css'

const PRESET_COLORS = [
  '#2563eb', // blue
  '#7c3aed', // violet
  '#059669', // green
  '#dc2626', // red
  '#d97706', // amber
  '#0891b2', // cyan
]

function Settings({
  darkMode,
  onDarkModeChange,
  accentColor,
  onAccentColorChange,
}) {
  const [isCategoriesOpen, setCategoriesOpen] = useState(false)

  return (
    <div className="settings-panel">
      <h3 className="settings-section-title">General settings</h3>
      <div className="settings-section">
        <div className="settings-row">
          <span className="settings-row-label">Dark mode</span>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={(e) => onDarkModeChange(e.target.checked)}
              aria-label="Toggle dark mode"
            />
            <span className="toggle-switch-track"></span>
          </label>
        </div>
        <div className="settings-row">
          <span className="settings-row-label">Theme</span>
          <div className="theme-picker">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                className={`theme-swatch${accentColor === color ? ' active' : ''}`}
                style={{ backgroundColor: color }}
                aria-label={`Set brand color to ${color}`}
                onClick={() => onAccentColorChange(color)}
              />
            ))}
            <span className="theme-picker-divider" aria-hidden="true">
              |
            </span>
            <input
              type="color"
              className="theme-swatch-custom"
              value={accentColor || '#2563eb'}
              onChange={(e) => onAccentColorChange(e.target.value)}
              aria-label="Pick a custom brand color"
            />
          </div>
        </div>
      </div>

      <h3 className="settings-section-title">Data</h3>
      <div className="settings-section">
        <button
          type="button"
          className="settings-row settings-row-button"
          onClick={() => setCategoriesOpen(true)}
        >
          <span className="settings-row-label">Categories</span>
          <FiChevronRight className="settings-row-chevron" aria-hidden="true" />
        </button>
      </div>

      {isCategoriesOpen && (
        <Categories onClose={() => setCategoriesOpen(false)} />
      )}
    </div>
  )
}

export default Settings
