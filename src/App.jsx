import { useEffect, useState } from 'react'
import TopBar from './components/TopBar'
import TabBar from './components/TabBar'
import Money from './components/Money'
import Calendar from './components/Calendar'
import Settings from './components/Settings'
import FloatingActionButton from './components/FloatingActionButton'
import AddTransaction from './components/AddTransaction'
import { hexToRgba } from './utils/color'
import './App.css'

const THEME_STORAGE_KEY = 'theme'
const ACCENT_STORAGE_KEY = 'accentColor'

function App() {
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('money')
  const [isAddTransactionOpen, setAddTransactionOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem(THEME_STORAGE_KEY) !== 'light',
  )
  const [accentColor, setAccentColor] = useState(
    () => localStorage.getItem(ACCENT_STORAGE_KEY) || '',
  )

  useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      darkMode ? 'dark' : 'light',
    )
    localStorage.setItem(THEME_STORAGE_KEY, darkMode ? 'dark' : 'light')
  }, [darkMode])

  useEffect(() => {
    const root = document.documentElement.style
    if (accentColor) {
      root.setProperty('--accent', accentColor)
      root.setProperty('--accent-bg', hexToRgba(accentColor, 0.1))
      root.setProperty('--accent-border', hexToRgba(accentColor, 0.5))
      localStorage.setItem(ACCENT_STORAGE_KEY, accentColor)
    } else {
      root.removeProperty('--accent')
      root.removeProperty('--accent-bg')
      root.removeProperty('--accent-border')
      localStorage.removeItem(ACCENT_STORAGE_KEY)
    }
  }, [accentColor])

  return (
    <div className="app-shell">
      <div className="app-header">
        <TopBar value={search} onChange={setSearch} />
        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
      <div className="app-content">
        {activeTab === 'money' && <Money search={search} />}
        {activeTab === 'calendar' && <Calendar />}
        {activeTab === 'settings' && (
          <Settings
            darkMode={darkMode}
            onDarkModeChange={setDarkMode}
            accentColor={accentColor}
            onAccentColorChange={setAccentColor}
          />
        )}
      </div>
      <FloatingActionButton onClick={() => setAddTransactionOpen(true)} />
      {isAddTransactionOpen && (
        <AddTransaction onClose={() => setAddTransactionOpen(false)} />
      )}
    </div>
  )
}

export default App
