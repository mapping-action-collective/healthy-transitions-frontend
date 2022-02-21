import React from 'react'
import {HashRouter as Router, Route, Routes} from 'react-router-dom'

import './index.css'
import Page from './components/Page'
import Map from './components/Map'

import usePosition from './hooks/usePosition'
import { getCategoryCount } from './utils'
import { addDistanceToListings } from './geoUtils'


import About from './components/About'
import Resources from './components/Resources'
import SuggestUpdate from './components/SuggestUpdate'

function App({listings, listingMetadata, staticText}) {
  const { about_text: aboutText, resources, disclaimer, contributors } = staticText ?? {}
  // Note: This hook returns the user's current coords. TODO: Potentially fetch this every minute, to keep up-to-date for mobile users
  const { coords, error } = usePosition()
  if (coords) { listings = addDistanceToListings(listings, coords) }
  listingMetadata.categoryCount = getCategoryCount(listings)

  return (
    <Router>
      <Page disclaimer={disclaimer}>
        <Routes>
          <Route path="/about" element={<About aboutText={aboutText} contributors={contributors} />} />
          <Route path="/resources" element={<Resources resources={resources} />} />
          <Route path="/suggest" element={<SuggestUpdate />} />
          <Route path="/" element={<Map listings={listings} listingMetadata={listingMetadata} userCoords={coords ?? null} />} />
          <Route path=":markerId" element={<Map listings={listings} listingMetadata={listingMetadata} userCoords={coords ?? null} />} />
        </Routes>
      </Page>
    </Router>
  )
}

export default App;