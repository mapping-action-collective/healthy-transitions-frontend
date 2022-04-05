import React from 'react'
import {HashRouter as Router, Route, Routes} from 'react-router-dom'

import './index.css'
import Page from './components/Page'
import Map from './components/Map'
import About from './components/About'
import Resources from './components/Resources'
import SuggestUpdate from './components/SuggestUpdate'

function App({listings, metadata}) {
  const resources = metadata.resources ?? null

  return (
    <Router>
      <Page>
        <Routes>
          <Route path="/about" element={<About />} />
          {resources && <Route path="/resources" element={<Resources resources={resources} />} />}
          <Route path="/suggest" element={<SuggestUpdate />} />
          <Route path="/suggest/:listingId" element={<SuggestUpdate />} />
          <Route path="/" element={<Map listings={listings} metadata={metadata} key='map' />} />
          <Route path=":markerId" element={<Map listings={listings} metadata={metadata} key='marker-map' />}  />
        </Routes>
      </Page>
    </Router>
  )
}

export default App;