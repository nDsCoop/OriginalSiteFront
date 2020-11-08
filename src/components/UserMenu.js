import React, { Component } from 'react';
import _ from 'lodash';
import defaultImg from '../images/Logomini.svg';
import classNames from 'classnames';

export default class UserMenu extends Component {
    constructor(props){
        super(props);
        this.state = {
            message: null,
            showUserFrom : false,
            showUserMenu : false,
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
            showUserFrom: false
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
    const { user } = this.state;
    e.preventDefault();
   

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
        const { user, message } = this.state;
        const { store } = this.props;
        const me = store.getCurrentUser();
        const profileImg = _.get(me, 'avatar');
        return (
<></>
        )
    }
}
