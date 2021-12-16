import { NavLink } from 'react-router-dom'
import { Menu, Segment } from 'semantic-ui-react'

import 'semantic-ui-css/semantic.min.css'
import './Page.css'

function Page({children}) {
  return (<>
    <Segment as="header" basic vertical inverted>
      <Menu as="nav" size="massive" color="teal" secondary pointing className="container">
        <Menu.Item as={NavLink} to="/" end className="mac-logo">Mapping Action Collective</Menu.Item>
        <Menu.Item as={NavLink} to="/" end>Oregon Youth Resource Map</Menu.Item>
        <Menu.Item as={NavLink} to="/about" position="right"><header>About</header></Menu.Item>
        <Menu.Item as={NavLink} to="/suggest"><header>Suggest Upate</header></Menu.Item>
      </Menu>
    </Segment>
    {children}
  </>)
}

export default Page
