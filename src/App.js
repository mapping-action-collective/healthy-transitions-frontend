import React, { useEffect, useState } from 'react'
import {HashRouter as Router, Route, Routes} from 'react-router-dom'

import './index.css'
import Page from './components/Page'
import Map from './components/Map'

import usePosition from './hooks/usePosition'
import { getCategoryCount, getCityCount, listingCategoryIcons } from './utils'

import About from './components/About'
import Resources from './components/Resources'
import SuggestUpdate from './components/SuggestUpdate'

function App({listings, listingMetadata, staticText}) {

  const { about_text: aboutText, resources, disclaimer, contributors } = staticText ?? {}
  const { coords, error } = usePosition()
  console.log(coords, error)
  
  // TEMP FOR TESTING 2/19/22 ----------------------- 
  listingMetadata.categoryCount = getCategoryCount(listings)
  listingMetadata.cityCount = getCityCount(listings)
  listingMetadata.listingCategoryIcons = listingCategoryIcons

  return (
    <Router>
      <Page disclaimer={disclaimer}>
        <Routes>
          <Route path="/about" element={<About aboutText={aboutText} contributors={contributors} />} />
          <Route path="/resources" element={<Resources resources={resources} />} />
          <Route path="/suggest" element={<SuggestUpdate />} />
          <Route path="/" element={<Map listings={listings} listingMetadata={listingMetadata} />} />
          <Route path=":markerId" element={<Map listings={listings} listingMetadata={listingMetadata} />} />
        </Routes>
      </Page>
    </Router>
  )
}

export default App;