import React, { useState } from 'react';
import { Navbar, NavbarBrand, Collapse, Nav, NavItem, NavbarToggler} from 'reactstrap'
import { NavLink} from 'react-router-dom'; 
import { connect } from 'react-redux';
import Auth from './Auth'


const Header=({ auth }) =>{
    const [isNavOpen, setIsNavOpen] = useState(false);
    const toggleNav = () => {
      setIsNavOpen(!isNavOpen)
    }
    return(
        <>
        <Navbar dark expand="md">
          <div className="container">
            <NavbarToggler onClick={toggleNav}/>
            <NavbarBrand href="/">
              <h1>KHAN'S BLOG</h1>
            </NavbarBrand>
            <Collapse isOpen={isNavOpen} navbar>
              <Nav navbar className="ml-auto">
                {
                  auth.isAuthenticated?
                  <>
                  <NavItem active>
                    <NavLink exact  activeClassName='menu_active' className="nav-link" to="/">Home</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink exact  activeClassName='menu_active' className="nav-link" to="/profile">Profile</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink  exact  activeClassName='menu_active'className="nav-link" to="/mypost">My Post</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink  exact  activeClassName='menu_active' className="nav-link" to="/createpost">Create Post</NavLink>
                  </NavItem>
                  </>
                  :
                  <NavItem active>
                    <NavLink exact  activeClassName='menu_active' className="nav-link" to="/">Home</NavLink>
                  </NavItem>
                }
              </Nav>
            </Collapse>
            <Nav navbar>    
              <NavItem>
                <Auth />
              </NavItem>
            </Nav>
          </div>
        </Navbar>
        </>
    );
}; 

const mapStateToProps = (state) => ({ ...state })
export default  connect(mapStateToProps)(Header);