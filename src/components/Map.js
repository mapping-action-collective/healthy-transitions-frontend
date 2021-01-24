import Leaflet from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-markercluster/dist/styles.min.css';

import './Map.css'
import greenLMarker from '../resources/green-marker.png'
import blueLMarker from '../resources/blue-marker.png'

/* TEMP MOCK VALUES */
const updateListing = () => {}
const selectedListing = null
let markers = []
/* /TEMP */


/* TEMP COPIED FROM EXAMPLE */
function Markers (props) {
  const { mapData, updateListing, selectedListing } = props;
  const bindMarker = (ref) => {
    if (ref) {
      const marker = ref.leafletElement;
      markers.push(marker);
    }
  }

  return (
    <MarkerClusterGroup>
      {mapData.map((item, index) =>
        <Marker
          key={`${item.popup.id}-${index}`}
          ref={bindMarker}
          position={item.coords}
          id={item.popup.id}
          icon={
            Leaflet.icon({
              iconUrl: selectedListing === item.popup.id ? greenLMarker : blueLMarker
          })
            
          }
        >
          <Popup>
            <div className="popup-container">
              <div>{item.popup.listing}</div>
              <div>{`${item.popup.street} ${item.popup.street2}`}</div>
              <div
                className="popup-show-details"
                onClick={() => {
                  updateListing(item.popup.id, "popup");
                }}
              >
                Show Details
              </div>
            </div>
          </Popup>
            <Tooltip>
              <div className="popup-tooltip">
                <div>{item.popup.listing}</div>
              </div>
            </Tooltip>
        </Marker>
      )}
    </MarkerClusterGroup>
  )
}
/* /TEMP */

function MapPage({mapData}) {
  return (<>
    <MapContainer
      center={[44.0489388,-123.0919415]}
      zoom={10}
      minZoom={8}
      maxZoom={18}
      scrollWheelZoom={false /*true*/}
      tap={true}
      dragging={true}
      touchZoom={true}
    >
      <TileLayer
        attribution=""
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" //"https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      <Markers
        mapData={mapData}
        updateListing={updateListing}
        selectedListing={selectedListing}
      />
    </MapContainer>
  </>)
}

export default MapPage;