import {
  FiDollarSign,
  FiCalendar,
  FiBarChart2,
  FiSettings,
} from 'react-icons/fi'
import { BsWallet2 } from 'react-icons/bs'
import './TabBar.css'

const TABS = [
  { id: 'money', label: 'Money', Icon: FiDollarSign },
  { id: 'accounts', label: 'Accounts', Icon: BsWallet2 },
  { id: 'calendar', label: 'Calendar', Icon: FiCalendar },
  { id: 'statistics', label: 'Statistics', Icon: FiBarChart2 },
  { id: 'settings', label: 'Settings', Icon: FiSettings },
]

function TabBar({ activeTab, onTabChange }) {
  return (
    <div className="tab-bar" role="tablist">
      {TABS.map(({ id, label, Icon }) => (
        <button
          key={id}
          type="button"
          role="tab"
          aria-selected={activeTab === id}
          aria-label={label}
          className={`tab-item${activeTab === id ? ' active' : ''}`}
          onClick={() => onTabChange(id)}
        >
          <Icon className="tab-icon" aria-hidden="true" />
        </button>
      ))}
    </div>
  )
}

export default TabBar
