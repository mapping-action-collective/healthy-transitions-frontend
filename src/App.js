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

function App({listings, metadata}) {
  // Static site text comes from a constants file
  const {ABOUT_TEXT, DISCLAIMER, VIDEO_TUTORIAL_LINK, RUBRIC_TEXT, CONTRIBUTORS, FORMS } = CONTENT 
  // This is an optional field from the API. Use backup constant data if API data is not available.
  const resources = metadata.resources ?? null
  console.log(resources)
  if (!metadata?.categoryCount) metadata.categoryCount = getCategoryCount(listings)

  return (
    <Router>
      <Page disclaimer={DISCLAIMER} aboutText={ABOUT_TEXT} resources={resources}>
        <Routes>
          {ABOUT_TEXT && <Route path="/about" element={
            <About aboutText={ABOUT_TEXT} contributors={CONTRIBUTORS} disclaimer={DISCLAIMER} videoLink={VIDEO_TUTORIAL_LINK} rubric={RUBRIC_TEXT} 
            />} 
          />}
          {resources && <Route path="/resources" element={
            <Resources resources={resources} 
            />} 
          />}
          <Route path="/suggest" element={<SuggestUpdate forms={FORMS} />} />
          <Route path="/suggest/:listingId" element={<SuggestUpdate />} />
          <Route path="/" element={
            <Map listings={listings} metadata={metadata} />} />
          <Route path=":markerId" element={
            <Map listings={listings} metadata={metadata} />} />
        </Routes>
      </Page>
    </Router>
  )
}

export default App;