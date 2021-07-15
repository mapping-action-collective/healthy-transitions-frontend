import { NavLink } from 'react-router-dom';
import { Menu, Segment } from 'semantic-ui-react'

import 'semantic-ui-css/semantic.min.css'
import './Page.css';

function Page({children}) {
  return (
    <>
      <Segment as="header" color="black" basic inverted attached style={{padding:0}}>
        <Menu as="nav" size="massive" secondary inverted pointing className="container">
          <Menu.Item as={NavLink} name="Home" to="/" end />
          <Menu.Item header position="right">Healthy Transitions</Menu.Item>
        </Menu>
      </Segment>
      <main>
        {children}
      </main>
    </>
  );
}

export default Page;
