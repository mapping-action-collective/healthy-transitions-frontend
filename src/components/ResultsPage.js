import React, { createRef, useEffect, useMemo, useState } from "react";
import { debounce } from "lodash"
import { useParams, useNavigate, useLocation, useSearchParams, NavLink } from "react-router-dom";
import { Container, Segment, Card, Label, Grid, Form, Icon, Input, Dropdown, Button } from "semantic-ui-react";
import { useSelector, useDispatch } from 'react-redux'
import { toggleSavedVisibility } from '../store/savedCardSlice'

import 'leaflet/dist/leaflet.css';
import 'react-leaflet-markercluster/dist/styles.min.css';

import { filterListings, getKeywordCount, getCostCount } from '../utils'
import './Map.css'
import { getCityCount, titleCaseKey } from '../utils'

import ResultCard from './ResultCard'
import Map from "./Map"

function ResultsPage({ listings, metadata }) {
  const [ searchParams, ] = useSearchParams()
  const [ search, setSearch ] = useState()

  const { listingCategoryIcons, listingCategories } = metadata

  const debouncedSearch = debounce((value) => { setSearch(value) }, 300);

  let filteredListings = useMemo(() => filterListings(listings, searchParams, search), [listings, searchParams, search])
  
  // If you don't want to recalculate the two lines below on every search, just use metadata.listingCities and metadata.listingKeywords, respectively. That would be faster, but also a less rich user experience
  let listingCities = useMemo(() => getCityCount(filteredListings ?? {}), [filteredListings])
  const keywordCount = useMemo(() => getKeywordCount(filteredListings ?? {}), [filteredListings])
  const costCount = useMemo(() => getCostCount(filteredListings ?? {}), [filteredListings])
  
  const cardRefs = listings.reduce((cardRefs, listing) => ({...cardRefs, [listing.guid]: createRef()}), {})
  const mapRef = createRef()

  return (<>
    <MapSearch listingCategories={listingCategories} listingCategoryIcons={listingCategoryIcons}        
      debouncedSearch={debouncedSearch} 
      listingCities={listingCities} keywordCount={keywordCount} costCount={costCount} />
    <Container as="main" id="map-page" key='map-container'>
      <MapCards listings={filteredListings} cardRefs={cardRefs} mapRef={mapRef} />
      <Map listings={filteredListings} cardRefs={cardRefs} ref={mapRef} />
    </Container>
  </>)
}

const SavedResultsButton = () => {
  const [ searchParams, ] = useSearchParams()
  const navigate = useNavigate()
  let savedCards = useSelector(state => state.savedCards.savedCards)
  let showingSavedResults = searchParams.get('saved') !== null


  const handleSavedButtonClick = () => {
    if (showingSavedResults) {
      navigate({ pathname: '/', search: ''})
    } else {
      const paramsString = savedCards.join("&saved=")
      navigate({ pathname: '/', search: `?saved=${paramsString}` })
    }
  }


  return (
    <Grid.Column width={4}>
      <Button basic floated='right' inverted color='teal' fluid size='small'
        icon={showingSavedResults ? 'list' : 'star outline'}
        content={showingSavedResults ? 'Show All' : 'Show Saved'}
        disabled={savedCards.length === 0 && showingSavedResults === false} 
        onClick={() => handleSavedButtonClick()}
        style={{minWidth: '150px'}}
        />
    </Grid.Column>
  )
}

function MapSearch({ listingCategories, listingCategoryIcons, debouncedSearch, listingCities, keywordCount, costCount }) {
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
      <Grid columns='equal' stackable style={showFilters ? {marginTop: '1.5em'} : { marginTop: '1.5em', marginBottom: '.25em'}}>
        <SavedResultsButton />
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

function MapCards({ listings, cardRefs, mapRef }) {
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
      if (cardsToShow.find(listing => listing.guid == markerId)) { return cardsToShow.map((listing, index) => <ResultCard key={listing.guid} listing={listing} ref={cardRefs[listing.guid]} mapRef={mapRef} index={index} />) } 
      else {
        const currentListing = listings.find(listing => listing.guid == markerId) 
        return cardsToShow.concat(currentListing).map((listing, index) => <ResultCard key={listing.guid} listing={listing} ref={cardRefs[listing.guid]} mapRef={mapRef} index={index} />) 
      } 
    }
    return listings.slice(0, numEntries).map((listing, index) => <ResultCard key={listing.guid} listing={listing} ref={cardRefs[listing.guid]} mapRef={mapRef} index={index} />)
  }
  
  return (
    <Card.Group as="section" itemsPerRow="1" key='cards'>
      {listings?.length === 0 && <div style={{textAlign: 'center'}}>No Results Found.</div>}
      <CardsDisplay numEntries={numCardsShowing} key='cards-display' />
      {(listings.length > numCardsShowing) && 
        <Button fluid basic color='grey' icon='angle double down' content={`Show more results`} 
        onClick={() => setNumCardsShowing(numCardsShowing + 25)} style={showButtonStyle} 
        />}
    </Card.Group>
  )
}

export default ResultsPage;
