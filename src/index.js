import React from 'react'
import ReactDOM from 'react-dom'
import {HashRouter as Router, Route, Routes} from 'react-router-dom'

import './index.css'
import Page from './components/Page'
import Map from './components/Map'
import WhiteBirdMap from './components/WhiteBirdMap'

import { getListings, getListingMetadata, getStaticText } from './data'
import { formatListings } from './utils'
import About from './components/About'
import Resources from './components/Resources'
import SuggestUpdate from './components/SuggestUpdate'

import { getCityCount, getCategoryCount } from './utils/cities'

function App({listings, listingMetadata, staticText}) {
  const { about_text: aboutText, resources, disclaimer } = staticText ?? {}
  // White Bird Demo route
  const whiteBirdListings = listings.filter(listing => listing.data_source?.includes('White Bird Little Help Book')).filter(listing => !listing.category.includes('Education'))
  const whiteBirdListingCities = getCityCount(whiteBirdListings)
  const listingCategories = getCategoryCount(whiteBirdListings)
  
  return (
    <Router>
      <Page>
        <Routes>
          <Route path="/about" element={<About aboutText={aboutText} />} />
          <Route path="/resources" element={<Resources resources={resources} />} />
          <Route path="/suggest" element={<SuggestUpdate />} />
          {/* White Bird Demo routes  */}
          <Route path="/" element={<WhiteBirdMap listings={whiteBirdListings} listingMetadata={listingMetadata} listingCities={whiteBirdListingCities} listingCategories={listingCategories} />} />
          <Route path="/:markerId" element={<WhiteBirdMap listings={whiteBirdListings} listingMetadata={listingMetadata} listingCities={whiteBirdListingCities} listingCategories={listingCategories} />} />
          {/* End WB Demo routes  */}
          {/* <Route path="/" element={<Map listings={listings} listingMetadata={listingMetadata} />} /> */}
          {/* <Route path=":markerId" element={<Map listings={listings} listingMetadata={listingMetadata} />} /> */}
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
    getListingMetadata(API_URL),
    getStaticText(API_URL)
  ])
  .then(([ listings, listingMetadata, staticText ]) => ReactDOM.render(<App listings={formatListings(listings)} listingMetadata={listingMetadata} staticText={staticText} />, window.app))
