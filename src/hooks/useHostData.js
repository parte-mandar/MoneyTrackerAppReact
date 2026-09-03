import { useEffect, useState } from 'react'

const REQUEST_TIMEOUT_MS = 8000

// requests `${type}` data from the hosting Visualforce page over postMessage
// and resolves with the payload sent back as `{ type: responseType, [dataKey]: [...] }`
export function useHostData(requestType, responseType, dataKey, defaultValue = []) {
  const [data, setData] = useState(defaultValue)
  const [status, setStatus] = useState('loading') // loading | success | error
  const [error, setError] = useState('')

  useEffect(() => {
    setStatus('loading')
    setError('')

    const timeoutId = setTimeout(() => {
      setError(
        'No response from the Salesforce host. Are you viewing this outside the Visualforce container?',
      )
      setStatus('error')
    }, REQUEST_TIMEOUT_MS)

    function handleMessage(event) {
      // only trust messages from the direct parent frame (the VF page hosting this iframe)
      if (event.source !== window.parent) return
      const payload = event.data || {}
      if (payload.type !== responseType) return
      clearTimeout(timeoutId)
      setData(payload[dataKey] ?? defaultValue)
      setStatus('success')
    }

    window.addEventListener('message', handleMessage)
    window.parent?.postMessage({ type: requestType }, '*')

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('message', handleMessage)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- defaultValue is only a fallback, not a trigger
  }, [requestType, responseType, dataKey])

  return { data, status, error }
}
