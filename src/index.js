import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import { getListings, getMeta } from './data'
import { formatListings } from './utils'

const CURRENT_URL = new URL(window.location)
const API_URL =
  CURRENT_URL.searchParams.get('api') ?? (
  CURRENT_URL.hostname === `localhost` ? `http://localhost:5050/api`
: CURRENT_URL.hostname === `hto2020-frontend-staging.herokuapp.com` ? `https://hto2020-backend-staging.herokuapp.com/api`
: `https://hto2020-backend-production.herokuapp.com/api`
)

Promise
  .all([
    getListings(API_URL),
    getMeta(API_URL)
  ])
  .then(([ listings, metadata ]) => ReactDOM.render(<App listings={formatListings(listings)} metadata={metadata} />, window.app))
