import React from 'react'
import ReactDOM from 'react-dom'
import { App } from './App'

import { AuthProvicer } from './context/auth'

import './styles/global.css'

ReactDOM.render(
  <React.StrictMode>
    <AuthProvicer>
      <App />
    </AuthProvicer>
  </React.StrictMode>,
  document.getElementById('root')
)
