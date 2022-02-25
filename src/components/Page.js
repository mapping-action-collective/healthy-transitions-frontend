import { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom'
import { Menu, Segment } from 'semantic-ui-react'

import 'semantic-ui-css/semantic.min.css'
import './Page.css'

function Page({disclaimer, aboutText, resources, children}) {
  // Note: commented out because these are throwing errors I don't have time to look into
  // let location = useLocation();
  // useEffect(() => window.gtag('event', 'page_view', { 'page_location': window.location, 'page_path': location.pathname + location.hash }) || console.log(location), [location])
  return (<>
    <Segment as="header" basic vertical inverted>
      <Menu as="nav" size="massive" color="teal" secondary pointing className="container">
        <Menu.Item as={NavLink} to="/" end className="mac-logo">Mapping Action Collective</Menu.Item>
        <Menu.Item as={NavLink} to="/" end>Oregon Youth Resource Map</Menu.Item>
        {resources && <Menu.Item as={NavLink} to="/resources" position="right"><header>Resources</header></Menu.Item>}
        {aboutText && <Menu.Item as={NavLink} to="/about"><header>About</header></Menu.Item>}
        <Menu.Item as={NavLink} to="/suggest"><header>Suggest Update</header></Menu.Item>
      </Menu>
    </Segment>
    {children}
    <Segment as="footer" basic vertical>
      {/* <p>{disclaimer}</p> */}
    </Segment>
  </>)
}

export default Page
