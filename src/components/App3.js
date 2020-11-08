import React, { Component } from 'react'
import defaultImg from '../images/Logosvg3.svg';
import className from 'classnames';
import { Link } from 'react-router-dom';
import { OrderedMap } from 'immutable';
import _, { chunk } from 'lodash';
import {ObjectID} from "../helpers/objectid";
import { IconButton } from '@material-ui/core';
import { CgSoftwareUpload } from 'react-icons/cg'
import { MdSettings, MdDeleteForever, MdInsertEmoticon, MdMic } from 'react-icons/md';
import moment from 'moment';
import { UserBar } from "./UserBar";
import Dropzone from "react-dropzone";
import Picker, { SKIN_TONE_MEDIUM_DARK } from 'emoji-picker-react';
import AudioAnalyser from './library/AudioAnalyser';
// import { ReactMic } from 'react-mic';



export default class App3 extends Component {
    constructor(props){
        super(props);
        this.state = {
            height: window.innerHeight,
            newMessage: '',
            searchUser: '',
            showSearchUser : false,
            isTyping: false,
            showEmoji: false,
            audio: null,
            temp : 5000,
            isShowGetAud: false,
            record: false,
        }

    }
   
   
    async startRecording() {
        const {store} = this.props;
        const audio = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        this.setState({ audio });
        this.setState({isShowGetAud: true});
        this.setState({ record: true });

        const chunks = [];
        const recoder = new MediaRecorder(audio);
        recoder.start();

        recoder.ondataavailable = function(e) {
            chunks.push(e.data);
            const namefile = new ObjectID().toString();
            let files = new File(chunks, `${namefile+'.mp3'}` , {type: "audio/wav"});
            const path = URL.createObjectURL(files);
            files.path = `${_.toString(path.substring(27)+'.mp3')}`;
            const name = _.toString(files.path);
            files.fileName = `${name}`;
            // console.log("file goc 1: ", files);
            let file = [];
            file.push(files);
            // console.log("File goc", file);
            const formData = new FormData();
            formData.append('file', file[0] );
            // store.upLoadfile(formData);
        }
    }
        
    //stop
    stopRecording() {
       if(this.state.audio !== null){
        this.state.audio.getTracks().forEach(track => track.stop());
        this.setState({ audio: null });
        this.setState({ record: false }); 
       } else {
           console.log("Error shortage-lenght!");
       }
               
        
    }


        
        onClickOutSide = (e) => {
            if(this.ref && !this.ref.contains(e.target)){
                // console.log("Here click out side login form!");
                this.setState({
                    showEmoji: false,
                })
            }
        }

        onDrop = (files) => {
            const {store} = this.props;
            console.log("file goc: ",files);
            let formData = new FormData;
            formData.append("file", files[0]);
            store.upLoadfile(formData);
            console.log("file format: ",formData);
        }


        componentWillUnmount() {
            this.stopCheckingTyping()
        }

        sendTyping = () =>{
            const { store } = this.props;
            const activeChannel = store.getActiveChannel();
            this.lastUpdateTime = Date.now()
            if(!this.state.isTyping){
                this.setState({isTyping:true});
                store.addTyping(activeChannel, true);
                this.startCheckingTyping();

            }
        }

	/*
	*	startCheckingTyping
	*	Start an interval that checks if the user is typing.
	*/
        startCheckingTyping = ()=>{
            console.log("Typing");
            this.typingInterval = setInterval(()=>{
                if((Date.now() - this.lastUpdateTime) > 350){
                    this.setState({isTyping:false})
                    this.stopCheckingTyping()
                }
            }, 300)
        }
	/*
	*	stopCheckingTyping
	*	Start the interval from checking if the user is typing.
	*/
        stopCheckingTyping = ()=>{
            const { store } = this.props;
            const activeChannel = store.getActiveChannel();
            console.log("Stop Typing");
            if(this.typingInterval){
                clearInterval(this.typingInterval)
                store.addTyping(activeChannel, false);
            // console.log(this.state.isTyping);
            }
        }


    renderChannelAvatar(channel){
        const {store} = this.props;

        const members = store.getMembersFromChannel(channel);

        const maxDisplay = 4;
        const total = members.size > maxDisplay ? maxDisplay : members.size;

        const avatars = members.map((user, index) => {



            return index < maxDisplay ?  <img key={index} src={_.get(user, 'avatar')} alt={_.get(user, 'name')} /> : null

        });


        return <div className={className('channel-avatars', `channel-avatars-${total}`)}>{avatars}</div>
    }
    renderChannelTitle = (channel = null) => {
        const { store } = this.props;
        const members = store.getMembersFromChannel(channel);
         const names = [];

         members.forEach((user) => {
             const name = _.get(user, 'name')
             names.push(name);
         });
         let title = _.join(names, ', ');
         if(!title && _.get(channel, 'isNew')){
             title = 'New Mss';
         }
        return <h4>{title}</h4>
    }
   
    handleOnClick = (user) => {
       
        const { store } =this.props;
        const userId = _.get(user, '_id');
        const channelId = _.get( store.getActiveChannel(),'_id')
        store.addUserToChannel(channelId, userId);
        this.setState({
            searchUser: '',
        })
    }
    _onCreateChannel = (e) => {
        e.preventDefault()
        const { store } =this.props;
        const currentUser = store.getCurrentUser();
        const currentUserId = _.get(currentUser, '_id');
        const channelId = new ObjectID().toString();
        const channel = {
            _id: channelId,
            title: "",
            lastMessage: "Let's a chat",
            members: new OrderedMap(),
            messages: new OrderedMap(),
            isNew: true,
            userId: currentUserId,
            created: new Date(),
            typing: false,
        };
        channel.members = channel.members.set(currentUserId, true);
        store.onCreateNewChannel(channel);
    }
    scrollMessagesToBottom = () => {
        if(this.messagesRef){
            this.messagesRef.scrollTop = this.messagesRef.scrollHeight;
        }
    }
    // renderMessage(message){
    //     const txt = _.get(message, 'body' , '');
    //     const html = _.split(txt, '\n').map((m, key) => {
    //         return <p key={key} dangerouslySetInnerHTML={{ __html: m }}></p>
    //     })

    //         message.substring(0, 8) === "uploads/" ?
    //             // this will be either video or image 

    //             message.substring(message.length - 3, message.length) === 'mp4' ?
    //                 <video
    //                     style={{ maxWidth: '200px' }}
    //                     src={`http://localhost:3000/${message.body}`} alt="video"
    //                     type="video/mp4" controls
    //                 />
    //                 :
    //                 <img
    //                     style={{ maxWidth: '200px' }}
    //                     src={`http://localhost:5000/${message.body}`}
    //                     alt="img"
    //                 />
    //         :
    //         <p>
    //             {message.body}
    //         </p>

        
        
    //     return html;
    // }
    handleSubmit = (e) => {

        const { newMessage } = this.state;
        const { store } = this.props;
        e.preventDefault();

        if(_.trim(newMessage).length){
            const messageId = new ObjectID().toString();
            const channel = store.getActiveChannel();
            const channelId = _.get(channel , '_id', null);
            const currentUser = store.getCurrentUser();
            const message = {
                _id: messageId,
                channelId: channelId,
                body : newMessage,
                userId: _.get(currentUser, '_id'),
                type:"text",
                me: true,
            };
            
            store.addMessage(messageId, message);
            this.setState({newMessage: ""});
        }
        this.setState({
            newMessage: "",
            showEmoji: false
        });

    };
    _onResi = () => {
        this.setState({height: window.innerHeight});
    }
    // addTestMessages = () => {
    //     const {store} = this.props

      
    //     for(let i = 0; i < 20; i++){
    //         let isMe = false;
    //         if(i % 2 === 0) {
    //             isMe = true;
    //         }
    //         const newMsg = {
    //             _id: `${i}`,
    //             author: `Author: ${i}`,
    //             body: `The body of message ${i}`,
    //             avatar: defaultImg,
    //             me: isMe,
    //             timing: '0:00'
    //         }
    //         store.addMessage(i, newMsg);

    //     }

    //     for (let c = 0; c<10; c++){
    //         const newChannel ={
    //             _id: `${c}`,
    //             title: `Channel title ${c}`,
    //             lastMessage: `Hey there is.. ${c}`,
    //             members: new OrderedMap({
    //                 '1': true,
    //                 '2': true,
    //             }),
    //             messages: new OrderedMap(),
    //             created: new Date(),
    //         }
    //         const moreMsgId =`${c + 1}`;
    //         const msgId = `${c}`;
    //         newChannel.messages = newChannel.messages.set(msgId, true);
    //         newChannel.messages = newChannel.messages.set(moreMsgId, true);
    //         store.addChannel(c, newChannel);
    //     }

    // }
    componentDidUpdate(){
        this.scrollMessagesToBottom();
        // console.log("CDidUpdate");
       
    }
    componentDidMount(){
        window.addEventListener('resize', this._onResi);
        window.addEventListener('mousedown', this.onClickOutSide);
        // this.addTestMessages();
        // console.log("CDidMount");
    }
    componentWillUnmount(){
        window.removeEventListener('resize', this._onResi);
        window.removeEventListener('mousedown', this.onClickOutSide);
        // console.log("CWillUnMount");
    }
    
    render() {

        const { height, newMessage, showEmoji, isShowGetAud} = this.state;
        const { store } = this.props;
        // const isConnected = store.isConnected();
        const activeChannel = store.getActiveChannel();
        const messages = store.getMessagesFromChannel(activeChannel);
        const members = store.getMembersFromChannel(activeChannel);
        const channels = store.getChannels();
        const usersList = store.getSearchUsers();
        const me = store.getCurrentUser();

        const onEmojiClick = (event, emojiObject) => {
            this.setState({newMessage:`${emojiObject.emoji}`});
            console.log(`${emojiObject.emoji}`);
        }
       

        const style = {
            height: height,
        }
        const resultSearch = () => {

                return (
                    <div className="search-user">
                        <div className="user-list">
                        {usersList.map((user, index) =>{
                            return <div onClick={() => this.handleOnClick(user)} key={index} className="user">
                            <img src={user.avatar} alt={user.name} />
                            <span>{user.name}</span>
                        </div>
                        })
                        } 
                        </div>
                    </div>
                )
        }
        return (
            <div style={style} className="app3">
               <div className="chat-header">
                    <div className="header-left">
                        <div className="action">
                            <Link onClick={(e) => this._onCreateChannel(e)} className="btn-primary">AddNew</Link>
                        </div>
                    </div>
                    {_.get(activeChannel, 'isNew') ? <div className="toolbar">
                        <form className="tool">
                            <textarea
                            type="text"
                            value ={ this.state.searchUser }
                            placeholder="To UserName/Email"
                            onChange = {(e) => {
                                const searchTxt = _.get(e, 'target.value');
                                this.setState({
                                    searchUser: searchTxt,
                                }, () => {
                                    store.startSearchUsers(searchTxt);
                                })
                                
                            }}
                            />
                        </form>
                        {resultSearch()}
                        </div> : null }

                    <div className="header-mid">
                        { this.renderChannelTitle(activeChannel) }
                    </div>
                    <div className="header-right">
                        <UserBar store = { store } />
                        <div className="toolsRight-bar">
                        <IconButton  style={{ color: "rgba(0, 0, 0, 0.5)"}}>
                            <MdSettings />
                        </IconButton>
                        </div>
                    </div>
                </div>
                <div className="chat-main">
                    <div className="sidebar-left">
                        <div className="chanels">
                            {channels.map((channel, index) =>{
                                return (
                                    <div onClick= {(index) => {
                                        store.setActiveChannelId(channel._id);
                                    }} key={channel._id} className={className('chanel', {'active' : _.get(activeChannel, '_id') === _.get(channel, '_id', null)})}>
                                        <div className="user-img">
                                            {this.renderChannelAvatar(channel)}
                                        </div>
                                        <div className={className('chanel-info',{'notify': _.get(channel, 'notify', null)})}>
                                            {this.renderChannelTitle(channel)}
                                            {/* <p>{channel.lastMessage}</p> */}
                                        </div>
                                    </div>
                                )
                            })}
                            
                        </div>
                    </div>
                    <div className="chat-content">
                        <div className="toolChat">
                            <Dropzone onDrop={this.onDrop}>
                                {({getRootProps, getInputProps}) => (
                                    <section>
                                    <div {...getRootProps()}>
                                        <input {...getInputProps()} />
                                        <IconButton>
                                            <CgSoftwareUpload />
                                        </IconButton>
                                    </div>
                                    </section>
                                )}
                            </Dropzone>
                        </div>
                        <div ref={(ref) => this.messagesRef = ref} className="messages">
                            { 
                                messages.map((mess, index) => { 
                                    const user = _.get(mess, 'user');
                                    return (
                                    <div key={index} className={`${mess.me ? 'message-me' : 'message'}`}>

                                    <img src={_.get(user, 'avatar')} alt="user-img" className="img-user"></img>

                                    <div className="message-body">

                                        <div className="username">{`${mess.me ? 'You' : _.get(mess, 'user.name')}`} say: </div>
                                        
                                        <p className="message-text">
                                                { `${mess.body}`.substring(0, 8) === "uploads/" ?
                                                // this will be either video or image 

                                                (`${mess.body}`).substring((`${mess.body}`).length - 3, (`${mess.body}`).length) === 'mp3' ? 
                                                    <video
                                                        style={{ maxWidth: '20rem' }}
                                                        src={`http://localhost:8080/${mess.body}`} alt="video"
                                                        type="video/mp4" controls
                                                    />
                                                    :
                                                    <img
                                                        style={{ maxWidth: '20rem' }}
                                                        src={`http://localhost:8080/${mess.body}`}
                                                        alt="img"
                                                    />
                                            :
                                            <p>{mess.body}</p>
                                            } 
                                            {/* { this.renderMessage(mess) } */}
                                            <p className="timing">{mess.timing}</p>

                                        </p>
                                    </div>
                                    </div>
                                    );
                                   
                                })
                            }
                                {showEmoji ? <div className="emoji" ref = {(ref) => this.ref = ref}>
                                    <Picker  onEmojiClick={onEmojiClick} skinTone={SKIN_TONE_MEDIUM_DARK}/>
                                </div> : null }
                              
                                 
                        </div>
                        {
                        isShowGetAud ? <div className="getAdi">
                                <div>
                                {this.state.audio ? <AudioAnalyser audio={this.state.audio} /> : null}
                                </div>
                        </div> : null
                        }
                        
                        {_.get(activeChannel, 'typing') && _.get(activeChannel, 'typier') !== _.get(me, '_id') ? <div  disabled = { newMessage.length > 1 } className="typing-status">Is Typing..</div> : null}
                        {   members.size > 0 ? <div className="message-input">
                            <form 
                                onSubmit= { this.handleSubmit }
                                disabled = { newMessage.length < 1 }
                                className="message-form">
                                <IconButton onClick = {() => {this.setState({showEmoji: !showEmoji})}}>
                                    <MdInsertEmoticon />
                                </IconButton>
                                <textarea  
                                    id = "message"
                                    ref={(input)=> this.input = input}
                                    type = "text"
                                    className = "form-control"
                                    value = { newMessage }
                                    autoComplete = {'off'}
                                    placeholder = "Type something interesting"
                                    onKeyUp = { (e) => { 
                                        { if(e.keyCode === 13 && !e.shiftKey) 
                                            { this.handleSubmit(e); }}
                                        { if( e.keyCode !== 13 ){ this.sendTyping() }}
                                        }
                                    }
                                    onChange = {
                                    	({target})=>{
                                    		this.setState({newMessage:target.value})
                                    	}
                                    }
                                    />

                                
                                            {/*onClick = {() => this.toggleMicrophone()} */}
                                        <IconButton  >
                                        <MdMic onMouseDown= {() => {this.startRecording()}} onMouseUp= {() => {this.stopRecording()}} />
                                        </IconButton>
                            
                                <button
                                    disabled = { newMessage.length < 1 }
                                    type = "submit"
                                    className = "send"
                                    onClick = { this.handleSubmit }
                                > Send </button>
                            </form>
			                </div>
                            :
                            null
                        }
                    </div>
                   
                    <div className="sidebar-right">
                        <div className="title-right">Members</div>
                        <div className="chanels">
                            { members.map((member, index) => {

                                const isOnline = _.get(member, 'online', false);
                                return (
                                    <div key ={ index } className="chanel">

                                        <div className="user-img-channel">
                                            <img src={_.get(member, 'avatar')} alt="user-img" />
                                            <span className={className('user-status', {'online': isOnline})}></span>
                                        </div>
                                        <div className="chanel-info">
                                            <h4>{ member.name }</h4>
                                            <p>Joined: 2000 years ago</p>
                                        </div>
                                        <div onClick = {() => {
                                            store.removeMemberFromChannel(activeChannel, member);
                                        }}
                                         className="icon-DelUser">
                                        <IconButton  style={{ color: "rgb(200, 68, 20)", fontSize: "20"}}>
                                            <MdDeleteForever />
                                        </IconButton>
                                        </div>

                                    </div>
                                )
                            })}
                            
                        </div>
                        
                    </div>

                </div>  
            </div>
        )
    }
}



