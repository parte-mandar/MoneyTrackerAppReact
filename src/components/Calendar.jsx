import { useHostData } from '../hooks/useHostData'
import './Calendar.css'

function Calendar() {
  const {
    data: accounts,
    status,
    error,
  } = useHostData('accounts-request', 'accounts-response', 'accounts')

  return (
    <div className="calendar-panel">
      <h3 className="calendar-section-title">Accounts</h3>
      {status === 'loading' && (
        <p className="calendar-hint">Loading accounts…</p>
      )}
      {status === 'error' && <p className="calendar-error">{error}</p>}
      {status === 'success' && accounts.length === 0 && (
        <p className="calendar-hint">
          No accounts returned. The Guest User may not have Read access to
          Account records.
        </p>
      )}
      {status === 'success' && accounts.length > 0 && (
        <ul className="account-list">
          {accounts.map((account) => (
            <li key={account.Id} className="account-item">
              {account.Name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Calendar
