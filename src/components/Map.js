import React, { createRef, forwardRef, useEffect, useMemo, useState } from "react";
import { debounce } from "lodash"
import { Link, useParams, useNavigate, useLocation, useSearchParams, NavLink } from "react-router-dom";
import { Container, Segment, Card, Label, Grid, Ref, Form, Icon, Input, Dropdown, Button } from "semantic-ui-react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from "react-leaflet";
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { useSessionStorage } from './../hooks/useSessionStorage'

import 'leaflet/dist/leaflet.css';
import 'react-leaflet-markercluster/dist/styles.min.css';

import { filterListings, getKeywordCount, getCostCount } from '../utils'
import './Map.css'
import { greenLMarker, blueLMarker } from '../resources/mapIcons'
import { getCityCount, getColor, titleCaseKey } from '../utils'

function MapPage({ listings, metadata }) {
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
    if (searchParams.get('saved')) {
      setShowSaved(false)
      navigate({ pathname: '/', search: ''})
    } else if (saved.length > 0) {
      // set state so that the UI components can update
      setShowSaved(true)
      const paramsString = saved.join("&saved=")
      navigate({ pathname: '/', search: `?saved=${paramsString}` })
    } 
  }

  const { listingCategoryIcons, listingCategories, listingCities: defaultListingCities, listingKeywords: defaultListingKeywords } = metadata

  const debouncedSearch = debounce((value) => { setSearch(value) }, 300);

  let filteredListings = useMemo(() => filterListings(listings, searchParams, search, hidden), [listings, searchParams, search, hidden])
  
  // If you don't want to recalculate the two lines below on every search, just use metadata.listingCities and metadata.listingKeywords, respectively. That would be faster, but also a less rich user experience
  let listingCities = useMemo(() => getCityCount(filteredListings ?? {}), [filteredListings])
  const keywordCount = useMemo(() => getKeywordCount(filteredListings ?? {}), [filteredListings])
  const costCount = useMemo(() => getCostCount(filteredListings ?? {}), [filteredListings])
  
  const cardRefs = listings.reduce((cardRefs, listing) => ({...cardRefs, [listing.guid]: createRef()}), {})
  const mapRef = createRef()

  return (<>
    <MapSearch listingCategories={listingCategories} listingCategoryIcons={listingCategoryIcons} debouncedSearch={debouncedSearch} listingCities={listingCities} keywordCount={keywordCount} costCount={costCount} saved={saved} handleSave={handleSave} handleHide={handleHide} hidden={hidden} showSaved={showSaved} handleShowSaved={handleShowSaved} />
    <Container as="main" id="map-page">
      <MapCards listings={filteredListings} cardRefs={cardRefs} mapRef={mapRef} saved={saved} handleSave={handleSave} handleHide={handleHide} />
      <MapMap listings={filteredListings} cardRefs={cardRefs} ref={mapRef} />
    </Container>
  </>)
}

function MapSearch({ listingCategories, listingCategoryIcons, debouncedSearch, listingCities, saved, handleShowSaved, keywordCount, costCount }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [ searchParams, setSearchParams ] = useSearchParams()
  const [ age, setAge ] = useState(searchParams.get('age') || ``)
  const [showFilters, setShowFilters] = useState(true)

  // When user clears the params, this clears the input value as well
  useEffect(() => {
    setAge(searchParams.get('age') ?? '')
  },[searchParams])

  const MainIconMenu = ()  => 
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

  const debouncedAge = debounce((value) => { setSearchParams({ ...Object.fromEntries(searchParams), age: value })}, 500)

  // Set the UI state quickly for better UX, but debounce the actual search logic.
  // Note: the "min" and "max" fields on our number input aren't working. Probably a Semantic bug. Implemented manually here.
  const handleAge = value => { if (value >= 0 && value <100) { clearSaved(); setAge(value); debouncedAge(value); }}

  const handleDropdownClick = (eventType, value, key) => {
    clearSaved()
    if (eventType === 'click') {
      if (value === '') {
        searchParams.delete(key); setSearchParams(searchParams)
      }
      else setSearchParams({ ...Object.fromEntries(searchParams), [key]: value }) 
    }
  } 

  // If a user is viewing "saved" listings, and clicks on a different UI element (search, filters, etc) we need to clear the "saved" params from the URL bar before doign anything else, to prevent bugs
  const clearSaved = () => { searchParams.delete('saved') }

  // This data comes from the API. It's optional, so null check it 
  const locationDropdownOptions = Object.entries(listingCities ?? {}).map(([cityName, count]) => {
    return { key: cityName,  text: `${cityName} (${count})`, value: cityName }
  })

  const keywordDropdownOptions = Object.entries(keywordCount ?? {}).map(([keyword, count]) => {
    return { key: keyword,  text: `${keyword} (${count})`, value: keyword }
  })

  const costDropdownOptions = Object.entries(costCount ?? {}).map(([cost, count]) => {
    return { key: cost,  text: `${cost} (${count})`, value: cost }
  })

  const locationDropdown = locationDropdownOptions.length > 0
  const keywords = keywordDropdownOptions.length > 0
  const cost = costDropdownOptions.length > 0

return (<>
    <Segment as="nav" id="map-nav" color="black" basic vertical inverted>
      <MainIconMenu />
      <Form size="tiny" className="container">
      {/* Search Input & "Show Saved" Button  */}
      <Grid columns='equal' stackable style={showFilters ? {marginTop: '1.5em'} : { marginTop: '1.5em', marginBottom: '.25em'}}>
        <Grid.Column width={4}>
          <Button basic floated='right' inverted color='teal' fluid size='small'
              icon={searchParams.get('saved') ? 'list' : 'star outline'}
              content={(searchParams.get('saved')) ? 'Show All' : 'Show Saved'}
              disabled={saved.length === 0 && !searchParams.get('saved')} 
              onClick={() => handleShowSaved(saved)}
              style={{minWidth: '150px'}}
              />
        </Grid.Column>
        {/* Search Text Input  */}
        <Grid.Column style={{display: 'flex'}}>
          <Input 
            tabIndex="1" fluid
            style={{width: '100%', paddingRight: '.5em'}}
            icon='search'
            iconPosition="left"
            placeholder="Search..." 
            onFocus={() => navigate(`/?${searchParams.toString()}`)} 
            onChange={(e, {value}) => debouncedSearch(value)} 
          />
          <Button 
            icon={<Icon name={showFilters? "angle up" : "filter"} />}
            onClick={() => setShowFilters(!showFilters)}
            style={{maxHeight: '35px'}}
            />
          </Grid.Column>
      </Grid>

      {/* Optional Filters  */}
      {showFilters &&
      <Grid stackable columns='equal' style={{marginBottom: '.25em', marginTop: 0}}>
      {/* Age Input  */}
      <Grid.Column width={2}>
        <Input type="number" id='age-input' fluid
          placeholder='Age'
          value={age}
          onFocus={() => navigate(`/?${searchParams.toString()}`)} 
          onChange={(e, {value}) => handleAge(value)} />
      </Grid.Column>
      {/* Location Dropdown  */}
      {locationDropdown && 
        <Grid.Column>
          <Dropdown id="keyword-input"
            options={locationDropdownOptions} 
            search selection clearable 
            button 
            placeholder={<div><i className="ui icon map marker alternate" id="keyword-icon"></i><span id="keyword-label">  Location</span></div>}
            selectOnBlur={false}  
            inverted fluid
            value={searchParams.get('city') || ``} 
            onFocus={() => navigate(`/?${searchParams.toString()}`)} 
            onChange={(e, {value}) => handleDropdownClick(e.type, value, 'city')}
          />
          </Grid.Column>}
        {/* Keyword Dropdown  */}
        {keywords && 
        <Grid.Column>
          <Dropdown id='keyword-input'
            options={keywordDropdownOptions} 
            search selection clearable 
            button
            placeholder={<div><i className="ui icon user" id="keyword-icon"></i><span id="keyword-label">  Population</span></div>}
            selectOnBlur={false}
            inverted fluid 
            value={searchParams.get('tag') || ``} 
            onFocus={() => navigate(`/?${searchParams.toString()}`)} 
            onChange={(e, {value}) => handleDropdownClick(e.type, value, 'tag')}
          />
        </Grid.Column>}
        {/* COST DROPDOWN  */}
        {cost && 
        <Grid.Column>
          <Dropdown id='keyword-input'
            options={costDropdownOptions} 
            search selection clearable 
            button
            placeholder={<div><i className="ui icon dollar sign" id="keyword-icon"></i><span id="keyword-label">  Cost</span></div>}
            selectOnBlur={false}
            inverted fluid 
            value={searchParams.get('cost') || ``} 
            onFocus={() => navigate(`/?${searchParams.toString()}`)} 
            onChange={(e, {value}) => handleDropdownClick(e.type, value, 'cost')}
            />
          </Grid.Column>}
        </Grid>}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '.25em'}}>
          <Label.Group columns={[...searchParams].length} className="doubling container">
            {!location.search.includes('saved') &&
            [...searchParams].map(([key, value]) => value && <Label key={key} basic color="blue"><strong>{titleCaseKey(key.replace(/_/ig,` `))}:</strong> {value} <Icon name="delete" onClick={() => { searchParams.delete(key); setSearchParams(searchParams) }} /></Label> ) }
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
  const [numCardsShowing, setNumCardsShowing] = useState(25)
  const currentCard = cardRefs[markerId]

  useEffect(() => {
    if (location.state?.scrollToMap) mapRef.current?.scrollIntoView({ behavior: 'smooth' })
    else if (currentCard) currentCard.current?.scrollIntoView({behavior: "smooth"})
  }, [currentCard, location, mapRef])

  // Limit the number of results shown after search, for speed optimization. User can click "Show More" button to reveal the additional hidden results (all results.)
  const CardsDisplay = ({numEntries}) => {
    if (markerId) {
      const cardsToShow = listings.slice(0, numEntries)
      // Note: Leave this as a double equals to work around type coercion
      if (cardsToShow.find(listing => listing.guid == markerId)) { return cardsToShow.map((listing, index) => <MapCard key={listing.guid} listing={listing} index={index} ref={cardRefs[listing.guid]} mapRef={mapRef} saved={saved?.includes(listing.guid)} handleSave={handleSave} handleHide={handleHide} />) } 
      else {
        const currentListing = listings.find(listing => listing.guid == markerId) 
        return cardsToShow.concat(currentListing).map((listing, index) => <MapCard key={listing.guid} listing={listing} index={index} ref={cardRefs[listing.guid]} mapRef={mapRef} saved={saved?.includes(listing.guid)} handleSave={handleSave} handleHide={handleHide} />) 
      } 
    }
    return listings.slice(0, numEntries).map((listing, index) => <MapCard key={listing.guid} listing={listing} index={index} ref={cardRefs[listing.guid]} mapRef={mapRef} saved={saved?.includes(listing.guid)} handleSave={handleSave} handleHide={handleHide} />)
  }
  
  return (
    <Card.Group as="section" itemsPerRow="1">
      {/* No results found  */}
      {listings?.length === 0 && <div style={{textAlign: 'center'}}>No Results Found.</div>}
      {/* Show first 30 listings by default if filteredListings is longer than that  */}
      <CardsDisplay numEntries={numCardsShowing} />
      {/* "Show More Listings" button  */}
      {(listings.length > numCardsShowing) && <Button fluid basic color='grey' icon='angle double down' content={`Show more results`} onClick={() => setNumCardsShowing(numCardsShowing + 25)} style={showButtonStyle} />}
    </Card.Group>
  )
}

const CardCornerDropdown = ({ cardColor, guid, handleHide }) => {
  return (
    <Dropdown icon={<Icon name='ellipsis horizontal' color='grey' />} direction='left'>
      <Dropdown.Menu>
        <Dropdown.Item text='Copy link'icon='share alternate' id={`share=${guid}`}
        onClick={() => navigator.clipboard.writeText(`oregonyouthresourcemap.com/#/${guid}`)}
        />
        <Dropdown.Item as="a" href='https://oregonyouthresourcemap.com/#/suggest' target='_blank' text='Comment' icon={{ name: 'chat', color: cardColor}} />
        <Dropdown.Item onClick={() => handleHide(guid)}
          text='Hide listing' icon={{ name: 'eye slash outline', color: cardColor}} />
      </Dropdown.Menu>
    </Dropdown>
  )
}

const starStyle = { marginRight: '.65em' }
const labelDivStyle = { display: 'flex', justifyContent: 'space-between' }
const cardStyle = { maxWidth: '525px' }
const tagStyle = { color: 'dimgrey' }
const detailsStyle = { marginTop: '.10em', padding: '.75em' }
const blueCheckStyle = { color: 'grey', fontStyle: 'italic' }
const socialLinkStyle = { display: 'flex' }

const MapCard = forwardRef(({ mapRef, listing, saved, handleSave, handleHide, index}, ref) => {
  const { guid, category, parent_organization, full_name, full_address, description, text_message_instructions, phone_1, phone_label_1, phone_1_ext, phone_2, phone_label_2, crisis_line_number, crisis_line_label, website, blog_link, twitter_link, facebook_link, youtube_link, instagram_link, program_email, languages_offered, services_provided, keywords, min_age, max_age, eligibility_requirements, covid_message, financial_information, intake_instructions, agency_verified, date_agency_verified, cost_keywords, tiktok_link } = listing

  const navigate = useNavigate()
  const [ searchParams, setSearchParams ] = useSearchParams()
  const cardColor = getColor(index)
  const updateSearchParams = (key, val) => {
    const currentParams = Object.fromEntries([...searchParams])
    const newParams = { ...currentParams, key: val }
    setSearchParams(newParams)
  }

  const BlueCheck = ({name, date}) => (
    <div style={blueCheckStyle}><Icon name='check' color={cardColor} /> Verified by {name} on {date}</div>
  )

  const SocialMediaDisplay = ({link, icon}) => (
    <Card.Description><a target="_blank" rel="noreferrer" href={link}>
      <Icon name={icon} /></a>
    </Card.Description> 
  )

  const KeywordDisplay = ({arr}) => arr.map((keyword, i) => (
    <NavLink to={`/?${new URLSearchParams({...Object.fromEntries(searchParams), tag: `${keyword}` }).toString()}`} key={keyword} onClick={() => updateSearchParams('tag', keyword)} style={tagStyle}> # {keyword}</NavLink> )
  ) 

  return (
    <Ref innerRef={ref}>
      <Card as="article" color={cardColor} centered raised className="map-card" style={cardStyle}>
        <Card.Content>
        {/* Extra divs are necessary for flex box spacing  */}
          <div style={labelDivStyle}>
            <Label as={Link} to={parent_organization ? `/?parent_organization=${encodeURIComponent(parent_organization)}` : `/?full_name=${encodeURIComponent(full_name)}`} ribbon color={cardColor} style={{marginBottom: `1em`}}>{parent_organization || full_name}</Label>
            <div> 
              <Icon name={saved ? 'star' : 'star outline'} color={cardColor} style={starStyle} onClick={() => handleSave(guid)} />
              {CardCornerDropdown({cardColor, guid, full_address, mapRef, handleHide})}
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
            { program_email && <Card.Description><Icon name="mail outline" /><a target="_blank" rel="noreferrer" href={`mailto:${program_email}`}>{program_email}</a></Card.Description> }
            <div id='social-links' style={socialLinkStyle}>
              {website && <Card.Description style={{marginRight: '3%'}}><Icon name="globe" /><a target="_blank" rel="noreferrer" href={website}>Website</a>  </Card.Description> }
              {instagram_link && <SocialMediaDisplay icon='instagram' link={instagram_link} /> }
              {facebook_link && <SocialMediaDisplay icon='facebook' link={facebook_link} /> }
              {twitter_link && <SocialMediaDisplay icon='twitter' link={twitter_link} /> }
              {youtube_link && <SocialMediaDisplay icon='youtube' link={youtube_link} /> }
            </div>
          </Segment>
          {(agency_verified && date_agency_verified) && <BlueCheck name={full_name} date={date_agency_verified} />}

          <Segment basic vertical>
            <ExpandableDescription label="Description" value={description} />
          </Segment>

          {covid_message && <Card.Description><Card.Header as="strong">COVID Message:</Card.Header> {covid_message}</Card.Description>}

          <Segment secondary style={detailsStyle}>
            { eligibility_requirements && <Card.Description><Card.Header as="strong">Eligibility:</Card.Header> {eligibility_requirements}</Card.Description>}
            {financial_information && <Card.Description><Card.Header as="strong">Cost:</Card.Header> {financial_information.includes(`\n`) ? financial_information.split('\n').map((paragraph, index) => index === 0 ? paragraph : <p key={index}>{paragraph}</p>) : financial_information}</Card.Description>}
            { intake_instructions && <Card.Description><Card.Header as="strong">Next Steps:</Card.Header> {intake_instructions.includes(`\n`) ? intake_instructions.split('\n').map((paragraph, index) => index === 0 ? paragraph : <p key={index}>{paragraph}</p>) : intake_instructions}</Card.Description>}
            {/* Languages is an array  */}
            { languages_offered && <Card.Description><Card.Header as="strong">Languages: </Card.Header>{languages_offered.join(", ")}</Card.Description> }
          </Segment>
          { (min_age && max_age) ? <Card.Description><Card.Header as="strong">Ages:</Card.Header> {min_age}-{max_age}</Card.Description>
            : (min_age && !max_age) ? <Card.Description><Card.Header as="strong">Minimum age served:</Card.Header> {min_age}</Card.Description>
            : (!min_age && max_age) ? <Card.Description><Card.Header as="strong">Maximum age served:</Card.Header> {max_age}</Card.Description>
            : null }
          <Card.Description><Card.Header as="strong">{category.split(':')[0]}:</Card.Header>    <NavLink to={`/?category=${encodeURIComponent(category)}`}> {category.split(':')[1]}</NavLink>
            </Card.Description>
        </Card.Content>
        {/* Show keywords and/or cost_keywords if they exist. If not, show category so cards have consistent design */}
        <Card.Content extra>
          { (keywords && cost_keywords) ? <KeywordDisplay arr={[...keywords, ...cost_keywords]} /> 
          : keywords ? <KeywordDisplay arr={keywords} /> : cost_keywords ? <KeywordDisplay arr={cost_keywords} />
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

const MapMap = forwardRef(({ listings, cardRefs }, ref) => {
  return (
    <Ref innerRef={ref}>
      <Segment as={MapContainer} center={[44.0521,-123.0868]} zoom={7} minZoom={6.55} maxZoom={18} scrollWheelZoom={false} tap={true} dragging={true} touchZoom={true}>
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
  useEffect(() => currentCoords && currentCoords[0] && currentCoords[1] && map.setView(currentCoords, 18), [map, currentCoords])

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
