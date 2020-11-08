import React, {useState} from 'react'
// import { Link } from 'react-router-dom';
import styled from 'styled-components';
// import Hero from './Hero';
import Banner from './Banner';
// import Main1 from './Main1';
import axios from 'axios';
import Content1 from './Content1';
import Detail1 from './Detail1';
import Search1 from './Search1';
import Context1 from '../Context1';
import StyledHero from './StyleHero';
// import defaultImg from '../images/imgWeather1.jpg';
import mock1 from "./data1.js/mockName";
import mock2 from "./data1.js/mockWind";
import mock3 from "./data1.js/mockCoord";
import mock4 from "./data1.js/mockMain";
// import Datetime1 from './Datetime1';





const App1 = () => {
  const [weathers, setWeather] = useState(mock4);
  const [coording, setCoord] = useState(mock3);
  const [wind, setWind] = useState(mock2); 
  let [img, setImg] = useState("");
  const [city, setCity] = useState(mock1);
    const api_call = async e => {
    e.preventDefault();
    const location = e.target.elements.location.value;
    const API_KEY = "cc8f77093d29a14ebde27ae45bf28497";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}`;
    const req = axios.get(url) ;
    const res = await req ;
   
    setCoord(res.data.coord);
    setWind(res.data.wind);
    setWeather(res.data.main);
    setCity(res.data);
    
    // 
    if(res.data)
    {
      setImg("../images/imgWeather3.jpg");
    }
    else {
      setImg(null);
    }
  }
 
  // useEffect(() => {
  //   api_call()
   
  // }, [])
    return (
      <StyledHero img={img}>
         <Wrapper>
          <div className='container'>
            <Banner title="Weather App" subtitle="Where you pass the mind?">
              <Content1>
                <Context1.Provider value={{ api_call, weathers, coording, wind, city }}>
                  <Search1 api_call={api_call}/>
                  {weathers && <Detail1 /> }
                  </Context1.Provider>
              </Content1>
            </Banner>
          </div>
         </Wrapper>
      </StyledHero>
       
    );
  };
  const Wrapper = styled.section`
    /* min-height: 100vh; */
    display: grid;
    /* width: 60vw; */
    place-items: center;
    text-align: center;
    /* .container {
      width: 90vw;
      max-width: 600px;
      text-align: center;
    } */
  `;
export default App1
