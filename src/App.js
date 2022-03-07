import React from 'react'
import {HashRouter as Router, Route, Routes} from 'react-router-dom'

import './index.css'
import Page from './components/Page'
import Map from './components/Map'
import { CONTENT } from './constants'

import { getCategoryCount } from './utils'

import About from './components/About'
import Resources from './components/Resources'
import SuggestUpdate from './components/SuggestUpdate'

function App({listings, listingMetadata}) {
  const {ABOUT_TEXT, DISCLAIMER, FOOTER_DISCLAIMER, VIDEO_TUTORIAL_LINK, RUBRIC_TEXT, CONTRIBUTORS, MORE_RESOURCES, FORMS } = CONTENT 
  if (!listingMetadata?.categoryCount) listingMetadata.categoryCount = getCategoryCount(listings)
  
  return (
    <Router>
      <Page disclaimer={DISCLAIMER} aboutText={ABOUT_TEXT} resources={MORE_RESOURCES}>
        <Routes>
          {ABOUT_TEXT && <Route path="/about" element={<About aboutText={ABOUT_TEXT} contributors={CONTRIBUTORS} disclaimer={DISCLAIMER} videoLink={VIDEO_TUTORIAL_LINK} rubric={RUBRIC_TEXT} />} />}
          {MORE_RESOURCES && <Route path="/resources" element={<Resources resources={MORE_RESOURCES} />} />}
          <Route path="/suggest" element={<SuggestUpdate forms={FORMS} />} />
          <Route path="/suggest/:listingId" element={<SuggestUpdate />} />
          <Route path="/" element={<Map listings={listings} listingMetadata={listingMetadata} />} />
          <Route path=":markerId" element={<Map listings={listings} listingMetadata={listingMetadata} />} />
        </Routes>
      </Page>
    </Router>
  )
}

export default App;