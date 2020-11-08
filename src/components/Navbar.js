import React, { Component } from 'react';
import logo from '../images/logoSvg.svg';
import {FaAlignRight} from 'react-icons/fa';
import {Link} from 'react-router-dom';
import styled from 'styled-components';

class Navbar extends Component {
	state={
		isOpen:false
	}
	handleToggle = () =>{
	this.setState({isOpen:!this.state.isOpen})
	
};

	 render() {
	 	return(
	 		<nav className="navbar">
				<div className="nav-center">
	 				<div className="nav-header">
	 					<Link to="/">
	 						<img style={{maxHeight: "2.6rem", maxWidth: "2.6rem"}} className="logoApp" src={logo} alt="Beach Resort" />
	 					</Link>
	 					<button type="button" 
	 						className="nav-btn"
							onClick={this.handleToggle}
						>
	 					<FaAlignRight className="nav-icon" />
	 					</button>
	 				</div>
					<ul className={this.state.isOpen ? "nav-links show-nav" : "nav-links"}>
						<li>
							<Link to="/">Home</Link>
						</li>
						<li>
							<Link to="/page1">Page1</Link>
						</li>
						<li>
							<Link to="/page2">Page2</Link>
						</li>
						<li>
							<Link to="/page3">Page3</Link>
						</li>
					</ul>
	 			</div>
	 		</nav>

	 		);
	 }
};

export default Navbar;