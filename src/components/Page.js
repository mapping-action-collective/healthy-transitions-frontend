import { NavLink } from 'react-router-dom';
import { Dropdown, Menu, Segment } from 'semantic-ui-react'

import 'semantic-ui-css/semantic.min.css'
import './Page.css';

function Page({categories, children}) {
  return (
    <>
      <Segment as="header" color="black" basic inverted attached style={{ padding: 0, zIndex: 801 }}>
        <Menu as="nav" size="large" secondary inverted pointing className="container">
          <Menu.Item key="Home" as={NavLink} name="Home" to="/" end />
          { Object.entries(categories).map(([category, subcategories]) =>
            <Menu.Item key={category} as={Dropdown} text={category}>
              <Dropdown.Menu>
              { Object.entries(subcategories).map(([subcategory, count]) => <Dropdown.Item key={subcategory} as={NavLink} text={`${subcategory} (${count})`} to={`/?category=${encodeURIComponent(category)}: ${encodeURIComponent(subcategory)}`} />) }
              </Dropdown.Menu>
            </Menu.Item>
          ) }
          <Menu.Item key="Logo" header position="right">Healthy Transitions</Menu.Item>
        </Menu>
      </Segment>
      <main>
        {children}
      </main>
    </>
  );
}

export default Page;
