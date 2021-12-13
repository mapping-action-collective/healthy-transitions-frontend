import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter as Router, Route, Routes} from 'react-router-dom'
import { get, set } from 'lodash/fp'

import './index.css';
import Page from './components/Page'
import Map from './components/Map'

import { getListings } from './data'
import { formatListings } from './utils';

function App({listings}) {
  const categories = listings.reduce((categories, { category: fullCategory }) => {
    const [category, subcategory] = fullCategory.split(`: `)
    return set(`[${category}][${subcategory}]`)(1 + (get(`[${category}][${subcategory}]`)(categories) ?? 0))(categories)
  }, {})
  return (
    <Router>
      <Page categories={categories}>
        <Routes>
          <Route>
            <Route path="/" element={<Map listings={listings} />} />
            <Route path=":markerId" element={<Map listings={listings} />} />
          </Route>
        </Routes>
      </Page>
    </Router>
  );
}

const CURRENT_URL = new URL(window.location)
const API_URL =
  CURRENT_URL.searchParams.get('api') ?? (
  CURRENT_URL.hostname === `localhost` ? `http://localhost:5050/api`
: CURRENT_URL.hostname === `hto2020-frontend-staging.herokuapp.com` ? `https://hto2020-backend-staging.herokuapp.com/api`
: `https://hto2020-backend-production.herokuapp.com/api`
)

Promise
  .all([ getListings(API_URL) ])
  .then(([ listings ]) => ReactDOM.render(<App listings={formatListings(listings)} />, window.app))
