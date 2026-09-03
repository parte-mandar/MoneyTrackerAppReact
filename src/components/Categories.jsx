import { FiX } from 'react-icons/fi'
import { useHostData } from '../hooks/useHostData'
import './Categories.css'

const EMPTY_CATEGORY_MAP = {}

function Categories({ onClose }) {
  const {
    data: categoryMap,
    status,
    error,
  } = useHostData(
    'transactions-category-request',
    'transactions-category-response',
    'categoryMap',
    EMPTY_CATEGORY_MAP,
  )
  const categories = Object.keys(categoryMap)

  return (
    <div className="categories-page">
      <div className="categories-header">
        <h2 className="categories-title">Categories</h2>
        <button
          type="button"
          className="categories-close"
          onClick={onClose}
          aria-label="Close"
        >
          <FiX aria-hidden="true" />
        </button>
      </div>
      <div className="categories-body">
        {status === 'loading' && (
          <p className="categories-hint">Loading categories…</p>
        )}
        {status === 'error' && <p className="categories-error">{error}</p>}
        {status === 'success' && categories.length === 0 && (
          <p className="categories-hint">
            No categories returned. The Guest User may not have Read access
            to the category metadata.
          </p>
        )}
        {status === 'success' && categories.length > 0 && (
          <div className="categories-list">
            {categories.map((category) => (
              <div key={category} className="category-row">
                <div className="category-name">{category}</div>
                <div className="category-subcategories">
                  {(categoryMap[category] || []).join(', ')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Categories
