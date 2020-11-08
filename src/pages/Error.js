import React, { Component } from 'react';
import Hero from "../components/Hero";
import {Link} from 'react-router-dom';
import Banner from '../components/Banner';
import {Helmet} from "react-helmet";

//import {Grid, Cell, ProgressBar} from 'react-mdl';
class Error extends Component {
	 render() {
	 	return(
 				<Hero>
					<Helmet>
						<title>Error | nDsBuilding</title>
					</Helmet>
 					<Banner title='404' subtitle="Page Not Found">
 						<Link to='/' className="btn-primary">
 						Return Home
 						</Link>
 					 </Banner>
 				 </Hero>
	 		);
	 }
}
export default Error;