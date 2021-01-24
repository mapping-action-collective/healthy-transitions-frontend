import { Link } from 'react-router-dom';
import { Container, Menu } from 'semantic-ui-react'

import 'semantic-ui-css/semantic.min.css'
import './Page.css';

function Page({children}) {
  return (
    <>
      <Menu as="header" text className="container">
        <Menu.Item as={Link} name="Home" to="/" />
        <Menu.Item as={Link} name="Map" to="/map" />
      </Menu>
      <Container as="main">
        {children}
      </Container>
    </>
  );
}

export default Page;
