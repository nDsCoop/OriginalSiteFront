import React, { Component } from 'react';
import defaultImg from '../images/logoSvg.svg';
import _ from 'lodash';
import classNames from 'classnames';
import { IconButton } from '@material-ui/core';
import { MdSettings, MdDeleteForever } from 'react-icons/md';



export class UserBar extends Component {
    constructor(){
        super()
        this.state = {
            message: null,
            showUserFrom : false,
            isLogin: true,
            user: {
                email: '',
                password: '',
                name: ''
            }
        }
    }
    
    onClickOutSide = (e) => {
        if(this.ref && !this.ref.contains(e.target)){
            console.log("Here click out side login form!");
            this.setState({
                showUserFrom: false,
                showUserMenu: false
            })
        }
    }
    componentDidMount(){
        window.addEventListener('mousedown', this.onClickOutSide);
        console.log('Didmount');
    }
    componentWillUnmount(){
        window.removeEventListener('mousedown', this.onClickOutSide);
        console.log('Unmount');
    }
    onSubmit = (e) => {
        const { store } = this.props;
        const { user , isLogin } = this.state;
        e.preventDefault();
        this.setState({
            message: null
        }, () => {
            if(isLogin){
                store.login(user.email, user.password).then((user) => {
                    this.setState({
                        message: null,
                        showUserFrom: false,
                        showUserMenu: false
                    })
    
                }).catch((err) => {
                    console.log(err);
                    this.setState({
                        message: {
                            body: err,
                            type: 'error'
                        }
                    })
                });
            } else {
                store.register(user).then((_) => {
                    this.setState({
                        message: {
                            body: 'User created',
                            type: 'Success'
                        }
                    }, () => {
                        // now login this user
                        store.login(user.email, user.password).then((user) => { 
                        //
                        this.setState({
                            message: null,
                            showUserFrom: false,
                            showUserMenu: false
                        })
        
                    }).catch((err) => {
                        console.log(err);
                        this.setState({
                            message: {
                                body: err,
                                type: 'error'
                            }
                        })
                        });
                    })
                });
            }
           
        })

    }

    onTxtfieldChange = (e) => {
        let { user } = this.state;
        const field = e.target.name;
        user[field] = e.target.value;
        this.setState({
            user: user
        });
    }

    render() {
        const { user, message, isLogin } = this.state;
        const { store } = this.props;
        const me = store.getCurrentUser();
        const profileImg = _.get(me, 'avatar');
        const name = _.get(me,'name');
        const email = _.get(me, 'email');
        const avatar = _.get(me , 'avatar');
        return (
    <>
        <div className="user-bar">
            { !me ? <button type="button" onClick={(e) => this.setState({showUserFrom: true})} className="login-btn">Sign In</button> : null}
            <div className="name-user">{_.get(me, 'name')}</div>
            <img src={profileImg ? profileImg : defaultImg} onClick={(e) => this.setState({showUserMenu: true})}  alt="user-img" className="img-user"></img>

            { me && this.state.showUserMenu ?  <div className="user-form-1" ref = {(ref) => this.ref = ref}>
                <form onSubmit= {this.onSubmit}>
                <ul className="form-container">
                    <li>
                        <h4>Your Account</h4>
                    </li>
                    {/* <li>
                        { message ? <p className={classNames('app-msg', _.get(message, 'type'))}>
                            {_.get(message, 'body')}
                        </p> : null } 
                    </li> */}
                    <li className ="header-menu">
                        <img src={avatar} alt="user-img" />
                        <span>{name}</span>
                    </li>
                    <div className ="body-menu">
                        <p htmlFor="email">Name: {name}</p>
                        <div>
                        <IconButton  style={{ color: "rgba(0, 0, 0, 0.5)"}}>
                            <MdSettings />
                        </IconButton>
                        </div>
                    </div>
                    <div className ="body-menu">
                        <p htmlFor="email">Eamil: {email}</p>
                        <div> <IconButton  style={{ color: "rgba(0, 0, 0, 0.5)"}}>
                            <MdSettings />
                        </IconButton></div>
                    </div>
                    {/* <li>
                        <label htmlFor="text">
                        UserName
                        </label>
                        <input onChange={(e) => this.onTxtfieldChange(e) } 
                        required type="text" name="name"
                        value = {_.get(user, 'name')} 
                        id="name" ></input>
                        <button type="button" className="login-btn">Change</button>
                    </li> */}
                    {/* <li>
                        <label htmlFor="email">
                        Email
                        </label>
                        <input onChange={(e) => this.onTxtfieldChange(e) } 
                        autoComplete = {email}
                        required type="email" name="email"
                        value = {_.get(user, 'email')} 
                        id="email" ></input>
                    </li> */}
                    {/* <li>
                        <label htmlFor="password">Password</label>
                        <input onChange={(e) => this.onTxtfieldChange(e) }
                        autoComplete = {'off'}  
                        required type="password"
                        value = {_.get(user, 'password')} 
                        id="password" name="password" ></input>
                        <button type="button" className="login-btn">Change</button>
                    </li> */}
                    
                    <div className="footer-menu">
                        <div className="img">
                            <img style={{maxHeight: "5rem", maxWidth: "5rem"}} src={defaultImg} alt="nds"/>
                        </div>
                        <div className="btn-cc">
                        <li>
                        <button onClick = { () => store.signOut()}
                        type="button" className="login-btn">Signout</button>
                        </li>
                    {/* <li>
                        <button className="login-btn" >Create new account?</button>
                    </li> */}
                        </div>
                    </div>
                </ul>
                </form>
                </div>
                :
                null
            }
             { !me && this.state.showUserFrom ? <div className="user-form" ref = {(ref) => this.ref = ref}>
                <form onSubmit= {this.onSubmit}>
                <ul className="form-container">
                    <li>
                        <h4>Sign In / Register Your Account</h4>
                    </li>
                    <li>
                        { message ? <p className={classNames('app-msg', _.get(message, 'type'))}>
                            {_.get(message, 'body')}
                        </p> : null } 
                    </li>
                    {
                        !isLogin ? <li>
                        <label htmlFor="name">
                        Name
                        </label>
                        <input onChange={(e) => this.onTxtfieldChange(e) } 
                        placeholder="Your-Name" 
                        required type="text" name="name"
                        value = {_.get(user, 'name')} 
                        id="name" ></input>
                    </li>
                    :
                    null
                    }
                    
                    <li>
                        <label htmlFor="email">
                        Email
                        </label>
                        <input onChange={(e) => this.onTxtfieldChange(e) } 
                        placeholder="example.vn@nds.com" 
                        required type="email" name="email"
                        value = {_.get(user, 'email')} 
                        id="email" ></input>
                    </li>
                    <li>
                        <label htmlFor="password">Password</label>
                        <input onChange={(e) => this.onTxtfieldChange(e) }
                        autoComplete = {'off'} 
                        placeholder="Your-password" 
                        required type="password"
                        value = {_.get(user, 'password')} 
                        id="password" name="password" ></input>
                    </li>
                    <div className="footer-login">
                        <div className="img">
                            <img style={{maxHeight: "5rem", maxWidth: "5rem"}} src={defaultImg} alt="nds"/>
                        </div>
                        <div className="btn-cc">
                        <li>
                        <button type="submit" className="login-btn">{isLogin ? 'Log In' : 'New Account'}</button>
                    </li>
                    {isLogin ? <li>
                       <button onClick = {() => {
                          this.setState({
                              isLogin: false,
                          })
                      }}
                      className="login-btn" >Create new account?</button>
                      </li> : null }
                        </div>
                    </div>
                </ul>
                </form>
                </div>
                :
                null
        }
 
           
           
        
        </div>
    </>
    )
    }
}

export default UserBar




