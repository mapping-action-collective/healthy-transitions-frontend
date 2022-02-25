import React, { createRef, forwardRef, useEffect, useMemo, useState } from "react";
import { debounce } from "lodash"
import { Link, useParams, useNavigate, useLocation, useSearchParams, NavLink } from "react-router-dom";
import { Container, Segment, Card, Label, Grid, Ref, List, Form, Icon, Dropdown, Button } from "semantic-ui-react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from "react-leaflet";
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { useSessionStorage } from './../hooks/useSessionStorage'

import 'leaflet/dist/leaflet.css';
import 'react-leaflet-markercluster/dist/styles.min.css';

import { filterListings } from '../utils'
import './Map.css'
import { greenLMarker, blueLMarker } from '../resources/mapIcons'
import { getCityCount, getColor, formatSocialMediaUrl, titleCaseKey } from '../utils'

function MapPage({ listings, listingMetadata }) {
  const [ searchParams, ] = useSearchParams()
  const [ search, setSearch ] = useState()
  const navigate = useNavigate()
  // Saved listings write to session storage and persist. Hidden listings reset on page refresh.
  const [saved, setSaved] = useSessionStorage('saved', [])
  const [hidden, setHidden] = useState([])
  const [showSaved, setShowSaved] = useState(false)

  const handleSave = (id, reset=false) => {
    if (reset) { setSaved([]); return; }
    saved.includes(id) ? setSaved(saved.filter(e => e !== id)) : setSaved([...saved, id])
  }

  const handleHide = (id, reset=false) => {
    if (reset) { setHidden([]); return; }
    // Remove from saved if it's saved. UX gets wonky otherwise.
    saved.includes(id) && setSaved(saved.filter(e => e !== id))
    setHidden([...hidden, id])
  }

  // "saved" is an array of saved card guids
  const handleShowSaved = () => {
    // If saved is already showing, clear the url bar
    if (showSaved || searchParams.get('saved')) {
      setShowSaved(!showSaved)
      navigate({ pathname: '/', search: ''})
    } else if (saved.length > 0) {
      // set state so that the UI components can update
      setShowSaved(!showSaved)
      const paramsString = saved.join("&saved=")
      navigate({ pathname: '/', search: `?saved=${paramsString}` })
    } 
  }

  const { listingCategoryIcons, listingCategories } = listingMetadata

  const debouncedSearch = debounce((value) => { setSearch(value) }, 300);

  let filteredListings = useMemo(() => filterListings(listings, searchParams, search, hidden), [listings, searchParams, search, hidden])
  
  let listingCities = getCityCount(filteredListings ?? {})
  const cardRefs = listings.reduce((cardRefs, listing) => ({...cardRefs, [listing.guid]: createRef()}), {})
  const mapRef = createRef()

  return (<>
    <MapSearch listingCategories={listingCategories} listingCategoryIcons={listingCategoryIcons} debouncedSearch={debouncedSearch} listingCities={listingCities} saved={saved} handleSave={handleSave} handleHide={handleHide} hidden={hidden} showSaved={showSaved} handleShowSaved={handleShowSaved} />
    <Container as="main" id="map-page">
      <MapCards listings={filteredListings} cardRefs={cardRefs} mapRef={mapRef} saved={saved} handleSave={handleSave} handleHide={handleHide} />
      <MapMap listings={filteredListings} cardRefs={cardRefs} ref={mapRef} />
    </Container>
  </>)
}

function MapSearch({ listingCategories, listingCategoryIcons, debouncedSearch, listingCities, saved, showSaved, handleShowSaved, hidden, handleHide, handleSave }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [ searchParams, setSearchParams ] = useSearchParams()
  const [ age, setAge ] = useState(searchParams.get('age') || ``)

  // When user clears the params, this clears the input value as well
  useEffect(() => {
    setAge(searchParams.get('age') ?? '')
  },[searchParams])

  const debouncedAge = debounce((value) => { setSearchParams({ ...Object.fromEntries(searchParams), age: value })}, 500)

  // Set the UI state quickly for better UX, but debounce the actual search logic.
  // Note: the "min" and "max" fields on our number input aren't working. Probably a Semantic bug. Implemented manually here.
  const handleAge = value => { if (value >= 0 && value <100) { setAge(value); debouncedAge(value); }}

  const handleCity = value => setSearchParams({ ...Object.fromEntries(searchParams), city: value })
  // This data comes from the API. It's optional, so null check it 
  const locationDropdownOptions = Object.entries(listingCities ?? {}).map(([cityName, count]) => {
    return { key: cityName,  text: `${cityName} (${count})`, value: cityName }
  })

  return (<>
    <Segment as="nav" id="map-nav" color="black" basic vertical inverted>
      <Grid as="menu" columns={Object.keys(listingCategories).length} doubling container textAlign="center">
      { Object.entries(listingCategories).map(([parentCategory, subCategories]) =>
        <Dropdown as="li" className="column" icon={null}
          key={parentCategory} 
          text={<>
            <Icon size="big" name={listingCategoryIcons[parentCategory]?.icon} />
            <header>{parentCategory}</header></>
          }>

          <Dropdown.Menu as="menu">
          {Object.entries(subCategories).map(([subCategory, count]) =>
            <Dropdown.Item key={subCategory} as={NavLink} 
              text={`${subCategory} (${count})`} 
              to={`/?${new URLSearchParams({...Object.fromEntries(searchParams), category: `${parentCategory}: ${subCategory}` }).toString()}`} />
          )}
          </Dropdown.Menu>
        </Dropdown>
      ) }
      </Grid>
      <Form size="tiny" className="container">
        <Grid>
        <Grid.Column 
            as={Form.Input} width={4} type="number" placeholder="Age"
            value={age} 
            onChange={(e, {value}) => handleAge(value)}  
           />
        {/* Location Dropdown  */}
        {(locationDropdownOptions.length > 0) && <Grid.Column width={4}>
          <Dropdown placeholder='Location' fluid search selection 
            options={locationDropdownOptions} 
            value={searchParams.get('city') || ``} 
            onChange={(e, {value}) => handleCity(value)}
          />
          </Grid.Column>}
          <Grid.Column 
            as={Form.Input} width={locationDropdownOptions.length > 0 ? 8 : 12} tabIndex="1" 
            placeholder="Search" 
            action={{icon: "search"}} 
            onFocus={() => navigate(`/?${searchParams.toString()}`)} 
            onChange={(e, {value}) => debouncedSearch(value)} />
        </Grid>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '.25em'}}>
          <Label.Group columns={[...searchParams].length} className="doubling container">
            {!location.search.includes('saved') &&
            [...searchParams].map(([key, value]) => value && <Label key={key} basic color="blue"><strong>{titleCaseKey(key.replace(/_/ig,` `))}:</strong> {value} <Icon name="delete" onClick={() => { searchParams.delete(key); setSearchParams(searchParams) }} /></Label> ) }
            {/* <Button basic floated='right' inverted color='teal' size='mini' content='Clear Saved' disabled={saved.length === 0} onClick={() => handleSave(null, true)} /> */}
            {/* <Button basic floated='right' inverted color='teal' size='mini' icon='eye slash outline' content='Clear Hidden' disabled={hidden.length === 0} onClick={() => handleHide(null, true)} /> */}
            <Button basic floated='right' inverted color='teal' size='tiny' 
              icon={searchParams.get('saved') ? 'list' : 'star outline'}
              content={(searchParams.get('saved')) ? 'Show All' : 'Show Saved'}
              disabled={saved.length === 0 && !searchParams.get('saved')} 
              onClick={() => handleShowSaved(saved)}
              />
          </Label.Group>
        </div>
      </Form>
    </Segment>
  </>)
}

const showButtonStyle = {
  width: '95%',
  marginLeft: '2.5%',
  marginTop: '15px',
  marginBottom: '25px',
}

function MapCards({ listings, cardRefs, mapRef, saved, handleSave, handleHide }) {
  const location = useLocation()
  const { markerId } = useParams()
  const [showAll, setShowAll] = useState(false)
  const currentCard = cardRefs[markerId]

  useEffect(() => {
    if (location.state?.scrollToMap) mapRef.current?.scrollIntoView({ behavior: 'smooth' })
    else if (currentCard) currentCard.current?.scrollIntoView({behavior: "smooth"})
  }, [currentCard, location, mapRef])
  
  // Limit the number of results shown after search, for speed optimization. User can click "Show More" button to reveal the additional hidden results (all results.)
  return (
    <Card.Group as="section" itemsPerRow="1">
      {listings?.length === 0 && <div style={{textAlign: 'center'}}>No Results Found.</div>}
      {showAll ? listings.map((listing, index) => <MapCard key={listing.guid} listing={listing} index={index} ref={cardRefs[listing.guid]} mapRef={mapRef} saved={saved?.includes(listing.guid)} handleSave={handleSave} handleHide={handleHide} />) 
      : listings.filter((listing, index) => index <= 35).map((listing, index) => <MapCard key={listing.guid} listing={listing} index={index} ref={cardRefs[listing.guid]} mapRef={mapRef} saved={saved?.includes(listing.guid)} handleSave={handleSave} handleHide={handleHide} />)} 
      {(listings.length > 35 && showAll === false) ? <Button fluid basic color='grey' icon='angle double down' content={`Show ${listings.length - 35} more results`} onClick={() => setShowAll(true)} style={showButtonStyle} /> 
      : (listings.length > 35 && showAll) ? <Button fluid basic color='grey' icon='angle double up' content={`Show less`} onClick={() => setShowAll(false)} style={showButtonStyle} /> : null}
    </Card.Group>
  )
}

const CardCornerDropdown = ({ index, guid, handleHide }) => {
  return (
    <Dropdown icon={<Icon name='ellipsis horizontal' color='grey' />} direction='left'>
      <Dropdown.Menu>
        <Dropdown.Item text='Copy link'icon='share alternate' id={`share=${guid}`}
        onClick={() => navigator.clipboard.writeText(`oregonyouthresourcemap.com/#/${guid}`)}
        />
        <Dropdown.Item as="a" href='https://oregonyouthresourcemap.com/#/suggest' target='_blank' text='Comment' icon={{ name: 'chat', color: getColor(index)}} />
        <Dropdown.Item onClick={() => handleHide(guid)}
          text='Hide listing' icon={{ name: 'eye slash outline', color: getColor(index)}} />
      </Dropdown.Menu>
    </Dropdown>
  )
}

// TODO: Move these and/or rewrite with proper CSS classes 
const starStyle = { marginRight: '.65em' }
const labelDivStyle = { display: 'flex', justifyContent: 'space-between' }
const cardStyle = { maxWidth: '525px' }
const tagStyle = { color: 'dimgrey' }
const showMoreStyle = { marginTop: 0, padding: '.45em', textAlign: 'center', fontSize: '.95em', color: 'grey'}
const detailsStyle = { marginTop: 0, padding: '.75em' }

const MapCard = forwardRef(({ mapRef, listing: { guid, category, coords, parent_organization, full_name, full_address, description, text_message_instructions, phone_1, phone_label_1, phone_1_ext, phone_2, phone_label_2, crisis_line_number, crisis_line_label, website, blog_link, twitter_link, facebook_link, youtube_link, instagram_link, program_email, video_description, languages_offered, services_provided, keywords, min_age, max_age, eligibility_requirements, covid_message, financial_information, intake_instructions, ...listing}, saved, handleSave, handleHide, index}, ref) => {
  const navigate = useNavigate()
  const [ searchParams, setSearchParams ] = useSearchParams()
  const [showMore, setShowMore] = useState(false)

  const updateSearchParams = (key, val) => {
    const currentParams = Object.fromEntries([...searchParams])
    const newParams = { ...currentParams, key: val }
    setSearchParams(newParams)
  }

  return (
    <Ref innerRef={ref}>
      <Card as="article" color={getColor(index)} centered raised className="map-card" style={cardStyle}>
        <Card.Content>
        {/* Extra divs are necessary for flex box spacing  */}
          <div style={labelDivStyle}>
            <Label as={Link} to={parent_organization ? `/?parent_organization=${encodeURIComponent(parent_organization)}` : `/?full_name=${encodeURIComponent(full_name)}`} ribbon color={getColor(index)} style={{marginBottom: `1em`}}>{parent_organization || full_name}</Label>
            <div> 
              <Icon name={saved ? 'star' : 'star outline'} color={getColor(index)} style={starStyle} onClick={() => handleSave(guid)} />
              {CardCornerDropdown({index, guid, full_address, mapRef, handleHide})}
            </div>
          </div>
          {/* Header  */}
          <Card.Header><Link to={`/${guid}`}>{full_name}</Link></Card.Header>
          { full_address && <Card.Meta style={{ cursor: 'pointer' }} onClick={() => { navigate(`/${guid}`, { state: { scrollToMap: true } }) }} title="View on map"><Icon name="map marker alternate" /> {full_address}</Card.Meta> }
          {/* Address & Contact Info  */}
          <Segment secondary>
            { full_address && <Card.Description><Icon name="map marker alternate" /><a target="_blank" rel="noreferrer" href={`https://www.google.com/maps/dir//${encodeURIComponent(full_address)}`}>Get Directions <sup><Icon size="small" name="external" /></sup></a></Card.Description> }
            { phone_1 && <Card.Description><Icon name="phone" />{ phone_label_1 && `${phone_label_1}: ` }<a target="_blank" rel="noreferrer" href={`tel:${phone_1}`}>{phone_1}</a> { phone_1_ext && phone_1_ext}</Card.Description> }
            { phone_2 && <Card.Description><Icon name="phone" />{ phone_label_2 && `${phone_label_2}: ` }<a target="_blank" rel="noreferrer" href={`tel:${phone_2}`}>{phone_2}</a> { phone_1_ext && phone_1_ext}</Card.Description> }
            { crisis_line_number && <Card.Description><Icon name="phone" />{crisis_line_label ?? 'Crisis Line'}: <a target="_blank" rel="noreferrer" href={`tel:${crisis_line_number}`}>{crisis_line_number}</a></Card.Description> }
            {/* Text message is a string and should not be hyperlinked */}
            { text_message_instructions && <Card.Description><Icon name="comment alternate" /> {text_message_instructions}</Card.Description> }
            { website && <Card.Description><Icon name="globe" /><a target="_blank" rel="noreferrer" href={website}>Website</a></Card.Description> }
            { blog_link && <Card.Description><Icon name="globe" /><a target="_blank" rel="noreferrer" href={blog_link}>{formatSocialMediaUrl(blog_link)}</a></Card.Description> }
            { twitter_link && <Card.Description><Icon name="twitter" /><a target="_blank" rel="noreferrer" href={twitter_link}>{formatSocialMediaUrl(twitter_link)}</a></Card.Description> }
            { facebook_link && <Card.Description><Icon name="facebook" /><a target="_blank" rel="noreferrer" href={facebook_link}>{formatSocialMediaUrl(facebook_link)}</a></Card.Description> }
            { youtube_link && <Card.Description><Icon name="youtube" /><a target="_blank" rel="noreferrer" href={youtube_link}>{formatSocialMediaUrl(youtube_link)}</a></Card.Description> }
            { instagram_link && <Card.Description><Icon name="instagram" /><a target="_blank" rel="noreferrer" href={instagram_link}>{formatSocialMediaUrl(instagram_link)}</a></Card.Description> }
            { program_email && <Card.Description><Icon name="mail outline" /><a target="_blank" rel="noreferrer" href={`mailto:${program_email}`}>{program_email}</a></Card.Description> }
          </Segment>
          {/* Description  */}
          <Segment basic vertical>
            <ExpandableDescription label="Description" value={description} />
          </Segment>
          {covid_message && <Card.Description><Card.Header as="strong">COVID Message:</Card.Header> {covid_message}</Card.Description>}
          {/* Show More div  */}
          {(eligibility_requirements || financial_information || intake_instructions || languages_offered || services_provided) && showMore ?  
            <Segment secondary style={detailsStyle} onClick={() => setShowMore(!showMore)}>
              { eligibility_requirements && <Card.Description><Card.Header as="strong">Eligibility:</Card.Header> {eligibility_requirements}</Card.Description>}
              {financial_information && <Card.Description><Card.Header as="strong">Cost:</Card.Header> {financial_information.includes(`\n`) ? financial_information.split('\n').map((paragraph, index) => index === 0 ? paragraph : <p>{paragraph}</p>) : financial_information}</Card.Description>}
              { intake_instructions && <Card.Description><Card.Header as="strong">Next Steps:</Card.Header> {intake_instructions.includes(`\n`) ? intake_instructions.split('\n').map((paragraph, index) => index === 0 ? paragraph : <p>{paragraph}</p>) : intake_instructions}</Card.Description>}
              { languages_offered && <ValueList name="Languages" values={languages_offered} /> }
              { services_provided && <ValueList name="Services" values={services_provided} /> }
            </Segment>
          : (eligibility_requirements || financial_information || intake_instructions || languages_offered || services_provided) ? 
            <Segment style={showMoreStyle} onClick={() => setShowMore(!showMore)}>
              <Icon name='angle down' color='grey' /> 
                Show More
            </Segment>
          : null}
          { (min_age && max_age) ? <Card.Description><Card.Header as="strong">Ages:</Card.Header> {min_age}-{max_age}</Card.Description>
            : (min_age && !max_age) ? <Card.Description><Card.Header as="strong">Minimum age served:</Card.Header> {min_age}</Card.Description>
            : (!min_age && max_age) ? <Card.Description><Card.Header as="strong">Maximum age served:</Card.Header> {max_age}</Card.Description>
            : null }
          <Card.Description><Card.Header as="strong">{category.split(':')[0]}:</Card.Header>    <NavLink to={`/?category=${encodeURIComponent(category)}`}> {category.split(':')[1]}</NavLink>
            </Card.Description>
          {/* <Card.Description as="dl">{Object.entries(listing).filter(([dt, dd]) => dd).map(([dt, dd], i) => <><dt key={dt}>{dt}</dt><dd key={i}>{dd}</dd></>)}</Card.Description> */}
        </Card.Content>
        {/* Show keywords if they exist. If not, show category so cards have consistent design */}
        <Card.Content extra>
          { keywords ? keywords.map((keyword, i) => <NavLink to={`/?${new URLSearchParams({...Object.fromEntries(searchParams), tag: `${keyword}` }).toString()}`} key={keyword} onClick={() => updateSearchParams('tag', keyword)} style={tagStyle}> # {keyword}</NavLink> )
          : <NavLink to={`/?category=${encodeURIComponent(category)}`}># {category.split(':')[1]}</NavLink>}
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
      <Segment as={MapContainer} center={[44.0489388,-123.0919415]} zoom={10} minZoom={6.75} maxZoom={18} scrollWheelZoom={false} tap={true} dragging={true} touchZoom={true}>
        <TileLayer attribution="Healthy Transitions" url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
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

export default MapPage;
