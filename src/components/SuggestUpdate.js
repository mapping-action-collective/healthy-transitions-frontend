import React from 'react'
import { Container, Tab } from 'semantic-ui-react'

import './SuggestUpdate.css'

const FORMS = [
  {
    "name": "General Feedback",
    "url": "https://docs.google.com/forms/d/e/1FAIpQLSfa0GQ4AYpNTwU3_d1y0cnYfGDE_fVqw_dctqBrt_TIrymxLA/viewform?embedded=true",
    "description": "Give feedback on the site, comment on a specific listing, or report a bug."
  },
  {
    "name": "Provider Form",
    "url": "https://airtable.com/embed/shrs930yggxthL5e4?backgroundColor=teal",
    "description": "For social service providers to enter or update their agency's information shown on the Map."
  },
]

function SuggestUpdate () {
  return (
    <Container as="main" id="suggest-update-page">
      <Tab className="embed" menu={{ secondary: true, pointing: true, }} panes={FORMS.map(({ name, description, url }) => ({
        menuItem: name,
        render: () => <Tab.Pane content={<iframe title={description} src={url} frameborder="0" marginheight="0" marginwidth="0" />} />,
      }))} />
    </Container>
  )
}

export default SuggestUpdate