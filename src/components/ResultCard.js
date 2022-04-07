import React, { forwardRef } from "react";
import { Link, useNavigate, useSearchParams, NavLink } from "react-router-dom";
import { Segment, Card, Label, Ref, Dropdown, Icon } from "semantic-ui-react";
// TODO: re-add the hook below to store saved cards in session storage
// import { useSessionStorage } from '../hooks/useSessionStorage'
import { useSelector, useDispatch } from 'react-redux'
import { clearSavedCards, toggleSavedVisibility, toggleSavedValues } from '../store/savedCardSlice'

import 'leaflet/dist/leaflet.css';
import 'react-leaflet-markercluster/dist/styles.min.css';

import './Map.css'
import { getColor } from '../utils'

const starStyle = { marginRight: '.65em' }
const labelDivStyle = { display: 'flex', justifyContent: 'space-between' }
const cardStyle = { maxWidth: '525px' }
const tagStyle = { color: 'dimgrey' }
const detailsStyle = { marginTop: '.10em', padding: '.75em' }
const blueCheckStyle = { color: 'grey', fontStyle: 'italic' }
const socialLinkStyle = { display: 'flex' }


const FavoriteStarIcon = ({color, guid}) => {
  const dispatch = useDispatch()
  const saved = useSelector(state => state.savedCards.savedCards.includes(guid))

  return (
    <Icon name={saved ? 'star' : 'star outline'} color={color} style={starStyle} 
      onClick={() => dispatch(toggleSavedValues({id: guid}))} 
    />
  )
}

const ExpandableDescription = ({ label, value }) => <>
    { label && <Card.Header as="strong">{label}:</Card.Header> }
    { value && <Card.Description className="expandable" tabIndex="0">{value.split(`\n`).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</Card.Description> }
</>

const ResultCard = forwardRef(({ mapRef, listing, index}, ref) => {
  const { guid, category, parent_organization, full_name, full_address, description, text_message_instructions, phone_1, phone_label_1, phone_1_ext, phone_2, phone_label_2, crisis_line_number, crisis_line_label, website, twitter_link, facebook_link, youtube_link, instagram_link, program_email, languages_offered, keywords, min_age, max_age, eligibility_requirements, covid_message, financial_information, intake_instructions, agency_verified, date_agency_verified, cost_keywords} = listing

  const navigate = useNavigate()
  const [ searchParams, setSearchParams ] = useSearchParams()
  const cardColor = getColor(index)
  const updateSearchParams = (key, val) => {
    const currentParams = Object.fromEntries([...searchParams])
    const newParams = { ...currentParams, key: val }
    setSearchParams(newParams)
  }

  const BlueCheck = ({name, date}) => (
    <div style={blueCheckStyle}><Icon name='check' color={cardColor} /> Verified by {name}</div>
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
      <Card as="article" key={guid} color={cardColor} centered raised className="map-card" style={cardStyle}>
        <Card.Content>
          <div style={labelDivStyle}>
            <Label as={Link} to={parent_organization ? `/?parent_organization=${encodeURIComponent(parent_organization)}` : `/?full_name=${encodeURIComponent(full_name)}`} ribbon color={cardColor} style={{marginBottom: `1em`}}>{parent_organization || full_name}</Label>
            <div> 
              <FavoriteStarIcon color={cardColor} guid={guid} />
              <Dropdown icon={<Icon name='ellipsis horizontal' color='grey' />} direction='left'>
                <Dropdown.Menu>
                  <Dropdown.Item text='Copy link'icon='share alternate' id={`share=${guid}`}
                    onClick={() => navigator.clipboard.writeText(`oregonyouthresourcemap.com/#/${guid}`)}
                  />
                  <Dropdown.Item as="a" href='https://oregonyouthresourcemap.com/#/suggest'       target='_blank' text='Comment' icon={{ name: 'chat', color: cardColor}} />
                  <Dropdown.Item as={Link} to={`/${guid}`} ribbon color={cardColor} text='View on map'
                     icon={{ name: 'map outline', color: cardColor}} />
                </Dropdown.Menu>
              </Dropdown>
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

export default ResultCard