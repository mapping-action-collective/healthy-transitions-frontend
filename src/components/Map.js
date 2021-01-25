import { createRef, forwardRef, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Container, Segment, Input, Card, Grid, Ref, Sticky } from "semantic-ui-react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-markercluster/dist/styles.min.css';

import {filterMapData} from '../utils'
import './Map.css'
import {greenLMarker, blueLMarker} from '../resources/mapIcons'

const getColor = (index) => ["red", "orange", "yellow", "olive", "green", "teal", "blue", "violet", "purple", "pink", "brown"][index%11]

function Markers ({mapData, cardRefs}) {
  const {markerId} = useParams()

  return (<>
    <MarkerClusterGroup>
      {mapData.map(({coords, popup}, index) =>
        <Marker key={popup.id} position={coords} icon={markerId === `${popup.id}` ? greenLMarker : blueLMarker}>
          <Popup>
            <div className="popup-container">
              <div>{popup.listing}</div>
              <div>{`${popup.street} ${popup.street2}`}</div>
              <Link to={`/map/${popup.id}`} onClick={() => { cardRefs[index].current.scrollIntoView({behavior: "smooth"}) }} className="popup-show-details">Show Details</Link>
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
  </>)
}

const MapCard = forwardRef(({popup, index}, ref) =>
  <Ref innerRef={ref}>
    <Card header={popup.listing} meta={[popup.street, popup.street2].filter(Boolean).join()} color={getColor(index)} centered raised />
  </Ref>
)

function MapPage({mapData}) {
  const params = useParams()
  const navigate = useNavigate()
  const [search, updateSearch] = useState()
  const filteredMapData = filterMapData(mapData, search)
  const mapRef = createRef()
  const cardRefs = filteredMapData.map(() => createRef())
  const currentCard = cardRefs[params.markerId]
  useEffect(() => currentCard && currentCard.current.scrollIntoView({behavior: "smooth"}), [currentCard])

  return (<>
    <Segment color="pink" basic inverted>
      <Container>
        <Input size="huge" fluid tabIndex="1" placeholder="Search" action={{icon: "search"}} onFocus={() => navigate("/map")} onChange={(e, {value}) => updateSearch(value)} />
      </Container>
    </Segment>
    <Ref innerRef={mapRef}>
      <Container fluid as={Grid} stackable doubling reversed='computer' columns={2}>
        <Grid.Column>
          <Sticky context={mapRef} offset={14}>
            <Segment as={MapContainer}
              center={[44.0489388,-123.0919415]}
              zoom={10}
              minZoom={8}
              maxZoom={18}
              scrollWheelZoom={false}
              tap={true}
              dragging={true}
              touchZoom={true}
            >
              <TileLayer attribution="" url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
              {/* alternate map tile source: https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png */}
              <Markers mapData={filteredMapData} cardRefs={cardRefs} />
            </Segment>
          </Sticky>
        </Grid.Column>
        <Grid.Column as={Card.Group} itemsPerRow="1">
          {filteredMapData.map(({popup}, index) => <MapCard key={`${popup.id}-${index}`} popup={popup} index={index} ref={cardRefs[index]} />)}
        </Grid.Column>
      </Container>
    </Ref>
  </>)
}

export default MapPage;
