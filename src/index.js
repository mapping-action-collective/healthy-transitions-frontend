import React from 'react'
import ReactDOM from 'react-dom'
import {HashRouter as Router, Route, Routes} from 'react-router-dom'

import './index.css'
import Page from './components/Page'
import Map from './components/Map'

import { getListings, getListingMetadata } from './data'
import { formatListings } from './utils'
import About from './components/About'
import Resources from './components/Resources'
import SuggestUpdate from './components/SuggestUpdate'

function App({listings, listingMetadata}) {
  return (
    <Router>
      <Page>
        <Routes>
          <Route path="/about" element={<About />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/suggest" element={<SuggestUpdate />} />
          <Route path="/" element={<Map listings={listings} listingMetadata={listingMetadata} />} />
          <Route path=":markerId" element={<Map listings={listings} listingMetadata={listingMetadata} />} />
        </Routes>
      </Page>
    </Router>
  )
}

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
    getListingMetadata(API_URL)
  ])
  .then(([ listings, listingMetadata ]) => ReactDOM.render(<App listings={formatListings(listings)} listingMetadata={listingMetadata} />, window.app))
  
