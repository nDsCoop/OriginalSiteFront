import React, {Component} from 'react'
import App3 from '../components/App3';
import Store from '../store';
import { Reconnect } from "./Reconnect";

export default class Page3 extends Component {
    constructor(props){
        super(props);
        this.state = {
            store: new Store(this),
        }
    }
    render(){
        const { store } = this.state;
        const isConnected = store.isConnected();
        // const me = store.getCurrentUser();
        return (
            <App3 store = { store } />
        )
       
            
        }
   
}
