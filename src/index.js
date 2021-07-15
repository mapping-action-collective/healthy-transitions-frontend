import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter as Router, Route, Routes} from 'react-router-dom'

import './index.css';
import Page from './components/Page'
import Map from './components/Map'

import getData from './data'
import { formatMapData } from './utils';

function App({mapData}) {
  return (
    <Router>
      <Page>
        <Routes>
          <Route>
            <Route path="/" element={<Map mapData={mapData} />} />
            <Route path=":markerId" element={<Map mapData={mapData} />} />
          </Route>
        </Routes>
      </Page>
    </Router>
  );
}

const API_URL = new URL(window.location).searchParams.get('api') || process.env.API_URL
getData(API_URL).then(data => ReactDOM.render(<App mapData={formatMapData(data)} />, window.app))
