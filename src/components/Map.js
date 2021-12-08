import { createRef, forwardRef, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Container, Segment, Input, Card, Label, Grid, Ref, Sticky, List, Header } from "semantic-ui-react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from "react-leaflet";
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-markercluster/dist/styles.min.css';

import {filterListings} from '../utils'
import './Map.css'
import {greenLMarker, blueLMarker} from '../resources/mapIcons'

const getColor = (index) => ["red", "orange", "yellow", "olive", "green", "teal", "blue", "violet", "purple", "pink", "brown"][index%11]

function MapPage({ listings }) {
  const navigate = useNavigate()
  const [ search, updateSearch ] = useState()
  const filteredListings = filterListings(listings, search)
  const mapRef = createRef()
  // todo: memoize this
  const cardRefs = listings.reduce((cardRefs, listing) => ({...cardRefs, [listing.guid]: createRef()}), {})

  return (<>
    <Segment color="pink" basic inverted>
      <Container>
        <Input size="huge" fluid tabIndex="1" placeholder="Search" action={{icon: "search"}} onFocus={() => navigate("/")} onChange={(e, {value}) => updateSearch(value)} />
      </Container>
    </Segment>
    <Ref innerRef={mapRef}>
      <Container fluid as={Grid} stackable doubling reversed='computer' columns={2}>
        <MapMap filteredListings={filteredListings} mapRef={mapRef} cardRefs={cardRefs} />
        <MapCards listings={listings} cardRefs={cardRefs} />
      </Container>
    </Ref>
  </>)
}

function MapCards({ listings, cardRefs }) {
  const { markerId } = useParams()
  const currentCard = cardRefs[markerId]
  useEffect(() => currentCard && currentCard.current.scrollIntoView({behavior: "smooth"}), [currentCard])
  return (
    <Grid.Column as={Card.Group} itemsPerRow="1">
      {listings.map((listing, index) => <MapCard key={listing.guid} listing={listing} index={index} ref={cardRefs[listing.guid]} />)}
    </Grid.Column>
  )
}

const MapCard = forwardRef(({ listing: { guid, category, coords, parent_organization, full_name, full_address, description, phone_1, phone_label_1, phone_2, phone_label_2, crisis_line_number, crisis_line_label, website, blog_link, twitter_link, facebook_link, youtube_link, instagram_link, video_description, languages_offered, services_provided, keywords, ...listing}, index}, ref) =>
  <Ref innerRef={ref}>
    <Card color={getColor(index)} centered raised className="map-card">
      <Card.Content>
        { !!parent_organization && <Label as='a' ribbon color={getColor(index)} style={{'margin-bottom': `1em`}}>{parent_organization}</Label> }
        <Card.Header><Link to={`/${guid}`}>{full_name}</Link></Card.Header>
        <Card.Meta>{full_address}</Card.Meta>
        <Segment secondary>
          { phone_1 && <Card.Description>{phone_label_1}: {phone_1}</Card.Description> }
          { phone_2 && <Card.Description>{phone_label_2}: {phone_2}</Card.Description> }
          { crisis_line_number && <Card.Description>{crisis_line_label}: {crisis_line_number}</Card.Description> }
          { website && <Card.Description><a href={website}>{website}</a></Card.Description> }
          { blog_link && <Card.Description><a href={blog_link}>{blog_link}</a></Card.Description> }
          { twitter_link && <Card.Description><a href={twitter_link}>{twitter_link}</a></Card.Description> }
          { facebook_link && <Card.Description><a href={facebook_link}>{facebook_link}</a></Card.Description> }
          { youtube_link && <Card.Description><a href={youtube_link}>{youtube_link}</a></Card.Description> }
          { instagram_link && <Card.Description><a href={instagram_link}>{instagram_link}</a></Card.Description> }
        </Segment>
        <Segment basic vertical>
          <ExpandableDescription label="Description" value={description} />
        </Segment>
        <Segment basic vertical>
          { video_description && <Card.Description>Video description: <a href={video_description}>{video_description}</a></Card.Description> }
        </Segment>
        <Segment secondary>
          <ValueList name="Languages Offered" values={languages_offered} />
          <ValueList name="Services Provided" values={services_provided} />
          <ValueList name="Keywords" values={keywords} />
        </Segment>
        <Card.Description as="dl">{Object.entries(listing).filter(([dt, dd]) => dd).map(([dt, dd]) => <><dt>{dt}</dt><dd>{dd}</dd></>)}</Card.Description>
      </Card.Content>
    </Card>
  </Ref>
)

const ExpandableDescription = ({ label, value }) => <>
    { label && <Card.Header as="strong">{label}:</Card.Header> }
    { value && <Card.Description className="expandable" tabIndex="0">{value.split(`\n`).map(paragraph => <p>{paragraph}</p>)}</Card.Description> }
</>

const ValueList = ({ name, values }) => values && (
  <List horizontal as="dl" className="value-list">
    <List.Item as="dt">{ name }</List.Item>
    { values.map(dd => <List.Item as="dd">{dd}</List.Item>) }
  </List>
)

function MapMap({ filteredListings, mapRef, cardRefs }) {
  return (
    <Grid.Column>
      <Sticky context={mapRef} offset={14}>
        <Segment as={MapContainer}
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
          <MapMarkers filteredListings={filteredListings} cardRefs={cardRefs} />
        </Segment>
      </Sticky>
    </Grid.Column>
  )
}

function MapMarkers ({filteredListings, cardRefs}) {
  const { markerId } = useParams()
  const map = useMap()
  const mappedListings = filteredListings.filter(({ coords: [ lat, lon ] }) => lat && lon)
  const currentCoords = filteredListings.find(({ guid }) => guid === Number(markerId))?.coords
  useEffect(() => currentCoords && currentCoords[0] && currentCoords[1] && map.setView(currentCoords, 15), [map, currentCoords])

  return (<>
    <MarkerClusterGroup>
      {mappedListings.map(listing =>
        <Marker key={listing.guid} position={listing.coords} icon={markerId === `${listing.guid}` ? greenLMarker : blueLMarker} eventHandlers={{ click: ({latlng}) => map.setView(latlng, 15) }}>
          <listing>
            <div className="popup-container">
              <div>{listing.listing}</div>
              <div>{`${listing.street} ${listing.street2}`}</div>
              <Link to={`/${listing.guid}`} onClick={() => { cardRefs[listing.guid].current.scrollIntoView({behavior: "smooth"}) }} className="listing-show-details">Show Details</Link>
            </div>
          </listing>
            <Tooltip>
              <div className="popup-tooltip">
                <div>{listing.description}</div>
              </div>
            </Tooltip>
        </Marker>
      )}
    </MarkerClusterGroup>
  </>)
}

export default MapPage;
