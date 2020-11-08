import React, { Component } from 'react';
import Hero from "../components/Hero";
import {Link} from 'react-router-dom';
import Banner from '../components/Banner';

//import {Grid, Cell, ProgressBar} from 'react-mdl';
class Error extends Component {
	 render() {
	 	return(
 				<Hero>
 					<Banner title='404' subtitle="Page Not Found">
 						<Link to='/home' className="btn-primary">
 						Return Home
 						</Link>
 					 </Banner>
 				 </Hero>
	 		);
	 }
}
export default Error;