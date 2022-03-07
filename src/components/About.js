import React from 'react'
import { Container, Header, Image, Item, Segment, Icon } from 'semantic-ui-react'
import whiteBirdLogo from './../resources/whiteBirdLogo.png'
import {getColor} from './../utils'
import './About.css'
import DirectionServiceLogo from '../resources/direction-service-logo.png'

const whiteBirdStyle = {display: 'flex', padding: '1em 1em 1em 0'}
const contributorStyle = { fontSize: '1.15em' }
const greyText = {color: "dimgrey"}

// TODO: get code for displaying the yt video link
function AboutPage({aboutText, contributors, disclaimer, videoLink, rubric}) {

  const dsLogoDisplay = (<figure><figcaption style={{fontWeight: "bold"}}>Made possible by collaboration with Direction Service in Eugene, Oregon</figcaption><Image src={DirectionServiceLogo} /></figure>)

  const whiteBirdAttribution = (<Item style={whiteBirdStyle}><Item.Image size='tiny' src={whiteBirdLogo} /><Item.Content style={{alignSelf: "center"}}>Some data was sourced from The Little Help Book published by White Bird Clinic.</Item.Content></Item>)

  return (
    <Container as="main" id="about-page" text>
      <Segment as="article" basic vertical>
        <Header as="h1">About</Header>
        <div>{aboutText.split('\n').map((paragraph, i) => <p key={i}>{paragraph}</p>)}</div>
        {/* DO NOT REMOVE. Required by White Bird TOS. */}
        {whiteBirdAttribution}
        {/* TODO: add segment or similar to display rubric text here */}
        {dsLogoDisplay}
        </Segment>
        {/* List of contributors/sponsors, including MAC */}
        {contributors &&<Segment as="article" vertical>
          <Header as="h1">About Our Contributors</Header>
          {contributors.map((entry, index) => (
            <Item style={whiteBirdStyle} key={entry.name}>
              <Item.Content>
                <Header as="a" color={getColor(index)} style={contributorStyle} href={entry.website_url ?? null} target="_blank">{entry.name}</Header>
                {entry.description && <Item.Description style={greyText}>{entry.description}</Item.Description>}
              </Item.Content>
            </Item>
          ))}
        </Segment>}
        {disclaimer && <Segment basic vertical>
        <p><span style={{fontWeight: 'bold'}}>Disclaimer: </span>{disclaimer}</p>
        </Segment>}
    </Container>
  )
}

export default AboutPage