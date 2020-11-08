import React from 'react';
import Hero from "../components/Hero";
import Banner from "../components/Banner";
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth0 } from '@auth0/auth0-react';
import { useCookies } from 'react-cookie';
import { Divider} from '@material-ui/core';
import {Helmet} from "react-helmet";
import "../external/fetchIPclient";
const Home = () => {
		const {
			isAuthenticated,
			loginWithRedirect,
			logout,
			user,
			// isLoading,
		  } = useAuth0();
		  const [cookies, setCookie] = useCookies(['name']);
		  const isUser = isAuthenticated && user;
		  setCookie('name', {user} , { path: '/' });
	 	return (
	 	<>
		 <Helmet>
			<title>Home | nDsBuilding</title>
		</Helmet>
	 	<Hero>
	 		<Banner title="Welcome to nDsApp" subtitle="
				Interesting Experience Right Now">
				<Wrapper>
				<Divider className="divider"/>
				{isUser && user.picture &&  <img src={user.picture} alt={user.name} />}
				{isUser && user.name && <h4>Welcome, <strong>{user.nickname.toUpperCase()}</strong></h4>}     
				{isUser ?
					
					<Link to='/' className="btn-primary" onClick={() => {logout({returnTo:window.location.origin})}}>logout</Link>
					:
					<Link to='' className="btn-primary" onClick={loginWithRedirect}>login</Link>
				}
			</Wrapper>
	 	 	</Banner>
	 	 </Hero>
	 	 </>
	 	);
	};

	const Wrapper = styled.nav`
	h4 {
		margin-bottom: 0;
		font-weight: 400;
	}
	img {
		width: 60px !important;
		height: 60px;
		border-radius: 50%;
		object-fit: cover;
	}
	.divider{
		width: 100%;
    	margin-bottom: 2rem;
		border-top: .1rem solid  var(--clr-grey-5);
	}
	.btn-primary{
		margin-top: 1rem;
	}
	`;

export default Home;
