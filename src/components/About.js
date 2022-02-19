import React from 'react'
import { Container, Header, Image, Item, Segment, Icon } from 'semantic-ui-react'
import whiteBirdLogo from './../resources/whiteBirdLogo.png'
import {getColor} from './../utils'
import './About.css'
import DirectionServiceLogo from '../resources/direction-service-logo.png'

const whiteBirdStyle = {display: 'flex', padding: '1em 1em 1em 0'}
const contributorStyle = { fontSize: '1.15em' }
const greyText = {color: "dimgrey"}

function AboutPage({aboutText, contributors}) {
  return (
    <Container as="main" id="about-page" text>
      <Segment as="article" basic vertical>
        <Header as="h1">About</Header>
        <div>
          {aboutText.split('\n').map((paragraph, i) => <p key={i}>{paragraph}</p>)}
        </div>
        {/* White Bird TOS states that we need to display their attribution text on our site. DO NOT REMOVE. */}
        <Item style={whiteBirdStyle}>
          <Item.Image size='tiny' src={whiteBirdLogo} />
          <Item.Content style={{alignSelf: "center"}}>Some data was sourced from The Little Help Book published by White Bird Clinic.</Item.Content>
        </Item>
        <figure>
          <figcaption style={{fontWeight: "bold"}}>Made possible by collaboration with Direction Service in Eugene, Oregon</figcaption>
          <Image src={DirectionServiceLogo} />
        </figure>
      </Segment>
      <Segment as="article" vertical>
        <Header as="h1">Contributors</Header>
        {contributors && contributors.map((entry, index) => (
          <Item style={whiteBirdStyle} key={entry.name}>
            <Item.Content>
              <Header as="a" color={getColor(index)} style={contributorStyle} href={entry.website_url ?? null} target="_blank">{entry.name}</Header>
              {entry.description && <Item.Description style={greyText}>{entry.description}</Item.Description>}
            </Item.Content>
          </Item>
        ))}
      </Segment>
    </Container>
  )
}

export default AboutPage