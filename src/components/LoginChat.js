import React, { Component } from 'react'
import { TextField } from '@material-ui/core'
import { VERIFY_USER } from "../Events";

export default class LoginChat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nickname:"",
            error:""
        };
    }

    setUser = ({ user, isUser }) => {
        if(isUser) {
            this.setError("Username invalid")
        } else {
            this.props.setUser(user)
            this.setError("")
        }   
    }

    handleChange = (e) => {
        this.setState({nickname: e.target.value})
    }
    handleSubmit = (e) => {
        e.preventDefault();
        const { socket } = this.props
        const { nickname } = this.state
        socket.emit(VERIFY_USER, nickname, this.setUser) 
    }

    setError = (error) => {
        this.setState({error})
    }
    render() {
        const{ nickname, error } = this.state
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                <h2>Type nickName to continue</h2>
                <TextField
                    id="outlined-nickname-input"
                    label="Name"
                    type="text"
                    name="name"
                    autoComplete="name"
                    margin="normal"
                    variant="outlined"
                    value={nickname}
                    onChange={this.handleChange}
                    fullWidth
                    required
                />
                <div className="err">
                    {error ? error : null }
                </div>
                </form>
            </div>
        )
    }
}

