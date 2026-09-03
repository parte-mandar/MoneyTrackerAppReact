import { useEffect, useRef, useState } from 'react'
import { FiX } from 'react-icons/fi'
import { useHostData } from '../hooks/useHostData'
import './AddTransaction.css'

const REQUEST_TIMEOUT_MS = 8000
const EMPTY_CATEGORY_MAP = {}

// placeholder picklist values until real Salesforce picklists are wired up
const PAYMENT_METHOD_OPTIONS = [
  'Credit Card',
  'Debit Card',
  'Cash',
  'UPI',
  'Bank Transfer',
]

// required fields, everything except description
const REQUIRED_FIELDS = [
  'dateTime',
  'name',
  'category',
  'subcategory',
  'amount',
  'paymentMethod',
]

function nowForDateTimeInput() {
  const now = new Date()
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
  return now.toISOString().slice(0, 16)
}

function initialForm() {
  return {
    dateTime: nowForDateTimeInput(),
    name: '',
    category: '',
    subcategory: '',
    amount: '',
    paymentMethod: '',
    description: '',
  }
}

function AddTransaction({ onClose }) {
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState('idle') // idle | saving | error
  const [error, setError] = useState('')
  const timeoutRef = useRef(null)

  const { data: categoryMap } = useHostData(
    'transactions-category-request',
    'transactions-category-response',
    'categoryMap',
    EMPTY_CATEGORY_MAP,
  )
  const categoryOptions = Object.keys(categoryMap)
  const subcategoryOptions = categoryMap[form.category] || []

  useEffect(() => {
    function handleMessage(event) {
      // only trust messages from the direct parent frame (the VF page hosting this iframe)
      if (event.source !== window.parent) return
      const { type, success, error: responseError } = event.data || {}
      if (type !== 'create-transaction-response') return
      clearTimeout(timeoutRef.current)
      if (success) {
        onClose()
      } else {
        setStatus('error')
        setError(responseError || 'Failed to save the transaction.')
      }
    }

    window.addEventListener('message', handleMessage)
    return () => {
      window.removeEventListener('message', handleMessage)
      clearTimeout(timeoutRef.current)
    }
  }, [onClose])

  function handleChange(field) {
    return (e) => {
      const value = e.target.value
      if (field === 'category') {
        setForm({ ...form, category: value, subcategory: '' })
      } else {
        setForm({ ...form, [field]: value })
      }
    }
  }

  function handleSubmit(e) {
    e.preventDefault()

    const hasMissingField = REQUIRED_FIELDS.some(
      (field) => !String(form[field]).trim(),
    )
    if (hasMissingField) {
      setStatus('error')
      setError('Please fill in all fields.')
      return
    }

    setStatus('saving')
    setError('')

    window.parent?.postMessage(
      {
        type: 'create-transaction-request',
        transaction: {
          name: form.name,
          dateTime: form.dateTime,
          category: form.category,
          subcategory: form.subcategory,
          amount: parseFloat(form.amount) || 0,
          paymentMethod: form.paymentMethod,
          description: form.description,
        },
      },
      '*',
    )

    timeoutRef.current = setTimeout(() => {
      setStatus('error')
      setError(
        'No response from the Salesforce host. Are you viewing this outside the Visualforce container?',
      )
    }, REQUEST_TIMEOUT_MS)
  }

  return (
    <div className="add-transaction-page">
      <div className="add-transaction-header">
        <h2 className="add-transaction-title">Add Transaction</h2>
        <button
          type="button"
          className="add-transaction-close"
          onClick={onClose}
          aria-label="Close"
        >
          <FiX aria-hidden="true" />
        </button>
      </div>
      <form className="add-transaction-body" onSubmit={handleSubmit}>
        <label className="form-field">
          <span className="form-label">Date &amp; time</span>
          <input
            type="datetime-local"
            className="form-input"
            value={form.dateTime}
            onChange={handleChange('dateTime')}
          />
        </label>

        <label className="form-field">
          <span className="form-label">Transaction name</span>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Coffee Shop"
            value={form.name}
            onChange={handleChange('name')}
          />
        </label>

        <label className="form-field">
          <span className="form-label">Category</span>
          <select
            className="form-input"
            value={form.category}
            onChange={handleChange('category')}
          >
            <option value="">Select a category</option>
            {categoryOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="form-field">
          <span className="form-label">Subcategory</span>
          <select
            className="form-input"
            value={form.subcategory}
            onChange={handleChange('subcategory')}
            disabled={!form.category}
          >
            <option value="">Select a subcategory</option>
            {subcategoryOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="form-field">
          <span className="form-label">Amount</span>
          <input
            type="number"
            step="0.01"
            className="form-input"
            placeholder="0.00"
            value={form.amount}
            onChange={handleChange('amount')}
          />
        </label>

        <label className="form-field">
          <span className="form-label">Payment method</span>
          <select
            className="form-input"
            value={form.paymentMethod}
            onChange={handleChange('paymentMethod')}
          >
            <option value="">Select a payment method</option>
            {PAYMENT_METHOD_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="form-field">
          <span className="form-label">Description</span>
          <textarea
            className="form-input form-textarea"
            rows={4}
            placeholder="Add any notes about this transaction"
            value={form.description}
            onChange={handleChange('description')}
          />
        </label>

        {status === 'error' && <p className="form-error">{error}</p>}

        <button
          type="submit"
          className="add-transaction-submit"
          disabled={status === 'saving'}
        >
          {status === 'saving' ? 'Saving…' : 'Add'}
        </button>
      </form>
    </div>
  )
}

export default AddTransaction
