import React, { createRef, forwardRef, useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate, useSearchParams, NavLink } from "react-router-dom";
import { Container, Segment, Card, Label, Grid, Ref, Sticky, List, Form, Icon, Dropdown } from "semantic-ui-react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from "react-leaflet";
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { get, set } from 'lodash/fp'
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-markercluster/dist/styles.min.css';

import { filterListings } from '../utils'
import './Map.css'
import { greenLMarker, blueLMarker } from '../resources/mapIcons'

const getColor = index => [ "green", "teal", "blue", "violet", "purple", "pink", "red", "orange", "yellow", "olive", ][ index % 10 ]
const getCategoryIcon = category => ({ "Leadership Opportunities": "flag", "Housing & Shelter": "home", "Work & Employment": "briefcase", "Mental Health": "heartbeat", "Specialized Assistance": "handshake", "Legal": "balance scale", "Education": "graduation cap", "Day Services & Drop-in": "sun", "Care & Safety": "hand holding heart", })[category]

function MapPage({ listings }) {
  const [ searchParams, ] = useSearchParams()
  const [ search, setSearch ] = useState()
  // todo: memoize these lines:
  const categories = listings.reduce((categories, { category: fullCategory }) => {
    const [category, subcategory] = fullCategory.split(`: `)
    return set(`[${category}][${subcategory}]`)(1 + (get(`[${category}][${subcategory}]`)(categories) ?? 0))(categories)
  }, {})
  const filteredListings = filterListings(listings, searchParams, search)
  const cardRefs = listings.reduce((cardRefs, listing) => ({...cardRefs, [listing.guid]: createRef()}), {})

  return (<>
    <MapNavigation categories={categories} search={search} setSearch={setSearch} />
    <Container as="main">
      <MapCards listings={filteredListings} cardRefs={cardRefs} />
      <MapMap listings={filteredListings} cardRefs={cardRefs} />
    </Container>
  </>)
}

function MapNavigation({ categories, search, setSearch }) {
  const navigate = useNavigate()
  const [ searchParams, setSearchParams ] = useSearchParams()
  return (<>
    <Segment as="nav" color="black" basic vertical inverted>
      <Grid as="menu" columns={Object.keys(categories).length} doubling container textAlign="center">
      { Object.entries(categories).map(([category, subcategories]) =>
        <Dropdown as="li" key={category} className="column" icon={null} text={<><Icon size="big" name={getCategoryIcon(category)} /><header>{category}</header></>}>
          <Dropdown.Menu as="menu">
          { Object.entries(subcategories).map(([subcategory, count]) =>
            <Dropdown.Item key={subcategory} as={NavLink} text={`${subcategory} (${count})`} to={`/?${new URLSearchParams({...Object.fromEntries(searchParams), category: `${category}: ${subcategory}` }).toString()}`} />
          )}
          </Dropdown.Menu>
        </Dropdown>
      ) }
      </Grid>
      <Form size="tiny" className="container">
        <Grid>
          <Grid.Column as={Form.Input} width={4} type="number" placeholder="Age" value={searchParams.get('age')} onChange={(e, {value}) => setSearchParams({ ...Object.fromEntries(searchParams), age: value })} />
          <Grid.Column as={Form.Input} width={12} tabIndex="1" placeholder="Search" action={{icon: "search"}} onFocus={() => navigate(`/?${searchParams.toString()}`)} onChange={(e, {value}) => setSearch(value)} />
        </Grid>
        <Label.Group as="menu" columns={[...searchParams].length} doubling container>
          { [...searchParams].map(([key, value]) => value && <Label basic color="pink"><strong>{key.replace(/_/ig,` `)}:</strong> {value} <Icon name="delete" onClick={() => { searchParams.delete(key); setSearchParams(searchParams) }} /></Label> ) }
        </Label.Group>
      </Form>
    </Segment>
  </>)
}

function MapCards({ listings, cardRefs }) {
  const { markerId } = useParams()
  const currentCard = cardRefs[markerId]
  useEffect(() => currentCard && currentCard.current?.scrollIntoView({behavior: "smooth"}), [currentCard])
  return (
    <Card.Group as="section" itemsPerRow="1">
      {listings.map((listing, index) => <MapCard key={listing.guid} listing={listing} index={index} ref={cardRefs[listing.guid]} />)}
    </Card.Group>
  )
}

const MapCard = forwardRef(({ listing: { guid, category, coords, parent_organization, full_name, full_address, description, phone_1, phone_label_1, phone_2, phone_label_2, crisis_line_number, crisis_line_label, website, blog_link, twitter_link, facebook_link, youtube_link, instagram_link, video_description, languages_offered, services_provided, keywords, min_age, max_age, eligibility_requirements, ...listing}, index}, ref) =>
  <Ref innerRef={ref}>
    <Card as="article" color={getColor(index)} centered raised className="map-card">
      <Card.Content>
        <Label as={Link} to={parent_organization ? `/?parent_organization=${encodeURIComponent(parent_organization)}` : `/?full_name=${encodeURIComponent(full_name)}`} ribbon color={getColor(index)} style={{marginBottom: `1em`}}>{parent_organization || full_name}</Label>
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

function MapMap({ listings, cardRefs }) {
  return (
    <Segment as={MapContainer} center={[44.0489388,-123.0919415]} zoom={10} minZoom={8} maxZoom={18} scrollWheelZoom={true} tap={true} dragging={true} touchZoom={true}>
      <TileLayer attribution="" url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
      <MapMarkers listings={listings} cardRefs={cardRefs} />
    </Segment>
  )
}

function MapMarkers ({listings, cardRefs}) {
  const { markerId } = useParams()
  const map = useMap()
  const mappedListings = useMemo(() => listings.filter(({ coords: [ lat, lon ] }) => lat && lon), [listings])
  const currentCoords = useMemo(() => listings.find(({ guid }) => guid === Number(markerId))?.coords, [listings, markerId])
  const bounds = useMemo(() => mappedListings.map(({coords}) => coords), [mappedListings])
  useEffect(() => bounds.length && map.fitBounds(bounds), [map, bounds])
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
