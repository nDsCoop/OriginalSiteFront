import React, { Component } from 'react'

export class Datetime1 extends Component {
    constructor(){
        super()
        this.state = { time: new Date() }
    }
    loopTime()
    {
        this.setState({
            time: new Date()
        })
    }
    componentDidMount()
    {
        setInterval(() =>
            this.loopTime(), 1000
        )
    }
    render() {
        return (
            <>
                VietNam, {this.state.time.toLocaleDateString()}-{this.state.time.toLocaleTimeString()}
            </>
        )
    }
}

export default Datetime1
