import React from 'react'
import { Container, Header, Item, Segment } from 'semantic-ui-react'

import './About.css'

const disclaimer = "Inclusion on this list does not imply that Healthy Transitions is affiliated these organizations."

const getColor = index => [ "green", "teal", "blue", "violet", "purple", "pink", "red", "orange", "yellow", "olive", ][ index % 10 ]

function Resources({resources}) {
  console.log(resources)
  return (
    <Container as="main" id="about-page" text>
      <Segment as="article" basic vertical>
        <Header as="h1" content='More Resources' subheader='These links will take you to external PDFs or websites.' />
        <Item.Group link divided>
          
          {resources.map((e, i) => (
            <Item key={e.name}>
              <Item.Content>
                <Header href={e.link} target='_blank' color={getColor(i)}>{e.name}</Header>
                <Item.Description>{e.description}</Item.Description>
              </Item.Content>
            </Item>
          ))}
          {/* <Item content={disclaimer} /> */}
        </Item.Group>
      </Segment>
    </Container>
  )
}

export default Resources