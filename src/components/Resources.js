import React from 'react'
import { Container, Header, Item, Segment } from 'semantic-ui-react'

import './About.css'

// These will be pulled from API route
const resources = [
  {
    "name": "Self Enhancement Inc BIPOC Resource Guide",
    "link": "https://www.selfenhancement.org/resource",
    "resource_type": "website",
    "description": "Searchable website with a wide variety of resources, such as scholarships and internships, educational and job seeker services, and resources for basic needs and community building. The primary focus is resources for Black youth, but the guide also includes a variety of resources for outher BIPOC youth, including Indigenous, Latinx, Pacific Islander, Asian, Middle Eastern, and multiracial children, youth, and adults."
  },
  {
    "name": "15th Night Resource Guide",
    // this isn't a typo - this is actually the web address
    "link": "https://static1.squarespace.com/static/5a28dc928a02c7e25a162897/t/61f2dea678722b762096ee54/1643306676961/Resource+Guide+updated+1.21.22.pdf.pdf",
    "resource_type": "document",
    "description": "Resource list focused on houseless and low income youth in Eugene, Oregon."
  },
  {
    "name": "Douglas County Community Resource Guide",
    "link": "https://guides.ucclibrary.com/communityresources",
    "resource_type": "website",
    "description": "A searchable website with services available in Douglas County, Oregon."
  },
  {
    "name": "Brave Space Resource Website",
    "link": "https://www.bravespacellc.com/resources",
    "resource_type": "website",
    "description": "Trans-centric online resource guide. Includes information about Brave Space community services, gender-affirming service providers, free clothing, events, and more."
  },
  {
    "name": "TransPonder Resource Directory",
    "link": "https://transponder.community/resource-directory",
    "resource_type": "website",
    "description": "TransPonder is a trans-led organization in Eugene, Oregon. They provide a resource directory that is updated yearly. Resources include crisis resources, medical and mental health providers who serve the trans community, and more. Resources are personally verified by TransPonder staff."
  }
]

const disclaimer = "Inclusion on this list does not imply that Healthy Transtisions is affiliated with or endorses these organizations."

const getColor = index => [ "green", "teal", "blue", "violet", "purple", "pink", "red", "orange", "yellow", "olive", ][ index % 10 ]

function Resources() {
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