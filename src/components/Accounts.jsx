import './Accounts.css'

// placeholder accounts until wired to real Salesforce payment account data
const ACCOUNTS = [
  { id: 1, name: 'HDFC Savings', type: 'Bank Account', balance: 84520.75 },
  { id: 2, name: 'ICICI Salary Account', type: 'Bank Account', balance: 132400.0 },
  { id: 3, name: 'HDFC Regalia', type: 'Credit Card', balance: -12450.3 },
  { id: 4, name: 'Amazon Pay ICICI', type: 'Credit Card', balance: -3200.0 },
  { id: 5, name: 'Cash Wallet', type: 'Cash', balance: 2500.0 },
]

function formatBalance(balance) {
  const sign = balance < 0 ? '-' : ''
  return `${sign}\u20B9${Math.abs(balance).toFixed(2)}`
}

function Accounts() {
  return (
    <div className="accounts-panel">
      <div className="accounts-list">
        {ACCOUNTS.map(({ id, name, type, balance }) => (
          <div key={id} className="account-card">
            <div className="account-card-left">
              <div className="account-card-name">{name}</div>
              <div className="account-card-type">{type}</div>
            </div>
            <div
              className={`account-card-balance${balance < 0 ? ' negative' : ''}`}
            >
              {formatBalance(balance)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Accounts
