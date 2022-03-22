import React from 'react'
import { Container, Header, Segment, Item } from 'semantic-ui-react'
import './SuggestUpdate.css'
import whiteBirdLogo from './../resources/whiteBirdLogo.png'
import './About.css'

const whiteBirdStyle = {display: 'flex', alignSelf: 'center' }
const whiteBirdAttribution = (<Item style={whiteBirdStyle}><Item.Image size='mini' src={whiteBirdLogo} /><Item.Content style={{alignSelf: "center"}}>Some data was sourced from The Little Help Book published by White Bird Clinic.</Item.Content></Item>)

const MAC_URL = "https://mappingaction.org/"
const mappingActionAttribution = (
  <Item style={whiteBirdStyle}>
    <Item.Content>
      Originally created by the {<a href={MAC_URL} target="_blank" rel="noreferrer">Mapping Action Collective</a>}
    </Item.Content>
  </Item>
)

function AboutPage () {
  return (
    <>
      <Container as="main" id="about-page">
        <Header as="h1" style={{marginTop: '1em', textAlign: 'center'}}>About</Header>
        <Segment as="article" basic vertical className='embed'>
          <iframe src="https://docs.google.com/document/d/e/2PACX-1vTqbzVCUQ0idMjVoJbCt__5NkPxtmcFDFh_fG2MTHCxk6g4V0DxD_3Z-GP-HlgfwT9P_A8Ijpb-77qn/pub?embedded=true" frameBorder="0" marginHeight="0" marginWidth="0"></iframe>
        </Segment>
      </Container>
      {/* DO NOT REMOVE. Required by White Bird and MAC TOS. */}
      {whiteBirdAttribution}
      {mappingActionAttribution}
      <p style={{marginTop: '15px'}}></p>
    </>
  )
}

export default AboutPage