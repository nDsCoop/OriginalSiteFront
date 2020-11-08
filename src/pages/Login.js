import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import styled from 'styled-components';
import loginImg from '../images/login-img.svg';
import Hero from '../components/Hero';
import Banner from '../components/Banner';
import { Link } from 'react-router-dom';

const Login = () => {
  const { loginWithRedirect } = useAuth0();
  return (
    <Hero>
    <Banner title='LoginApp'>
        <Wrapper>
            <ul>
                <img src={loginImg} alt='login image' />
            </ul>
        <Link onClick={loginWithRedirect} className="btn-second">
            Log In / Sign Up
        </Link>
        </Wrapper>
     </Banner>
 </Hero>
  );
};
const Wrapper = styled.section`
  img {
    top:0;
    height: 50vh;
    width: 70vh;
  }
  .btn-second {
    display: inline-block;
    text-decoration: none;
    letter-spacing: var(--mainSpacing);
    color: var(--mainBlack);
    background: var(--primaryColor);
    padding: 0.4rem 0.9rem;
    border: 3px solid var(--primaryColor);
    transition: var(--mainTransition);
    text-transform: uppercase;
    cursor: pointer;
  }
  .btn-second:hover {
  background: transparent;
  color: var(--primaryColor);
}
`;
export default Login;