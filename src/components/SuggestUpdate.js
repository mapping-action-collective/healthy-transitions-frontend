import React from 'react'
import { Container, Header, Menu, Tab } from 'semantic-ui-react'

import './SuggestUpdate.css'

const FORMS = [
  {
    "name": "General Feedback",
    "url": "https://airtable.com/embed/shrf6rYC2BIZDA9rm?backgroundColor=red",
    "description": "Give feedback on the site, comment on a specific listing, or report a bug."
  },
  {
    "name": "Provider Form",
    "url": "https://airtable.com/embed/shrwr8FFVXxPXpMlc?backgroundColor=teal",
    "description": "For social service providers to enter or update their agency's information shown on the Map."
  },
]

function SuggestUpdate () {
  return (
    <Container as="main" id="suggest-update-page">
      <Tab className="embed" menu={{ secondary: true, pointing: true, }} panes={FORMS.map(({ name, description, url }) => ({
        menuItem: <Menu.Item key={name} as={Header}>{name}</Menu.Item>,
        render: () => <Tab.Pane content={<iframe title={description} src={url} frameborder="0" marginheight="0" marginwidth="0" />} />,
      }))} />
    </Container>
  )
}

export default SuggestUpdate
