import React, { useEffect, useState } from 'react';
//import data from '../data';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { register } from '../actions/userActions';


function RegisterScreen(props) {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const userRegister = useSelector(state => state.userRegister);
    const { loading , userInfo, error } = userRegister;
    const redirect = props.location.search ? props.location.search.split("=")[1]:"/";

    const dispatch = useDispatch();

    useEffect(() => {
        if (userInfo) {
            props.history.push(redirect);
        }
              return () => {
                  //
          };
  
      }, [userInfo]);

     const submitHandler = (e) => {
         e.preventDefault();
         dispatch(register(name, email, password));
     }
    return <div className="form">
        <form onSubmit= {submitHandler}>
            <ul className="form-container">
                <li>
                    <h2>Register Account</h2>
                </li>
                { loading && <div>Loading...</div>}
                {error && <div>{error}</div>}
                <li>
                    <label htmlFor="name">
                        Your Name
                    </label>
                    <input type="name" name="name" id="name" onChange={(e) => setName(e.target.value)}></input>
                </li>
                <li>
                    <label htmlFor="email">
                        Email
                    </label>
                    <input type="email" name="email" id="email" onChange={(e) => setEmail(e.target.value)}></input>
                </li>
                <li>
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" onChange={(e) => setPassword(e.target.value)}></input>
                </li>
                <li>
                    <label htmlFor="rePassword">Re-Enter Password</label>
                    <input type="rePassword" id="rePassword" name="rePassword" onChange={(e) => setRePassword(e.target.value)}></input>
                </li>
                <li>
                    <button type="submit" className="button signin">Register</button>
                </li>
                <li>
                    Already have an account? 
                    <Link to={redirect === "/" ? "signin" : "signin?redirect=" + redirect} className="button secondary" >Sigin</Link>

                </li>
                <li>
                    <Link to="/socialLogin" className="button secondary" >Login with another account</Link>
                </li>
            </ul>
        </form>
       
    </div>
        
}
export default RegisterScreen; 