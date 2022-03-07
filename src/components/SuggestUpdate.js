import React from 'react'
import { Container, Header, Menu, Tab } from 'semantic-ui-react'
import './SuggestUpdate.css'


function SuggestUpdate ({forms}) {
  return (
    <Container as="main" id="suggest-update-page">
      <Tab className="embed" menu={{ secondary: true, pointing: true, }} 
        panes={forms.map(({ name, description, url }) => ({
        menuItem: <Menu.Item key={name} as={Header}>{name}</Menu.Item>,
        render: () => <Tab.Pane content={<iframe title={description} src={url} frameBorder="0" marginHeight="0" marginWidth="0" />} />,
      }))} />
    </Container>
  )
}

export default SuggestUpdate