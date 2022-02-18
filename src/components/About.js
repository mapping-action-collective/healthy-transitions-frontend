import React from 'react'
import { Container, Header, Image, Item, Segment } from 'semantic-ui-react'
import whiteBirdLogo from './../resources/whiteBirdLogo.png'

import './About.css'
import DirectionServiceLogo from '../resources/direction-service-logo.png'

// NOTE: White Bird TOS states that we need to display their attribution text on our site. Do not remove. 
const whiteBirdStyle = {display: 'flex', padding: '1em 1em 1em 0'}

function AboutPage({aboutText}) {
  return (
    <Container as="main" id="about-page" text>
      <Segment as="article" basic vertical>
        <Header as="h1">About</Header>
        <div>
          {aboutText.split('\n').map((paragraph, i) => <p key={i}>{paragraph}</p>)}
        </div>
        <Item style={whiteBirdStyle}>
          <Item.Image size='tiny' src={whiteBirdLogo} />
          <Item.Content style={{alignSelf: "center"}}>Some data was sourced from The Little Help Book published by White Bird Clinic.</Item.Content>
        </Item>
        <figure>
          <figcaption style={{fontWeight: "bold"}}>Made possible by collaboration with Direction Service in Eugene, Oregon</figcaption>
          <Image src={DirectionServiceLogo} />
        </figure>
      </Segment>
    </Container>
  )
}

export default AboutPage