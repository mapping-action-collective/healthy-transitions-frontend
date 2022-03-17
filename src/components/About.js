// import React from 'react'
// import { Container, Header, Image, Item, Segment } from 'semantic-ui-react'
import React from 'react'
import { Container, Header, Menu, Tab, Segment, Item } from 'semantic-ui-react'
import './SuggestUpdate.css'
import whiteBirdLogo from './../resources/whiteBirdLogo.png'
// import {getColor} from './../utils'
import './About.css'

const contributorStyle = { fontSize: '1.15em' }
const greyText = {color: "dimgrey"}

// // TODO: get code for displaying the yt video link
// function AboutPage({aboutText, contributors, disclaimer, videoLink, rubric}) {


//   const genLogoStyle = { maxWidth: '125px', maxHeight: '75px', marginRight: '1.5em'}
//   const dsLogoStyle = { width: '150px', height: '75px', marginRight: '1em' }

//   return (
//     <Container as="main" id="about-page" text>
//       <Segment as="article" basic vertical>
//         <Header as="h1">About</Header>
//         <div>{aboutText.split('\n').map((paragraph, i) => <p key={i}>{paragraph}</p>)}</div>
//         {/* DO NOT REMOVE. Required by White Bird TOS. */}
//         {whiteBirdAttribution}
//         {rubric && <div>{rubric.split('\n').map((paragraph, i) => <p key={i}>{paragraph}</p>)}</div>}
//         </Segment>
//         {/* List of contributors/sponsors, including MAC */}
//         {contributors &&<Segment as="article" vertical>
//           <Header as="h1">About Our Contributors</Header>
//           {contributors.map((entry, index) => (
//             <Item style={whiteBirdStyle} key={entry.name}>
//               {entry.logo && <Image src={entry.logo} align='center' style={entry.name === 'Direction Service' ? dsLogoStyle : genLogoStyle} />}
//               <Item.Content>
//                 <Header as="a" color={getColor(index)} style={contributorStyle} href={entry.website_url ?? null} target="_blank">{entry.name}</Header>
//                 {entry.description && <Item.Description style={greyText}>{entry.description}</Item.Description>}
//               </Item.Content>
//             </Item>
//           ))}
//         </Segment>}
//         {disclaimer && <Segment basic vertical>
//         <p><span style={{fontWeight: 'bold'}}>Disclaimer: </span>{disclaimer}</p>
//         </Segment>}
//     </Container>
//   )
// }

// export default AboutPage


const whiteBirdStyle = {display: 'flex', padding: '1em 1em 1em 0', alignSelf: 'center' }
const whiteBirdAttribution = (<Item style={whiteBirdStyle}><Item.Image size='tiny' src={whiteBirdLogo} /><Item.Content style={{alignSelf: "center"}}>Some data was sourced from The Little Help Book published by White Bird Clinic.</Item.Content></Item>)

function AboutPage () {

  return (
    <>
    <Container as="main" id="about-page">
      <Header as="h1" style={{marginTop: '1em', textAlign: 'center'}}>About</Header>
      <Segment as="article" basic vertical className='embed'>
        <iframe src="https://docs.google.com/document/d/e/2PACX-1vTqbzVCUQ0idMjVoJbCt__5NkPxtmcFDFh_fG2MTHCxk6g4V0DxD_3Z-GP-HlgfwT9P_A8Ijpb-77qn/pub?embedded=true" frameBorder="0" marginHeight="0" marginWidth="0"></iframe>
      </Segment>
    </Container>
    {/* DO NOT REMOVE. Required by White Bird TOS. */}
    {whiteBirdAttribution}
    </>
  )
}

export default AboutPage