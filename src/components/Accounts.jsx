import { useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'
import { useHostData } from '../hooks/useHostData'
import './Accounts.css'

// maps a Salesforce Payment_Account__c record to the shape this view renders
function mapAccount(account) {
  return {
    id: account.Id,
    name: account.Name,
    type: account.Payment_Account_Type__c || '',
    balance: account.Payment_Account_Balance__c ?? 0,
  }
}

function formatBalance(balance) {
  const sign = balance < 0 ? '-' : ''
  return `${sign}\u20B9${Math.abs(balance).toFixed(2)}`
}

function pluralize(label) {
  return label.endsWith('s') ? label : `${label}s`
}

// groups accounts by their type, preserving first-seen order
function groupByType(accounts) {
  const groups = []
  const groupByKey = new Map()

  accounts.forEach((account) => {
    const key = account.type || 'Other'
    let group = groupByKey.get(key)
    if (!group) {
      group = { key, title: pluralize(key), items: [] }
      groupByKey.set(key, group)
      groups.push(group)
    }
    group.items.push(account)
  })

  return groups
}

function Accounts() {
  const {
    data: paymentAccounts,
    status,
    error,
  } = useHostData(
    'payment-accounts-request',
    'payment-accounts-response',
    'paymentAccounts',
  )
  const [collapsedGroups, setCollapsedGroups] = useState(new Set())

  const accounts = paymentAccounts.map(mapAccount)
  const groups = groupByType(accounts)

  function toggleGroup(key) {
    setCollapsedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  return (
    <div className="accounts-panel">
      {status === 'loading' && (
        <p className="accounts-hint">Loading accounts…</p>
      )}
      {status === 'error' && <p className="accounts-error">{error}</p>}
      {status === 'success' && accounts.length === 0 && (
        <p className="accounts-hint">
          No accounts returned. The Guest User may not have Read access to
          Payment Account records.
        </p>
      )}
      {status === 'success' &&
        groups.map(({ key, title, items }) => {
          const isCollapsed = collapsedGroups.has(key)
          return (
            <div key={key} className="accounts-group">
              <button
                type="button"
                className="accounts-group-header"
                onClick={() => toggleGroup(key)}
                aria-expanded={!isCollapsed}
              >
                <span className="accounts-group-title">{title}</span>
                <FiChevronDown
                  className={`accounts-group-chevron${isCollapsed ? ' collapsed' : ''}`}
                  aria-hidden="true"
                />
              </button>
              {!isCollapsed && (
                <div className="accounts-list">
                  {items.map(({ id, name, balance }) => (
                    <div key={id} className="account-card">
                      <div className="account-card-left">
                        <div className="account-card-name">{name}</div>
                      </div>
                      <div
                        className={`account-card-balance${balance < 0 ? ' negative' : ''}`}
                      >
                        {formatBalance(balance)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
    </div>
  )
}

export default Accounts
