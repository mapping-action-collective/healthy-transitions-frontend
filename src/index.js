import React from 'react'
import ReactDOM from 'react-dom'
import {HashRouter as Router, Route, Routes} from 'react-router-dom'

import './index.css'
import Page from './components/Page'
import Map from './components/Map'

import { getListings, getListingCategories } from './data'
import { formatListings } from './utils'
import About from './components/About'
import SuggestUpdate from './components/SuggestUpdate'

function App({listings, listingCategoryIcons}) {
  return (
    <Router>
      <Page>
        <Routes>
          <Route path="/about" element={<About />} />
          <Route path="/suggest" element={<SuggestUpdate />} />
          <Route path="/suggest/:activeIndex" element={<SuggestUpdate />} />
          <Route path="/" element={<Map listings={listings} listingCategoryIcons={listingCategoryIcons} />} />
          <Route path=":markerId" element={<Map listings={listings} listingCategoryIcons={listingCategoryIcons} />} />
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
    getListingCategories(API_URL),
  ])
  .then(([ listings, listingCategoryIcons ]) => ReactDOM.render(<App listings={formatListings(listings)} listingCategoryIcons={listingCategoryIcons} />, window.app))
