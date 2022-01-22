import React from 'react'
import { Container, Header, Image, Segment } from 'semantic-ui-react'

import './About.css'
import DirectionServiceLogo from '../resources/direction-service-logo.png'

function AboutPage() {
  return (
    <Container as="main" id="about-page" text>
      <Segment as="article" basic vertical>
        <Header as="h1">About</Header>
        <p>The Oregon Youth Resource Map is a collaboration between Healthy Transitions Youth Leadership, youth councils around the state, Direction Service in Eugene, and the Mapping Action Collective in Portland, Oregon.</p>
        <p>The Resource Map centers youth needs and voices. It focuses on programs, services and leadership opportunities for youth and young adults, ages 16-25 in Oregon, including services for health and mental healthcare, housing, education, and more. The Map began as a way to connect youth with mental health services, and has expanded to include anything that may improve quality of life for youth and young adults.</p>
        <p>The Oregon Youth Resource Map is funded and contributed to by SAMHSA (Substance Abuse and Mental Health Service Administration), the Oregon Health Authority, Portland State University, Youth ERA, and local service providers from Douglas and Lane Counties.</p>
        <p>Some data was sourced from The Little Help Book published by White Bird Clinic.</p>
        <figure>
          <figcaption>Made possible by collaboration with Direction Service in Eugene, Oregon</figcaption>
          <Image src={DirectionServiceLogo} />
        </figure>
      </Segment>
    </Container>
  )
}

export default AboutPage