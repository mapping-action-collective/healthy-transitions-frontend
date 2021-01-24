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
          <Route path="" element={<></>} />
          <Route path="map" element={<Map mapData={mapData} />} />
        </Routes>
      </Page>
    </Router>
  );
}

getData().then(({data}) => ReactDOM.render(<App mapData={formatMapData(data)} />, window.app))
