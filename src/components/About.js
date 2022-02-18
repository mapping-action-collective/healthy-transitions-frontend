import React from 'react'
import { Container, Header, Image, Segment } from 'semantic-ui-react'

import './About.css'
import DirectionServiceLogo from '../resources/direction-service-logo.png'

function AboutPage({aboutText}) {
  return (
    <Container as="main" id="about-page" text>
      <Segment as="article" basic vertical>
        <Header as="h1">About</Header>
        <div>
          {aboutText.split('\n').map((paragraph, i) => <p key={i}>{paragraph}</p>)}
        </div>
        <figure>
          <figcaption>Made possible by collaboration with Direction Service in Eugene, Oregon</figcaption>
          <Image src={DirectionServiceLogo} />
        </figure>
      </Segment>
    </Container>
  )
}

export default AboutPage