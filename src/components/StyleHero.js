import styled from 'styled-components';
import defaultImg from '../images/imgWeather1.jpg';
import defaultImg1 from '../images/imgWeather3.jpg';

const StyledHero = styled.header`
min-height: 82vh;
background: url(${props => (props.img ? defaultImg1 : defaultImg )}) center/cover no-repeat;
display: flex;
align-items: center;
justify-content: center;
`;
export default StyledHero;