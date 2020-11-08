import React, {useContext} from 'react'
import styled from 'styled-components';

import Context1 from "../Context1";


const Search1 = () => {
   const {api_call} = useContext(Context1);
    return (
        <Wrapper>
        <form onSubmit={api_call} className='form-control'>
        <input name="location" className="form-control mr-sm-2" type="search" placeholder="Type City/Country" aria-label="Search" />
        <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
        </form>
        </Wrapper>
    );
};
    const Wrapper = styled.div`
    display: grid;
    justify-content: center;
    gap: 1rem 1.75rem;
    @media (min-width: 768px) {
      grid-template-columns: 1fr max-content;
      align-items: center;
      h3 {
        padding: 0 0.5rem;
      }
    }
    .form-control {
      background: var(--clr-white);
      display: grid;
      align-items: center;
      grid-template-columns: auto 1fr auto;
      column-gap: 0.5rem;
      border-radius: 5px;
      padding: 0.5rem;
      input {
        border-color: transparent;
        outline-color: var(--clr-white);
        letter-spacing: var(--spacing);
        color: var(--clr-grey-3);
        padding: 0.75rem 1rem;
        font-size: .75rem
      }
      input::placeholder {
        color: var(--clr-grey-3);
        text-transform: capitalize;
        letter-spacing: var(--spacing);
      }
      button {
        border-radius: 5px;
        border-color: transparent;
        padding: 0.5rem 0.75rem;
        text-transform: capitalize;
        letter-spacing: var(--spacing);
        background: var(--clr-primary-5);
        color: var(--clr-white);
        transition: var(--transition);
        cursor: pointer;
        &:hover {
          background: var(--clr-primary-8);
          color: var(--clr-primary-1);
        }
      }
    }
  `;
export default Search1
