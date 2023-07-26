import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as smoothscroll from 'smoothscroll-polyfill'
import * as log from './common/log'

import 'typeface-montserrat'

import App from './components/app'
import './index.css'

log.init(process.env.LOG_LEVEL_FRONTEND || '')

smoothscroll.polyfill()

ReactDOM.render(<App />, document.getElementById('app'))
