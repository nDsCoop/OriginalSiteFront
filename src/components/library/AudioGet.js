import React, { Component } from 'react';
import {ObjectID} from "../../helpers/objectid";
import AudioAnalyser from './AudioAnalyser';
import { IconButton } from '@material-ui/core';
import { CgSoftwareUpload } from 'react-icons/cg';

class AudioGet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      audio: false,
      isShowGetAudi: false,
      temp : 10000,
    }
  }

  async getMicrophone() {

    const audio = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false
    });
    this.setState({ audio: true });
    const mediaRecorder = new MediaRecorder(audio);
    mediaRecorder.start();
   
    setTimeout(() => {
      this.getAudio(mediaRecorder)
      // this.state.audio.getTracks().forEach(track => track.stop());
      // this.setState({ audio: null });
      this.setState({temp : 10000})

  }, this.state.temp);
}

  getAudio = (mediaRecorder) => {
    mediaRecorder.onstop = function(e) {
      const blob = new Blob({ 
          'type' : 'audio/ogg',
          'lastModified': new Date(),
          'name': new ObjectID().toString(),
          'path' :new ObjectID().toString(),
   });
     
  }
  mediaRecorder.ondataavailable = function(e) {
   
    console.log('Final: ' ,e.data);
    console.log("Pressed btn stop record!");
    } 

    this.state.audio.getTracks().forEach( track =>{
      console.log(track);
      track.stop();
    });
    this.setState({ audio: null });

  }

    


toggleMicrophone = () => {
  if (this.state.isShowGetAudi) {
    this.getMicrophone();
  } 
}
  componentDidMount(){
    window.addEventListener('mousedown', this.onClickOutSide);
    // this.addTestMessages();
    // console.log("CDidMount");
  }
  componentWillUnmount(){
    window.removeEventListener('mousedown', this.onClickOutSide);
  }
  onClickOutSide = (e) => {
    if(this.ref && !this.ref.contains(e.target)){
        // console.log("Here click out side login form!");
       
        this.setState({
            showGetAudi: false,
        })
    } else this.getMicrophone();
}

  
  render() {
    const { isShowGetAudi } = this.state
    return(
      <>
       {
         isShowGetAudi ? <div className="getAdi">
                  <div>
                  {this.state.audio ? <AudioAnalyser audio={this.state.audio} /> : null}
                  </div>
          </div> : null
      }
      <IconButton ref = {(ref) => this.ref = ref} onClick = {() => this.setState({isShowGetAudi: !isShowGetAudi})} >
      <CgSoftwareUpload />
      </IconButton>
      </>

    ) 
  }
}

export default AudioGet;