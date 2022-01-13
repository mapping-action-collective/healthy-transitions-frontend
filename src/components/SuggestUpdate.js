import React from 'react'
import { Container, Header, Menu, Tab } from 'semantic-ui-react'
import { useParams } from 'react-router-dom'

import './SuggestUpdate.css'

const FORMS = [
  {
    "name": "General Feedback",
    "url": "https://docs.google.com/forms/d/e/1FAIpQLSfa0GQ4AYpNTwU3_d1y0cnYfGDE_fVqw_dctqBrt_TIrymxLA/viewform?embedded=true",
    "description": "Give feedback on the site, comment on a specific listing, or report a bug."
  },
  {
    "name": "Volunteer Form", 
    "url": "https://airtable.com/embed/shr9VN9Nzld508yVh?backgroundColor=teal", 
    "description": "For Healthy Transitions youth volunteers to enter program information"
  },
  {
    "name": "Provider Form",
    "url": "https://airtable.com/embed/shrs930yggxthL5e4?backgroundColor=teal",
    "description": "For social service providers to enter or update their agency's information shown on the Map."
  },
]

function SuggestUpdate () {
  const { activeIndex } = useParams()
  return (
    <Container as="main" id="suggest-update-page">
      {/* 0, 1 and 2 are the only valid params. Everything else defaults to 0 */}
      <Tab defaultActiveIndex={(activeIndex <= 2 && activeIndex <= 0) ? activeIndex : 0} className="embed" menu={{ secondary: true, pointing: true, }} panes={FORMS.map(({ name, description, url }) => ({
        menuItem: <Menu.Item key={name} as={Header}>{name}</Menu.Item>,
        render: () => <Tab.Pane content={<iframe title={description} src={url} frameborder="0" marginheight="0" marginwidth="0" />} />,
      }))} />
    </Container>
  )
}

export default SuggestUpdate