import React from 'react'
import {HashRouter as Router, Route, Routes} from 'react-router-dom'

import './index.css'
import Page from './components/Page'
import Map from './components/Map'

import { getCategoryCount } from './utils'

import About from './components/About'
import Resources from './components/Resources'
import SuggestUpdate from './components/SuggestUpdate'

function App({listings, listingMetadata, staticText}) {
  const { about_text: aboutText, resources, disclaimer, contributors } = staticText ?? {}
  if (!listingMetadata?.categoryCount) listingMetadata.categoryCount = getCategoryCount(listings)
  
  return (
    <Router>
      <Page disclaimer={disclaimer} aboutText={aboutText} resources={resources}>
        <Routes>
          {aboutText && <Route path="/about" element={<About aboutText={aboutText} contributors={contributors} />} />}
          {resources && <Route path="/resources" element={<Resources resources={resources} />} />}
          <Route path="/suggest" element={<SuggestUpdate />} />
          <Route path="/" element={<Map listings={listings} listingMetadata={listingMetadata} />} />
          <Route path=":markerId" element={<Map listings={listings} listingMetadata={listingMetadata} />} />
        </Routes>
      </Page>
    </Router>
  )
}

export default App;