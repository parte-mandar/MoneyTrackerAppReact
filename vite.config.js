import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// relative base so assets resolve correctly under the Salesforce static
// resource path (e.g. /resource/<timestamp>/MoneyTrackerApp/...)
export default defineConfig({
  base: './',
  plugins: [react()],
})
