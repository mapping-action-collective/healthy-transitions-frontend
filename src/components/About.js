import React from 'react'
import { Container, Header, Segment, Item, Image } from 'semantic-ui-react'
import './SuggestUpdate.css'
import whiteBirdLogo from './../resources/whiteBirdLogo.png'
import macLogo from './../resources/mac-logo.png'

import './About.css'

const whiteBirdStyle = {display: 'flex', alignSelf: 'center' }
// const whiteBirdAttribution = (<Item style={whiteBirdStyle}><Item.Image size='mini' src={whiteBirdLogo} /><Item.Content style={{alignSelf: "center"}}>Some data was sourced from The Little Help Book published by White Bird Clinic.</Item.Content></Item>)
const whiteBirdAttribution = (<Item style={whiteBirdStyle}><Item.Content style={{alignSelf: "center"}}>Some data was sourced from The Little Help Book published by White Bird Clinic.</Item.Content></Item>)

const MAC_URL = "https://mappingaction.org/"
const mappingActionAttribution = (
  <Item style={whiteBirdStyle}>
    <Item.Content>
      Originally created by the {<a href={MAC_URL} target="_blank" rel="noreferrer">Mapping Action Collective</a>}
    </Item.Content>
  </Item>
)

const logos = [
 { src: 'https://i.postimg.cc/zG6Wxkk7/DS-Logo-Web.jpg', alt: 'Direction Service logo' },
 { src: 'https://i.postimg.cc/bNhrmBb3/healthy-transitions-logo-2020.png', alt: 'Healthy Transitions Young Adult Leaders logo' },
 { src: whiteBirdLogo, alt: 'White Bird logo' },
 { src: macLogo, alt: 'Mapping Action Collective Logo' },
]

function AboutPage () {
  return (
    <>
      <Container as="main" id="about-page">
        <Header as="h1" style={{marginTop: '1em', textAlign: 'center'}}>About</Header>
        <Segment as="article" basic vertical className='embed'>
          <iframe src="https://docs.google.com/document/d/e/2PACX-1vQK9o78JtKu0QdCouw6lGAAdfpCxZw_Nre-Kpcb2NHu__RJR0LfPGf11OhEGRRg1MEskVQyA5MNs_Jw/pub?embedded=true" frameBorder="0" marginHeight="0" marginWidth="0"></iframe>
        </Segment>
      </Container>
      <div style={{display: 'flex', justifyContent: 'center'}}>
        {logos.map(logo => <Image src={logo.src} alt={logo.alt} style={{height: '75px', margin: '10px 15px'}} />)}
      </div>
      {/* DO NOT REMOVE. Required by White Bird and MAC TOS. */}
      {whiteBirdAttribution}
      {mappingActionAttribution}
      <p style={{marginTop: '15px'}}></p>
    </>
  )
}

export default AboutPage
