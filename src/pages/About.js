import React, { Component } from 'react';
import {Link, Route, Switch } from 'react-router-dom'
import {Helmet} from "react-helmet";
import DescriApp from "../../src/components/aboutApp/DescriApp" ;
import FeedbackApp from "../../src/components/aboutApp/FeedbackApp" ;
import ContributorsApp from "../../src/components/aboutApp/ContributorsApp" ;
import PrivateApp from "../../src/components/aboutApp/PrivateApp" ;
import img from "../images/svgnds.png";
import { IconButton, Grid } from '@material-ui/core';
import { IoLogoFacebook, IoLogoTwitter, IoLogoLinkedin, IoLogoGithub } from 'react-icons/io';
import { FaAlignLeft } from 'react-icons/fa';
export default class About extends Component {
	state={
		isOpen:false
	}
	handleToggle = () =>{
	this.setState({isOpen:!this.state.isOpen})
	
};
	 render() {
		
	 	return(

			<div className="about-app">
				<Helmet>
					<title>About | nDsBuilding</title>
				</Helmet>
				<div className="video-hero jquery-background-video-wrapper demo-video-wrapper">
					<video className="jquery-background-video" muted autoPlay loop poster="https://images.pexels.com/photos/316093/pexels-photo-316093.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260">
						<source src="https://static.videezy.com/system/resources/previews/000/038/963/original/190816-samutprakarn.mp4"/>
						<source src="https://static.videezy.com/system/resources/previews/000/022/198/original/underwater-effect-background.mp4" />
						<source src="https://static.videezy.com/system/resources/previews/000/047/918/original/DJI_0584.mp4" type="video/mp4" />
					</video>
				<div className="video-overlay"></div>
				<div className="page-width">
						<div className="video-hero--content">
						<h2>nDs App is a Title</h2>
						<p>is a message</p>
						
					
						</div>
					</div>
				</div>
			
		
			<div className="content">

				<div className="about-navbar">
					<div className="nav-header">

						<button type="button" 
	 						className="nav-btn"
							onClick={this.handleToggle}
						>
	 						<FaAlignLeft className="nav-icon" />
	 					</button>
						<div className="toggle-lang">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="25" height="25" aria-hidden="true" focusable="false" fill="currentColor">
							<path d="M217.982 201.586h-64.499c-5.537 0-10.026 4.489-10.026 10.026s4.489 10.026 10.026 10.026h53.547c-4.72 25.263-26.935 44.446-53.547 44.446-30.037 0-54.473-24.436-54.473-54.473s24.436-54.473 54.473-54.473c14.55 0 28.229 5.667 38.518 15.955 3.916 3.916 10.264 3.916 14.178 0 3.916-3.916 3.916-10.264 0-14.178-14.077-14.077-32.791-21.829-52.697-21.829-41.094 0-74.525 33.431-74.525 74.525 0 41.094 33.431 74.525 74.525 74.525s74.525-33.431 74.525-74.525c.001-5.536-4.488-10.025-10.025-10.025z"></path>
							<path d="M470.331 92.24H269.728l-26.935-81.355a10.025 10.025 0 00-9.518-6.875H41.669C18.693 4.01 0 22.703 0 45.679v332.412c0 22.976 18.693 41.669 41.669 41.669h203.145l27.073 81.369a10.026 10.026 0 009.513 6.861h188.932c22.976 0 41.669-18.693 41.669-41.669V133.909c-.001-22.976-18.694-41.669-41.67-41.669zM41.669 399.708c-11.919 0-21.616-9.697-21.616-21.616V45.679c0-11.919 9.697-21.616 21.616-21.616h184.364l70.691 213.516a.366.366 0 00.015.043l53.664 162.086H41.669zm295.78-116.433c.805 1.11 10.824 14.877 26.355 34.066-4.377 5.756-9.015 11.474-13.91 17.036l-29.712-89.74h87.441c-6.196 13.031-16.938 33.813-31.692 55.736-13.553-16.921-22.069-28.622-22.249-28.87-3.251-4.482-9.519-5.481-14.002-2.23-4.482 3.25-5.48 9.518-2.231 14.002zM265.946 419.76h75.162l-55.503 59.084-19.659-59.084zm226.002 46.561c0 11.919-9.697 21.616-21.616 21.616H304.575l67.015-71.339-.004-.003c.293-.312.571-.64.823-.991a10.025 10.025 0 001.39-9.022l-16.688-50.402c7.073-7.406 13.68-15.143 19.805-22.965 13.299 15.772 29.037 33.446 45.778 50.187 1.957 1.957 4.524 2.937 7.089 2.937s5.132-.979 7.089-2.937c3.916-3.916 3.916-10.264 0-14.178-17.461-17.461-34.013-36.244-47.687-52.632 21.251-30.503 35.033-59.504 40.535-71.954h21.454c5.537 0 10.026-4.489 10.026-10.026s-4.489-10.026-10.026-10.026h-66.173v-18.047c0-5.537-4.489-10.026-10.026-10.026s-10.026 4.489-10.026 10.026v18.046h-51.406l-37.178-112.292H470.33c11.919 0 21.616 9.697 21.616 21.616v332.412z"></path>
							</svg>
						</div>
					</div>
					
					<div className={this.state.isOpen ? "nav-items show-nav-items" : "nav-items"} >
						<Link to="/about">
							<div className="nav-item">
								Description
							</div>
						</Link>
						<Link to="/about/contributors">
							<div className="nav-item">
								Contributors
							</div>
						</Link>
						<Link to="/about/feedback">
							<div className="nav-item">
								FeedbackApp
							</div>
						</Link>
						<Link to="/about/privacy">
							<div className="nav-item">
								Privacy & Policy
							</div>
						</Link>
					</div>
					

				</div>
				<div className="about-main">
					<Switch>
						<Route exact path="/about">
							<DescriApp />
						</Route>

						<Route exact path="/about/privacy">
							<PrivateApp />
						</Route>
						
						<Route exact path="/about/feedback">
							<FeedbackApp />
						</Route>
							{/*<Route path="/about/Otherlink" component={DonatePage} /> */}
						<Route exact path="/about/contributors">
							<ContributorsApp />
						</Route>
						
					</Switch>
				</div>
			</div>
			<div className="footer-app">
				<div className="footer-app-left">
					<Grid
						// className={"playlistHeader"}
						container
						direction="column"
						alignItems="center"
						justify="space-between"
					>
						<div className="logo-left">
							<img src={img} alt="logo Footer" />
							<span>nDs-App</span>
						</div>
						<Link to={""}>
							<IoLogoTwitter className="cssIcons" />
						</Link>
						<Link to={""}>
							<IoLogoFacebook className="cssIcons" />
						</Link>
						<Link to={""}>
							<IoLogoLinkedin className="cssIcons" />
						</Link>
						<Link to={""}>
							<IoLogoGithub className="cssIcons" />
						</Link>

					</Grid>
									
					
				</div>
				<div className="footer-app-mid">
					<div className="list-footer">
						<div className="title-list-footer">nDsApp</div>
						<div>
							<ul>
								<li>
									<Link to="/">
										<div className="">
											HomeApp
										</div>
									</Link>
								</li>
								<li>
									<Link to="/page1">
										<div className="">
											MusicApp
										</div>
									</Link>
								</li>
								<li>
									<Link to="/page3">
										<div className="">
											ChatApp
										</div>
									</Link>
								</li>
								<li>
									<Link to="/page2">
										<div className="">
											WeatherApp
										</div>
									</Link>
								</li>
							</ul>
						</div>
					</div>
					<div className="list-footer">
						<div className="title-list-footer">External</div>
						<div>
							<ul>
								<li>
									<Link to="/">
										<div className="">
											Connect1
										</div>
									</Link>
								</li>
								<li>
									<Link to="/">
										<div className="">
											Connect2
										</div>
									</Link>
								</li>
								<li>
									<Link to="/">
										<div className="">
											Connect3
										</div>
									</Link>
								</li>
								<li>
									<Link to="/">
										<div className="">
											Connect2
										</div>
									</Link>
								</li>
								<li>
									<Link to="/">
										<div className="">
											Connect2
										</div>
									</Link>
								</li>
							</ul>
						</div>
					</div>
					<div className="list-footer">
						<div className="title-list-footer">About</div>
						<div>
							<ul>
								<li>
									<Link to="/about">
										<div className="">
											Description
										</div>
									</Link>
								</li>
								<li>
									<Link to="/about/feedback">
										<div className="">
											Feedback
										</div>
									</Link>
								</li>
								<li>
									<Link to="/about/contributors">
										<div className="">
											Contributors
										</div>
									</Link>
								</li>
								<li>
									<Link to="/about/privacy">
										<div className="">
											Privacy & Policy
										</div>
									</Link>
								</li>
								
							</ul>
						</div>
					</div>
				</div>
			</div>
			<div className="footer-app-light">
				<div className="footer-app-left-light">
					<p>Allowed to build and develop under the management of nDs</p>
					<p>XaLoHaNoi, LinhTrung, ThuDuc, HCMC</p>
					<p>Publicly Released: ThuDuc,Day Month Year</p>
				</div>
				<div className="footer-app-right-light">
					nDsApp © 2020 nDs.,SDG. All rights reserved
				</div>
			</div>
			<div className="mess-nds">
				<p>THANK YOU FOR COMING TO US</p>
			</div>
			
		</div>
	 	);
	}
}
