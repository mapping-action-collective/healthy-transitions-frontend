import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-markercluster/dist/styles.min.css';

import './Map.css'
import {greenLMarker, blueLMarker} from '../resources/mapIcons'
import { Link, useParams } from "react-router-dom";

function Markers ({mapData}) {
  const {markerId} = useParams()

  return (
    <MarkerClusterGroup>
      {mapData.map(({coords, popup}) =>
        <Marker key={popup.id} position={coords} icon={markerId === `${popup.id}` ? greenLMarker : blueLMarker}>
          <Popup>
            <div className="popup-container">
              <div>{popup.listing}</div>
              <div>{`${popup.street} ${popup.street2}`}</div>
              <Link to={`/map/${popup.id}`} className="popup-show-details">Show Details</Link>
            </div>
          </Popup>
            <Tooltip>
              <div className="popup-tooltip">
                <div>{popup.listing}</div>
              </div>
            </Tooltip>
        </Marker>
      )}
    </MarkerClusterGroup>
  )
}

function MapPage({mapData}) {
  return (
    <MapContainer
      center={[44.0489388,-123.0919415]}
      zoom={10}
      minZoom={8}
      maxZoom={18}
      scrollWheelZoom={true}
      tap={true}
      dragging={true}
      touchZoom={true}
    >
      <TileLayer attribution="" url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
      <Markers mapData={mapData} />
    </MapContainer>
  )
}

export default MapPage;