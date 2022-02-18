import React, { createRef, forwardRef, useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate, useLocation, useSearchParams, NavLink } from "react-router-dom";
import { Container, Segment, Card, Label, Grid, Ref, List, Form, Icon, Dropdown, Button } from "semantic-ui-react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from "react-leaflet";
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-markercluster/dist/styles.min.css';

import { filterListings } from '../utils'
import './Map.css'
import { greenLMarker, blueLMarker } from '../resources/mapIcons'

const getColor = index => [ "green", "teal", "blue", "violet", "purple", "pink", "red", "orange", "yellow", "olive", ][ index % 10 ]


// "Icon" property contains the name of a Font Awesome icon, formatted to be compatible with Semantic UI's naming system. You can find out more (and find your own unique icons) here: https://semantic-ui.com/elements/icon.html
// "Label" is the text to be displayed before the piece of information. It is optional, and not all have it. Some have icons as labels instead. 
// The below values will be mapped in the top grey box area in the card
const contactBox = {
  "phone_1": { label: "phone_1_label", icon: "phone" },
  "phone_2": { label: "phone_2_label", icon: "phone" },
  "crisis_line": { label: "crisis_line_label", icon: "phone" },
  "text_message_instructions": { label: null, icon: "comment alternate" },
  "website": { label: null, icon: "globe" },
  "program_email": { label: null, icon: "mail outline", mailto: true },
  "twitter_link": { label: null, icon: "twitter", hyperlink: true },
  "facebook_link": { label: null, icon: "facebook", hyperlink: true },
  "youtube_link": { label: null, icon: "youtube", hyperlink: true },
  "instagram_link": { label: null, icon: "instagram", hyperlink: true },
  "blog_link": { label: null, icon: "linkify", hyperlink: true },
}


// twitter, facebook, youtube, instagram, 
// linkify (icon for blog_link)

const descriptionBox = {
  "description": { label: "Description" },

}

const bottomBox = {
  "eligibility_requirements": { label: "Eligibility" },
  "financial_information": { label: "Cost" },
  "languages_offered": { label: "Languages" },


}

function MapPage({ listings, listingMetadata }) {
  const [ searchParams, ] = useSearchParams()
  const [ search, setSearch ] = useState()

  // Read initial saved card vals from local storage.
  const [savedCards, setSavedCards] = useState(() => {
    // Don't combine the two lines below. It will break this function.
    const cards = localStorage.getItem('cards')
    const initialCards = JSON.parse(cards)
    return initialCards?.saved ?? []
  })
  
  const handleSave = (id, reset=false) => {
    if (reset) {
      setSavedCards([])
      return
    }
    savedCards.includes(id) ? setSavedCards(savedCards.filter(e => e !== id)) : setSavedCards([...savedCards, id])
  }

  useEffect(() => {
    localStorage.setItem("cards", JSON.stringify({saved: savedCards}))
  }, [savedCards])

  // Icon info is also now included in the route "/api/listing-meta"
  // Note: The operations for calculating listingCategories and listingCities were moved to the BE
  const { listingCategoryIcons, listingCategories, listingCities } = listingMetadata

  // let filteredListings = filterListings(listings, searchParams, search)
  const filteredListings = useMemo(() => filterListings(listings, searchParams, search), [listings, searchParams, search])


  const cardRefs = listings.reduce((cardRefs, listing) => ({...cardRefs, [listing.guid]: createRef()}), {})
  const mapRef = createRef()

  // This data comes from the API now. These are the dropdown options for the location input box
  const locationDropdownOptions = Object.entries(listingCities).map(([cityName, count]) => {
    return { key: cityName,  text: `${cityName} (${count})`, value: cityName }
  })

  return (<>
    <MapNavigation listingCategories={listingCategories} listingCategoryIcons={listingCategoryIcons} search={search} setSearch={setSearch} locationDropdownOptions={locationDropdownOptions}/>
    <Container as="main" id="map-page">
      <MapCards listings={filteredListings} cardRefs={cardRefs} mapRef={mapRef} savedCards={savedCards} handleSave={handleSave} />
      <div className='leaflet-container-div'>
        <MapMap listings={filteredListings} cardRefs={cardRefs} ref={mapRef} savedCards={savedCards} handleSave={handleSave} />
        <SaveButtons setSearch={setSearch} savedCards={savedCards} handleSave={handleSave} />
      </div>
    </Container>
  </>)
}

function MapNavigation({ listingCategories, listingCategoryIcons, search, setSearch, locationDropdownOptions }) {
  const navigate = useNavigate()
  const [ searchParams, setSearchParams ] = useSearchParams()
  return (<>
    <Segment as="nav" id="map-nav" color="black" basic vertical inverted>
      <Grid as="menu" columns={Object.keys(listingCategories).length} doubling container textAlign="center">
      { Object.entries(listingCategories).map(([parentCategory, subCategories]) =>
        <Dropdown as="li" key={parentCategory} className="column" icon={null} text={<><Icon size="big" name={listingCategoryIcons[parentCategory]?.icon} /><header>{parentCategory}</header></>}>
          <Dropdown.Menu as="menu">
          { Object.entries(subCategories).map(([subCategory, count]) =>
            <Dropdown.Item key={subCategory} as={NavLink} text={`${subCategory} (${count})`} to={`/?${new URLSearchParams({...Object.fromEntries(searchParams), category: `${parentCategory}: ${subCategory}` }).toString()}`} />
          )}
          </Dropdown.Menu>
        </Dropdown>
      ) }
      </Grid>
      <Form size="tiny" className="container">
        <Grid>
          <Grid.Column as={Form.Input} width={4} type="number" placeholder="Age" value={searchParams.get('age') || ``} onChange={(e, {value}) => setSearchParams({ ...Object.fromEntries(searchParams), age: value })} />
          {/* location  */}
          <Grid.Column width={4}>
          <Dropdown placeholder='Location' fluid search selection options={locationDropdownOptions} value={searchParams.get('city') || ``} onChange={(e, {value}) => setSearchParams({ ...Object.fromEntries(searchParams), city: value })}
          />
          </Grid.Column>
          <Grid.Column as={Form.Input} width={8} tabIndex="1" placeholder="Search" action={{icon: "search"}} onFocus={() => navigate(`/?${searchParams.toString()}`)} onChange={(e, {value}) => setSearch(value)} />
        </Grid>
        <Label.Group as="menu" columns={[...searchParams].length} className="doubling container">
          { [...searchParams].map(([key, value]) => value && <Label key={key} basic color="pink"><strong>{key.replace(/_/ig,` `)}:</strong> {value} <Icon name="delete" onClick={() => { searchParams.delete(key); setSearchParams(searchParams) }} /></Label> ) }
        </Label.Group>
      </Form>
    </Segment>
  </>)
}

function MapCards({ listings, cardRefs, mapRef, savedCards, handleSave }) {
  const location = useLocation()
  const { markerId } = useParams()
  const [showAll, setShowAll] = useState(false)
  const currentCard = cardRefs[markerId]

  useEffect(() => {
    if (location.state?.scrollToMap) mapRef.current?.scrollIntoView({ behavior: 'smooth' })
    else if (currentCard) currentCard.current?.scrollIntoView({behavior: "smooth"})
  }, [currentCard, location, mapRef])

  return (
    <Card.Group as="section" itemsPerRow="1">
      {/* {listings.map((listing, index) => <TestCard key={listing.guid} listing={listing} index={index} ref={cardRefs[listing.guid]} mapRef={mapRef} saved={savedCards?.includes(listing.guid)} handleSave={handleSave} />)} */}
      {showAll ? listings.map((listing, index) => <MapCard key={listing.guid} listing={listing} index={index} ref={cardRefs[listing.guid]} mapRef={mapRef} saved={savedCards?.includes(listing.guid)} handleSave={handleSave} />) 
      :listings.filter((listing, index) => index <= 55).map((listing, index) => <MapCard key={listing.guid} listing={listing} index={index} ref={cardRefs[listing.guid]} mapRef={mapRef} saved={savedCards?.includes(listing.guid)} handleSave={handleSave} />)} 
      {(listings.length > 55 && showAll === false) && <Button fluid color='grey' icon='arrow down' content={`Show ${listings.length - 55} more results`} onClick={() => setShowAll(true)} />}
    </Card.Group>
  )
}

const CardCornerDropdown = ({ index, guid, full_address='', mapRef }) => {
  const navigate = useNavigate()
  return (
    <Dropdown icon={<Icon name='ellipsis horizontal' color='grey' />} direction='left'>
      <Dropdown.Menu>
        <Dropdown.Item text='Copy link'icon='share alternate'
        onClick={() => navigator.clipboard.writeText(`oregonyouthresourcemap.com/#/${guid}`)}
        />
        {full_address && <Dropdown.Item style={{ cursor: 'pointer' }} onClick={() => navigate(`/${guid}`, { state: { scrollToMap: true } }) } text='View on map' icon={{ name: 'map outline', color: getColor(index)}}/>}
        <Dropdown.Item as="a" href='https://oregonyouthresourcemap.com/#/suggest' target='_blank' text='Comment'icon={{ name: 'chat', color: getColor(index)}} />
      </Dropdown.Menu>
    </Dropdown>
  )
}

// TODO: Move these and/or rewrite with proper CSS classes 
const starStyle = { marginRight: '.65em' }
const labelDivStyle = { display: 'flex', justifyContent: 'space-between' }
const cardStyle = { maxWidth: '525px' }
const tagStyle = { color: 'grey' }

const MapCard = forwardRef(({ mapRef, listing: { guid, category, coords, parent_organization, full_name, full_address, description, text_message_instructions, phone_1, phone_label_1, phone_1_ext, phone_2, phone_label_2, phone_2_ext, crisis_line_number, crisis_line_label, website, blog_link, twitter_link, facebook_link, youtube_link, instagram_link, program_email, languages_offered, services_provided, keywords, min_age, max_age, eligibility_requirements, ...listing}, index, saved, handleSave}, ref) => {
  const navigate = useNavigate()
  const [ searchParams, setSearchParams ] = useSearchParams()
  const cardColor = getColor(index)

  return (
    <Ref innerRef={ref}>
      <Card as="article" color={cardColor} centered raised className="map-card" style={cardStyle}>
        <Card.Content>
        {/* Extra divs are necessary for flex box spacing  */}
        <div style={labelDivStyle}>
          <Label as={Link} to={parent_organization ? `/?parent_organization=${encodeURIComponent(parent_organization)}` : `/?full_name=${encodeURIComponent(full_name)}`} ribbon color={cardColor} style={{marginBottom: `1em`}}>{parent_organization || full_name}</Label>
          <div> 
            <Icon name={saved ? 'star' : 'star outline'} color={cardColor} style={starStyle} onClick={() => handleSave(guid)} />
            {CardCornerDropdown({index, guid, full_address, mapRef})}
          </div>
        </div>
          {/* Card title  */}
          <Card.Header><Link to={`/${guid}`}>{full_name}</Link></Card.Header>
          
          {/* Address  */}
          { full_address && <Card.Meta style={{ cursor: 'pointer' }} onClick={() => { navigate(`/${guid}`, { state: { scrollToMap: true } }) }} title="View on map"><Icon name="map marker alternate" /> {full_address}</Card.Meta> }

          {/* Contact box  */}
          <Segment secondary>
            { full_address && <Card.Description><Icon name="map marker alternate" /><a target="_blank" rel="noreferrer" href={`https://www.google.com/maps/dir//${encodeURIComponent(full_address)}`}>Get Directions <sup><Icon size="small" name="external" /></sup></a></Card.Description> }

            {/* {Object.entries(contactBox).filter(([k, v]) => listing[`${k}`]).map((e) => (
              <Card.Description>{e.icon && <Icon name={e.icon} />}</Card.Description>
            ))} */}

            { phone_1 && <Card.Description><Icon name="phone" />{ phone_label_1 && `${phone_label_1}: ` }<a target="_blank" rel="noreferrer" href={`tel:${phone_1}`}>{phone_1}</a> { phone_1_ext && phone_1_ext}</Card.Description> }
            { phone_2 && <Card.Description><Icon name="phone" />{ phone_label_2 && `${phone_label_2}: ` }<a target="_blank" rel="noreferrer" href={`tel:${phone_2}`}>{phone_2}</a> { phone_2_ext && phone_2_ext}</Card.Description> }
            { crisis_line_number && <Card.Description><Icon name="phone" />{crisis_line_label}: <a target="_blank" rel="noreferrer" href={`tel:${crisis_line_number}`}>{crisis_line_number}</a></Card.Description> }
            { text_message_instructions && <Card.Description><Icon name="comment alternate" /> {text_message_instructions}</Card.Description> }
            { website && <Card.Description><Icon name="globe" /><a target="_blank" rel="noreferrer" href={website}>Website</a></Card.Description> }
            { blog_link && <Card.Description><Icon name="globe" /><a target="_blank" rel="noreferrer" href={blog_link}>{blog_link}</a></Card.Description> }
            { twitter_link && <Card.Description><Icon name="twitter" /><a target="_blank" rel="noreferrer" href={twitter_link}>{twitter_link}</a></Card.Description> }
            { facebook_link && <Card.Description><Icon name="facebook" /><a target="_blank" rel="noreferrer" href={facebook_link}>{facebook_link}</a></Card.Description> }
            { youtube_link && <Card.Description><Icon name="youtube" /><a target="_blank" rel="noreferrer" href={youtube_link}>{youtube_link}</a></Card.Description> }
            { instagram_link && <Card.Description><Icon name="instagram" /><a target="_blank" rel="noreferrer" href={instagram_link}>{instagram_link}</a></Card.Description> }
            { program_email && <Card.Description><Icon name="mail outline" /><a target="_blank" rel="noreferrer" href={`mailto:${program_email}`}>{program_email}</a></Card.Description> }
          </Segment>
          <Segment basic vertical>
            <ExpandableDescription label="Description" value={description} />
          </Segment>
          {/* Category  */}
            <Card.Description><NavLink to={`/?category=${encodeURIComponent(category)}`} style={{ color: 'inherit' }}><Card.Header as="strong">{category.split(':')[0]}:</Card.Header> {category.split(':')[1]}</NavLink></Card.Description>
          {/* Post description text */}
          <Segment secondary>
            { (min_age && max_age) ? <Card.Description><Card.Header as="strong">Age:</Card.Header> {min_age}-{max_age}</Card.Description>
            : (min_age && !max_age) ? <Card.Description><Card.Header as="strong">Minimum age served:</Card.Header> {min_age}</Card.Description>
            : (!min_age && max_age) ? <Card.Description><Card.Header as="strong">Maximum age served:</Card.Header> {max_age}</Card.Description>
            : null }
            { eligibility_requirements && <Card.Description><Card.Header as="strong">Eligibility:</Card.Header> {eligibility_requirements}</Card.Description> }
            { languages_offered && <ValueList name="Languages" values={languages_offered} /> }
            { services_provided && <ValueList name="Services" values={services_provided} /> }
          </Segment> 
          {/* <Card.Description as="dl">{Object.entries(listing).filter(([dt, dd]) => dd).map(([dt, dd], i) => <><dt key={dt}>{dt}</dt><dd key={i}>{dd}</dd></>)}</Card.Description> */}
        </Card.Content>
        <Card.Content extra>
          { keywords ? keywords.map((keyword, i) => <NavLink style={tagStyle}
            to={`/?${new URLSearchParams({...Object.fromEntries(searchParams), tag: `${keyword}` }).toString()}`} key={keyword} onClick={() => setSearchParams({ ...Object.fromEntries(searchParams), tag: keyword })}>&nbsp; &nbsp;# {keyword}</NavLink> )
          : <NavLink to={`/?category=${encodeURIComponent(category)}`} style={{ color: 'inherit' }}># {category.split(':')[1]}</NavLink>}
        </Card.Content>
      </Card>
    </Ref>
  )
})

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


const MapMap = forwardRef(({ listings, cardRefs }, ref) => {
  return (
    <Ref innerRef={ref}>
      <Segment as={MapContainer} center={[44.0489388,-123.0919415]} zoom={10} minZoom={8} maxZoom={18} scrollWheelZoom={false} tap={true} dragging={true} touchZoom={true}>
        <TileLayer attribution="" url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
        <MapMarkers listings={listings} cardRefs={cardRefs} />
      </Segment>
    </Ref>
  )
})

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

function SaveButtons({savedCards, handleSave}) {

  const handleShow = () => {
    // Get cards array from local storage. 
    // TODO: have this render a "Bookmarked" cards page
    let cards = localStorage.getItem('cards')
    cards = JSON.parse(cards)
    console.log('handle show', cards)
    console.log('^^ this should match', savedCards)
  }

return(<>
    <div className='save-buttons' style={{ display: 'flex', justifyContent: 'flex-end'}}>
      <Button 
        disabled={savedCards?.length === 0}
        onClick={() => handleShow()}
        content='View Saved' icon='star outline' size='tiny' basic />
      <Button 
        disabled={savedCards?.length === 0}
        onClick={() => handleSave(null, true)}
        content='Clear Saved' icon='delete' size='tiny' basic  />
    </div>
  </>)
}


export default MapPage;
