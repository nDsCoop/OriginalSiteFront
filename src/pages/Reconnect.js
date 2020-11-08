import React, { Component } from 'react';
import Hero from "../components/Hero";
import {Link} from 'react-router-dom';
import Banner from '../components/Banner';


export class Reconnect extends Component {
	 render() {
	 	return(
 				<Hero>
 					<Banner title='503' subtitle="Waitting for Reconnect to Server">
 						<Link to='/home' className="btn-primary">
 							Return Home
 						</Link>
 					 </Banner>
 				 </Hero>
	 		);
	 }
}