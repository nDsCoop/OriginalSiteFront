import React, {useContext} from 'react'
import styled from 'styled-components';
import { WiThermometer, WiHumidity, WiBarometer, WiCloudyGusts } from 'react-icons/wi';

import Context1 from "../Context1";

const Detail1 = () => {
    
    const {coording, city, wind, weathers} = useContext(Context1);
    const { temp, humidity, pressure} = weathers;
    const { lat, lon } = coording;
    const { speed } = wind;
    const {name} = city;

    const items = [
        {
        id: 2,
          icon:<WiThermometer className="icon" />,
          label:'temp',
          value: (temp-273.15).toFixed(2),
          color: 'pink',
          unit: 'C',

      },
      {
        id: 3,
          icon:<WiHumidity className="icon" />,
          label:'humidity',
          value: humidity,
          color: 'green',
          unit: '%',
      },
      {
        id: 4,
          icon:<WiBarometer className="icon" />,
          label:'pressure',
          value: pressure,
          color: 'purple',
          unit: 'hPa',
      },
      {
        id: 1,
          icon:<WiCloudyGusts className="icon" />,
          label:'windspeed',
          value: speed,
          color: 'yellow',
          unit: 'm/s',
      },
      ];
    return (
        <section className='section'>
        <h4>Weather forecast for <span className="weather-city">{name}</span></h4>
        <p>Coordinates: <span className="coord-city">{lat},{lon}</span></p>
        <Wrapper>
            {items.map((item) => {
            return <Item key={item.id} {...item}></Item>;
            })}
        </Wrapper>
        </section>
  );
};

const Item = ({icon, label, value, color, unit}) => {
    return <article className="item">
      <span className={color}>{icon}</span>
        <p>{value}{unit}</p>
        <h4>{label}</h4>

    </article>
  }

const Wrapper = styled.section`
    display: grid;
    grid-template-columns: repeat( minmax(260px, 1fr));
    gap: 1rem 2rem;
    @media (max-width: 640px) {
    grid-template-columns: repeat( minmax(260px, 1fr));
    /* .item{
        
        padding: 1rem 2rem 1rem 2rem;
    } */
    }
.item {
    border-radius: var(--radius);
    padding: 1rem 4rem 1rem 4rem;
    background: var(--clr-white);
    display: grid;
    position: relative;
    grid-template-columns: auto 1fr;
    column-gap: 1rem;
    align-items: center;
    span {
        width: 3rem;
        height: 3rem;
        display: grid;
        place-items: center;
        border-radius: 50%;
    }
    .icon {
        font-size: 1.5rem;
    }
    h4 {
        color: rgba(0, 0, 0, 0.5);
        margin-bottom: 0;
        letter-spacing: 0;
        text-transform: capitalize;
    }
    p {
        color: rgba(0, 0, 0, 0.5);
        margin-bottom: 0;
        margin-top: 0rem;
        /* text-transform: capitalize; */
    }
    .pink {
        background: #ffe0f0;
        color: #da4a91;
    }
    .green {
        background: var(--clr-primary-10);
        color: var(--clr-primary-5);
    }
    .purple {
        background: #e6e6ff;
        color: #5d55fa;
    }
    .yellow {
        background: var(--clr-primary-9) ;
        color: rgb(221, 141, 37);
    }
    }
`;
export default Detail1
