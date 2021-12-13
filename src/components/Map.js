import { createRef, forwardRef, useEffect, useState } from "react";
import { Link, useParams, useNavigate, useSearchParams, NavLink } from "react-router-dom";
import { Container, Segment, Card, Label, Grid, Ref, Sticky, List, Form, Icon } from "semantic-ui-react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from "react-leaflet";
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-markercluster/dist/styles.min.css';

import { filterListings } from '../utils'
import './Map.css'
import { greenLMarker, blueLMarker } from '../resources/mapIcons'

const getColor = index => [ "red", "orange", "yellow", "olive", "green", "teal", "blue", "violet", "purple", "pink", "brown" ][ index % 11 ]

function MapPage({ listings }) {
  const navigate = useNavigate()
  const [ searchParams, setSearchParams ] = useSearchParams()
  const [ search, updateSearch ] = useState()
  const mapRef = createRef()
  // todo: memoize these lines:
  const filteredListings = filterListings(listings, searchParams, search)
  const cardRefs = listings.reduce((cardRefs, listing) => ({...cardRefs, [listing.guid]: createRef()}), {})

  return (<>
    <Segment as={Form} color="pink" basic inverted>
      <Container as={Form.Group}>
        <Form.Input size="large" width={4} type="number" placeholder="Age" onChange={(e, {value}) => setSearchParams({ ...Object.fromEntries(searchParams.entries()), age: value })} />
        <Form.Input size="large" width={12} tabIndex="1" placeholder="Search" action={{icon: "search"}} onFocus={() => navigate(`/?${searchParams.toString()}`)} onChange={(e, {value}) => updateSearch(value)} />
      </Container>
    </Segment>
    <Ref innerRef={mapRef}>
      <Container fluid as={Grid} stackable doubling reversed='computer' columns={2}>
        <MapMap listings={filteredListings} mapRef={mapRef} cardRefs={cardRefs} />
        <MapCards listings={filteredListings} cardRefs={cardRefs} />
      </Container>
    </Ref>
  </>)
}

function MapCards({ listings, cardRefs }) {
  const { markerId } = useParams()
  const currentCard = cardRefs[markerId]
  useEffect(() => currentCard && currentCard.current?.scrollIntoView({behavior: "smooth"}), [currentCard])
  return (
    <Grid.Column as={Card.Group} itemsPerRow="1">
      {listings.map((listing, index) => <MapCard key={listing.guid} listing={listing} index={index} ref={cardRefs[listing.guid]} />)}
    </Grid.Column>
  )
}

const MapCard = forwardRef(({ listing: { guid, category, coords, parent_organization, full_name, full_address, description, phone_1, phone_label_1, phone_2, phone_label_2, crisis_line_number, crisis_line_label, website, blog_link, twitter_link, facebook_link, youtube_link, instagram_link, video_description, languages_offered, services_provided, keywords, min_age, max_age, eligibility_requirements, ...listing}, index}, ref) =>
  <Ref innerRef={ref}>
    <Card color={getColor(index)} centered raised className="map-card">
      <Card.Content>
        { !!parent_organization && <Label as={Link} to={`/?parent_organization=${encodeURIComponent(parent_organization)}`} ribbon color={getColor(index)} style={{marginBottom: `1em`}}>{parent_organization}</Label> }
        <Card.Header><Link to={`/${guid}`}>{full_name}</Link></Card.Header>
        <Card.Meta><Link to={`/${guid}`}>{full_address}</Link></Card.Meta>
        <Segment secondary>
          { full_address && <Card.Description><Icon name="map marker alternate" /><a target="_blank" rel="noreferrer" href={`https://www.google.com/maps/dir//${encodeURIComponent(full_address)}`}>Get Directions <sup><Icon size="small" name="external" /></sup></a></Card.Description> }
          { phone_1 && <Card.Description><Icon name="phone" />{phone_label_1}: <a target="_blank" rel="noreferrer" href={`tel:${phone_1}`}>{phone_1}</a></Card.Description> }
          { phone_2 && <Card.Description><Icon name="phone" />{phone_label_2}: <a target="_blank" rel="noreferrer" href={`tel:${phone_2}`}>{phone_2}</a></Card.Description> }
          { crisis_line_number && <Card.Description><Icon name="phone" />{crisis_line_label}: <a target="_blank" rel="noreferrer" href={`tel:${crisis_line_number}`}>{crisis_line_number}</a></Card.Description> }
          { website && <Card.Description><Icon name="globe" /><a target="_blank" rel="noreferrer" href={website}>Website</a></Card.Description> }
          { blog_link && <Card.Description><Icon name="globe" /><a target="_blank" rel="noreferrer" href={blog_link}>{blog_link}</a></Card.Description> }
          { twitter_link && <Card.Description><Icon name="twitter" /><a target="_blank" rel="noreferrer" href={twitter_link}>{twitter_link}</a></Card.Description> }
          { facebook_link && <Card.Description><Icon name="facebook" /><a target="_blank" rel="noreferrer" href={facebook_link}>{facebook_link}</a></Card.Description> }
          { youtube_link && <Card.Description><Icon name="youtube" /><a target="_blank" rel="noreferrer" href={youtube_link}>{youtube_link}</a></Card.Description> }
          { instagram_link && <Card.Description><Icon name="instagram" /><a target="_blank" rel="noreferrer" href={instagram_link}>{instagram_link}</a></Card.Description> }
        </Segment>
        <Segment basic vertical>
          <ExpandableDescription label="Description" value={description} />
        </Segment>
        <Segment basic vertical>
          { video_description && <Card.Description>Video description: <a href={video_description}>{video_description}</a></Card.Description> }
        </Segment>
        <Segment secondary>
          { (min_age || max_age) && <Card.Description><Card.Header as="strong">Age:</Card.Header> {[ min_age, max_age ].join(`-`)}</Card.Description> }
          { eligibility_requirements && <Card.Description><Card.Header as="strong">Eligibility Requirements:</Card.Header> {eligibility_requirements}</Card.Description> }
          <ValueList name="Languages Offered" values={languages_offered} />
          <ValueList name="Services Provided" values={services_provided} />
          <ValueList name="Keywords" values={keywords} />
        </Segment>
        {/* <Card.Description as="dl">{Object.entries(listing).filter(([dt, dd]) => dd).map(([dt, dd], i) => <><dt key={dt}>{dt}</dt><dd key={i}>{dd}</dd></>)}</Card.Description> */}
      </Card.Content>
      <Card.Content extra><NavLink to={`/?category=${encodeURIComponent(category)}`}># {category}</NavLink></Card.Content>
    </Card>
  </Ref>
)

const ExpandableDescription = ({ label, value }) => <>
    { label && <Card.Header as="strong">{label}:</Card.Header> }
    { value && <Card.Description className="expandable" tabIndex="0">{value.split(`\n`).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</Card.Description> }
</>

const ValueList = ({ name, values }) => values && (
  <List horizontal as="dl" className="value-list">
    <List.Item key={name} as="dt">{ name }</List.Item>
    { values.map(dd => <List.Item key={dd} as="dd">{dd}</List.Item>) }
  </List>
)

function MapMap({ listings, mapRef, cardRefs }) {
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
          <MapMarkers listings={listings} cardRefs={cardRefs} />
        </Segment>
      </Sticky>
    </Grid.Column>
  )
}

function MapMarkers ({listings, cardRefs}) {
  const { markerId } = useParams()
  const map = useMap()
  const mappedListings = listings.filter(({ coords: [ lat, lon ] }) => lat && lon)
  const currentCoords = listings.find(({ guid }) => guid === Number(markerId))?.coords
  useEffect(() => currentCoords && currentCoords[0] && currentCoords[1] && map.setView(currentCoords, 15), [map, currentCoords])

  return (<>
    <MarkerClusterGroup>
      {mappedListings.map(listing =>
        <Marker key={listing.guid} position={listing.coords} icon={markerId === `${listing.guid}` ? greenLMarker : blueLMarker} eventHandlers={{ click: ({latlng}) => map.setView(latlng) }}>
          <Tooltip>{listing.full_name}</Tooltip>
          <Popup>
            <Card style={{ border: `none`, boxShadow: `none` }}>
              <Card.Content>
                <Card.Header><Link to={`/${listing.guid}`}>{listing.full_name}</Link></Card.Header>
                <Card.Meta>{listing.full_address}</Card.Meta>
                <Segment basic vertical>
                  <Card.Content>
                    <div className="description">{listing.description}</div>
                  </Card.Content>
                </Segment>
                <Link to={`/${listing.guid}`} onClick={() => { cardRefs[listing.guid].current?.scrollIntoView({behavior: "smooth"}) }} className="listing-show-details">Show Details</Link>
                </Card.Content>
            </Card>
          </Popup>
        </Marker>
      )}
    </MarkerClusterGroup>
  </>)
}

export default MapPage;
