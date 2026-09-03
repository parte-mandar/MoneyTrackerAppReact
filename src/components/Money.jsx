import { useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'
import { useHostData } from '../hooks/useHostData'
import './Money.css'

// maps a Salesforce Transaction__c record to the shape this view renders
function mapTransaction(tx) {
  const rawAmount = tx.Transaction_Amount__c ?? 0
  const category = tx.Transaction_Category__c || ''
  const type =
    category.toLowerCase() === 'transfer'
      ? 'Transfer'
      : rawAmount < 0
        ? 'Expense'
        : 'Income'

  return {
    id: tx.Id,
    name: tx.Name,
    date: tx.Transaction_Date__c ? new Date(tx.Transaction_Date__c) : null,
    category,
    subcategory: tx.Transaction_Subcategory__c || '',
    amount: Math.abs(rawAmount),
    type,
    method: tx.Transaction_Payment_Account__r?.Name || 'Unknown account',
  }
}

function formatAmount(amount, type) {
  const sign = type === 'Income' ? '+' : type === 'Transfer' ? '' : '-'
  return `${sign}\u20B9${amount.toFixed(2)}`
}

function ordinalSuffix(day) {
  if (day % 10 === 1 && day !== 11) return 'st'
  if (day % 10 === 2 && day !== 12) return 'nd'
  if (day % 10 === 3 && day !== 13) return 'rd'
  return 'th'
}

// e.g. "Mon, 31st Jan"
function formatGroupTitle(date) {
  const weekday = date.toLocaleDateString('en-US', { weekday: 'short' })
  const month = date.toLocaleDateString('en-US', { month: 'short' })
  const day = date.getDate()
  return `${weekday}, ${day}${ordinalSuffix(day)} ${month}`
}

// groups already-sorted (newest first) rows by calendar day
function groupByDay(rows) {
  const groups = []
  const groupByKey = new Map()

  rows.forEach((row) => {
    const key = row.date ? row.date.toDateString() : 'Unknown date'
    let group = groupByKey.get(key)
    if (!group) {
      group = {
        key,
        title: row.date ? formatGroupTitle(row.date) : 'Unknown date',
        items: [],
      }
      groupByKey.set(key, group)
      groups.push(group)
    }
    group.items.push(row)
  })

  return groups
}

function Money({ search = '' }) {
  const {
    data: transactions,
    status,
    error,
  } = useHostData(
    'transactions-request',
    'transactions-response',
    'transactions',
  )
  const [collapsedGroups, setCollapsedGroups] = useState(new Set())

  const rows = transactions
    .map(mapTransaction)
    .filter((tx) =>
      tx.name?.toLowerCase().includes(search.trim().toLowerCase()),
    )
    .sort((a, b) => (b.date ?? 0) - (a.date ?? 0))
  const groups = groupByDay(rows)

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
    <div className="money-panel">
      {status === 'loading' && (
        <p className="money-hint">Loading transactions…</p>
      )}
      {status === 'error' && <p className="money-error">{error}</p>}
      {status === 'success' && transactions.length === 0 && (
        <p className="money-hint">
          No transactions returned. The Guest User may not have Read access
          to Transaction records.
        </p>
      )}
      {status === 'success' && transactions.length > 0 && rows.length === 0 && (
        <p className="money-hint">No transactions match &ldquo;{search}&rdquo;.</p>
      )}
      {status === 'success' &&
        groups.map(({ key, title, items }) => {
          const isCollapsed = collapsedGroups.has(key)
          return (
            <div key={key} className="money-group">
              <button
                type="button"
                className="money-group-header"
                onClick={() => toggleGroup(key)}
                aria-expanded={!isCollapsed}
              >
                <span className="money-group-title">{title}</span>
                <FiChevronDown
                  className={`money-group-chevron${isCollapsed ? ' collapsed' : ''}`}
                  aria-hidden="true"
                />
              </button>
              {!isCollapsed && (
                <div className="money-list">
                  {items.map(
                    ({ id, name, category, subcategory, amount, type, method }) => (
                      <div key={id} className="money-row">
                        <div className="money-row-left">
                          <div className="money-name">{name}</div>
                          <div className="money-category">
                            {category} &middot; {subcategory}
                          </div>
                        </div>
                        <div className="money-row-right">
                          <div
                            className={`money-amount${type === 'Income' ? ' income' : ''}${type === 'Expense' ? ' expense' : ''}`}
                          >
                            {formatAmount(amount, type)}
                          </div>
                          <div className="money-meta">
                            {type} &middot; {method}
                          </div>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              )}
            </div>
          )
        })}
    </div>
  )
}

export default Money
