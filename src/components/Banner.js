import React from 'react';
import Datetime1 from './Datetime1';
import styled from 'styled-components';

//const RoomContext = React.createCo
const Banner = ({children, title, subtitle}) => {
	 	return(
			<Wrapper>
				<div className="banner">
					<h1>{title}</h1>
					<div></div>
					<Datetime1 />
					<p>{subtitle}</p>
					{children}
	 			</div>
			</Wrapper>
	 		);

	};
	
	const Wrapper = styled.section`
	p{
		margin-top:2rem;
			}
	`;

export default Banner